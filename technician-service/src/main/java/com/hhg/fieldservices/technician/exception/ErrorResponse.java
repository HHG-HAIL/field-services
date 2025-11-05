package com.hhg.fieldservices.technician.exception;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Standard error response structure for REST APIs.
 * Provides consistent error format across all API endpoints.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Error response")
public class ErrorResponse {
    
    @Schema(description = "HTTP status code", example = "404")
    private int status;
    
    @Schema(description = "Error type", example = "Not Found")
    private String error;
    
    @Schema(description = "Error message", example = "Technician not found with id: 1")
    private String message;
    
    @Schema(description = "Request path that caused the error", example = "/api/v1/technicians/1")
    private String path;
    
    @Schema(description = "Error details or validation errors")
    private List<String> details;
    
    @Schema(description = "Timestamp when error occurred", example = "2025-11-05T19:00:00")
    private LocalDateTime timestamp;
}
