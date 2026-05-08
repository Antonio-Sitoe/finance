package com.finance.finance.exceptions;

import java.time.LocalDateTime;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ApiErrorResponse {
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
    private Map<String, String> fieldErrors;
}
