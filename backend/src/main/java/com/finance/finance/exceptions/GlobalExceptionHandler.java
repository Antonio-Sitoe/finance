package com.finance.finance.exceptions;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleResourceNotFound(
            ResourceNotFoundException ex,
            HttpServletRequest request) {
        logger.warn("Resource not found: {} - path={}", ex.getMessage(), request.getRequestURI());
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request.getRequestURI(), null, null);
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiErrorResponse> handleBusiness(
            BusinessException ex,
            HttpServletRequest request) {
        logger.warn("Business rule violation: {} - path={}", ex.getMessage(), request.getRequestURI());
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), request.getRequestURI(), null, null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        logger.warn("Validation error on path {}: {}", request.getRequestURI(), fieldErrors);

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                "Dados inválidos na requisição",
                request.getRequestURI(),
                "Validation failed",
                fieldErrors);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleHttpMessageNotReadable(
            HttpMessageNotReadableException ex,
            HttpServletRequest request) {
        String message = "JSON inválido: verifique se os tipos dos campos estão corretos.";

        Throwable cause = ex.getCause();
        if (cause instanceof InvalidFormatException invalidFormat) {
            String fieldPath = invalidFormat.getPath().stream()
                    .map(JsonMappingException.Reference::getFieldName)
                    .filter(Objects::nonNull)
                    .collect(Collectors.joining("."));

            String expectedType = invalidFormat.getTargetType() != null
                    ? invalidFormat.getTargetType().getSimpleName()
                    : "tipo esperado";

            Object receivedValue = invalidFormat.getValue();

            if (fieldPath == null || fieldPath.isBlank()) {
                message = String.format(
                        "Tipo de dado inválido no JSON. Valor recebido: '%s'. Tipo esperado: %s.",
                        receivedValue,
                        expectedType);
            } else {
                message = String.format(
                        "Tipo de dado inválido para o campo '%s'. Valor recebido: '%s'. Tipo esperado: %s.",
                        fieldPath,
                        receivedValue,
                        expectedType);
            }
        }

        logger.warn("JSON parse/read error on path {}: {}", request.getRequestURI(), ex.getMessage());

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                message,
                request.getRequestURI(),
                ex.getClass().getSimpleName(),
                null);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleDataIntegrity(
            DataIntegrityViolationException ex,
            HttpServletRequest request) {
        // Log full exception for debugging
        logger.error("Data integrity violation on path {}", request.getRequestURI(), ex);

        // Return safe message to client without SQL or internal details
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                "Violação de integridade de dados",
                request.getRequestURI(),
                ex.getClass().getSimpleName(),
                null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGeneric(
            Exception ex,
            HttpServletRequest request) {
        logger.error("Unexpected error on path {}", request.getRequestURI(), ex);

        String safeDebugMessage = ex.getClass().getSimpleName();

        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Erro interno inesperado",
                request.getRequestURI(),
                safeDebugMessage,
                null);
    }

    private ResponseEntity<ApiErrorResponse> buildResponse(
            HttpStatus status,
            String message,
            String path,
            String debugMessage,
            Map<String, String> fieldErrors) {
        ApiErrorResponse body = ApiErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .path(path)
                .fieldErrors(fieldErrors)
                .build();

        return ResponseEntity.status(status).body(body);
    }
}
