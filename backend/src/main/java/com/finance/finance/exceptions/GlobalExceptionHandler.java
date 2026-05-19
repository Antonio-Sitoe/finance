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
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.HttpRequestMethodNotSupportedException;

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
                                "Dados inválidos na requisição. Corrija os campos indicados em 'fieldErrors'.",
                                request.getRequestURI(),
                                null,
                                fieldErrors);
        }

        @ExceptionHandler(MissingServletRequestParameterException.class)
        public ResponseEntity<ApiErrorResponse> handleMissingParam(
                        MissingServletRequestParameterException ex,
                        HttpServletRequest request) {
                logger.warn("Missing request parameter on path {}: {}", request.getRequestURI(), ex.getMessage());
                String message = String.format("Parâmetro obrigatório ausente: '%s' (tipo: %s).",
                                ex.getParameterName(), ex.getParameterType());
                return buildResponse(HttpStatus.BAD_REQUEST, message, request.getRequestURI(), null, null);
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
                                ex.getClass().getSimpleName() + ": " + ex.getMessage(),
                                null);
        }

        @ExceptionHandler(DataIntegrityViolationException.class)
        public ResponseEntity<ApiErrorResponse> handleDataIntegrity(
                        DataIntegrityViolationException ex,
                        HttpServletRequest request) {
                logger.error("Data integrity violation on path {}", request.getRequestURI(), ex);

                Throwable root = ex.getRootCause();
                String rootMsg = root != null ? root.getMessage().toLowerCase() : "";
                String debugMessage = ex.getClass().getSimpleName() + ": "
                                + (root != null ? root.getMessage() : ex.getMessage());

                if (rootMsg.contains("unique") || rootMsg.contains("duplicate")) {
                        return buildResponse(
                                        HttpStatus.CONFLICT,
                                        "Já existe um registro com esses dados. Verifique os campos que devem ser únicos.",
                                        request.getRequestURI(),
                                        debugMessage,
                                        null);
                }

                if (rootMsg.contains("foreign key") || rootMsg.contains("fk_")) {
                        return buildResponse(
                                        HttpStatus.BAD_REQUEST,
                                        "Referência inválida: o registro relacionado não existe ou não pode ser removido por estar em uso.",
                                        request.getRequestURI(),
                                        debugMessage,
                                        null);
                }

                return buildResponse(
                                HttpStatus.BAD_REQUEST,
                                "Violação de integridade de dados. Verifique os campos enviados.",
                                request.getRequestURI(),
                                debugMessage,
                                null);
        }

        @ExceptionHandler(jakarta.validation.ValidationException.class)
        public ResponseEntity<ApiErrorResponse> handleJakartaValidationException(
                        jakarta.validation.ValidationException ex,
                        HttpServletRequest request) {
                logger.error("Validation configuration error on path {}", request.getRequestURI(), ex);

                return buildResponse(
                                HttpStatus.BAD_REQUEST,
                                "Erro na validação dos dados enviados.",
                                request.getRequestURI(),
                                ex.getClass().getSimpleName() + ": " + ex.getMessage(),
                                null);
        }

        @ExceptionHandler(NoHandlerFoundException.class)
        public ResponseEntity<ApiErrorResponse> handleNoHandlerFound(
                        NoHandlerFoundException ex,
                        HttpServletRequest request) {
                logger.warn("No handler found: {} {}", ex.getHttpMethod(), ex.getRequestURL());
                String message = String.format("Rota não encontrada: %s %s.", ex.getHttpMethod(), ex.getRequestURL());
                return buildResponse(HttpStatus.NOT_FOUND, message, request.getRequestURI(), null, null);
        }

        @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
        public ResponseEntity<ApiErrorResponse> handleMethodNotSupported(
                        HttpRequestMethodNotSupportedException ex,
                        HttpServletRequest request) {
                logger.warn("Method not supported: {} on path {}", ex.getMethod(), request.getRequestURI());
                String supported = ex.getSupportedHttpMethods() != null
                                ? ex.getSupportedHttpMethods().toString()
                                : "desconhecido";
                String message = String.format(
                                "Método HTTP '%s' não suportado para esta rota. Métodos aceites: %s.",
                                ex.getMethod(), supported);
                return buildResponse(HttpStatus.METHOD_NOT_ALLOWED, message, request.getRequestURI(), null, null);
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ApiErrorResponse> handleGeneric(
                        Exception ex,
                        HttpServletRequest request) {
                logger.error("Unexpected error on path {}", request.getRequestURI(), ex);

                String debugMessage = ex.getClass().getName() + ": " + ex.getMessage();

                return buildResponse(
                                HttpStatus.INTERNAL_SERVER_ERROR,
                                "Erro interno no servidor. Se o problema persistir, contacte o suporte.",
                                request.getRequestURI(),
                                debugMessage,
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
                                .debugMessage(debugMessage)
                                .path(path)
                                .fieldErrors(fieldErrors)
                                .build();

                return ResponseEntity.status(status).body(body);
        }
}
