package com.hhg.fieldservices.technician.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Validation error response DTO for handling validation failures.
 * Extends the standard error response with field-specific validation errors.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Validation error response with field-level errors")
public class ValidationErrorResponse {

    @Schema(description = "HTTP status code", example = "400")
    private int status;

    @Schema(description = "Error message", example = "Validation failed")
    private String message;

    @Schema(description = "Timestamp of the error", example = "2025-11-05T16:56:25")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;

    @Schema(description = "Request path where the error occurred", example = "/api/v1/technicians")
    private String path;

    @Schema(description = "Map of field names to their validation error messages")
    private Map<String, List<String>> errors;

    /**
     * Creates a ValidationErrorResponse with the given parameters.
     * 
     * @param status HTTP status code
     * @param message error message
     * @param path request path
     * @param errors map of field names to validation errors
     * @return ValidationErrorResponse instance
     */
    public static ValidationErrorResponse of(int status, String message, String path, Map<String, List<String>> errors) {
        return ValidationErrorResponse.builder()
                .status(status)
                .message(message)
                .timestamp(LocalDateTime.now())
                .path(path)
                .errors(errors)
                .build();
    }
}
