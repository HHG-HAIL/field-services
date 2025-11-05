package com.hhg.fieldservices.technician.dto;

import com.hhg.fieldservices.technician.model.TechnicianStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for Technician information.
 * Used for API responses.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Technician information")
public class TechnicianDto {
    
    @Schema(description = "Unique identifier", example = "1")
    private Long id;
    
    @Schema(description = "First name", example = "John")
    private String firstName;
    
    @Schema(description = "Last name", example = "Smith")
    private String lastName;
    
    @Schema(description = "Email address", example = "john.smith@example.com")
    private String email;
    
    @Schema(description = "Phone number", example = "555-1234")
    private String phoneNumber;
    
    @Schema(description = "Street address", example = "123 Main St")
    private String address;
    
    @Schema(description = "City", example = "Springfield")
    private String city;
    
    @Schema(description = "State", example = "IL")
    private String state;
    
    @Schema(description = "ZIP code", example = "62701")
    private String zipCode;
    
    @Schema(description = "Current status", example = "AVAILABLE")
    private TechnicianStatus status;
    
    @Schema(description = "Comma-separated list of skills", example = "HVAC, Electrical, Plumbing")
    private String skills;
    
    @Schema(description = "Comma-separated list of certifications", example = "EPA 608, NATE")
    private String certifications;
    
    @Schema(description = "Additional notes", example = "Preferred for emergency calls")
    private String notes;
    
    @Schema(description = "Creation timestamp", example = "2025-01-15T10:00:00")
    private LocalDateTime createdAt;
    
    @Schema(description = "Last update timestamp", example = "2025-01-16T14:30:00")
    private LocalDateTime updatedAt;
    
    @Schema(description = "Version for optimistic locking", example = "0")
    private Long version;
    
    /**
     * Get full name of technician.
     * @return Full name (first name + last name)
     */
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
