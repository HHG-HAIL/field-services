package com.hhg.fieldservices.technician.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Standard error response DTO for API error responses.
 * Provides consistent error information across all endpoints.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Standard error response")
public class ErrorResponse {

    @Schema(description = "HTTP status code", example = "404")
    private int status;

    @Schema(description = "Error message", example = "Resource not found")
    private String message;

    @Schema(description = "Detailed error description", example = "Technician with ID 123 not found")
    private String details;

    @Schema(description = "Timestamp of the error", example = "2025-11-05T16:56:25")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;

    @Schema(description = "Request path where the error occurred", example = "/api/v1/technicians/123")
    private String path;

    /**
     * Creates an ErrorResponse with the given parameters.
     * 
     * @param status HTTP status code
     * @param message error message
     * @param details detailed error description
     * @param path request path
     * @return ErrorResponse instance
     */
    public static ErrorResponse of(int status, String message, String details, String path) {
        return ErrorResponse.builder()
                .status(status)
                .message(message)
                .details(details)
                .timestamp(LocalDateTime.now())
                .path(path)
                .build();
    }
}
