package com.hhg.fieldservices.technician.dto;

import com.hhg.fieldservices.technician.model.TechnicianStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request object for updating an existing technician.
 * All fields are optional - only provided fields will be updated.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request to update an existing technician")
public class UpdateTechnicianRequest {
    
    @Size(min = 2, max = 100, message = "First name must be between 2 and 100 characters")
    @Schema(description = "First name", example = "John")
    private String firstName;
    
    @Size(min = 2, max = 100, message = "Last name must be between 2 and 100 characters")
    @Schema(description = "Last name", example = "Smith")
    private String lastName;
    
    @Email(message = "Email must be valid")
    @Schema(description = "Email address", example = "john.smith@example.com")
    private String email;
    
    @Pattern(regexp = "^[0-9\\-\\s\\(\\)\\+\\.]+$", message = "Phone number must contain only valid characters")
    @Schema(description = "Phone number", example = "555-1234")
    private String phoneNumber;
    
    @Size(max = 500, message = "Address must not exceed 500 characters")
    @Schema(description = "Street address", example = "123 Main St")
    private String address;
    
    @Size(max = 100, message = "City must not exceed 100 characters")
    @Schema(description = "City", example = "Springfield")
    private String city;
    
    @Size(max = 50, message = "State must not exceed 50 characters")
    @Schema(description = "State", example = "IL")
    private String state;
    
    @Pattern(regexp = "^[0-9]{5}(-[0-9]{4})?$|^$", message = "ZIP code must be in format 12345 or 12345-6789")
    @Schema(description = "ZIP code", example = "62701")
    private String zipCode;
    
    @Schema(description = "Technician status", example = "ON_JOB")
    private TechnicianStatus status;
    
    @Size(max = 1000, message = "Skills must not exceed 1000 characters")
    @Schema(description = "Comma-separated list of skills", example = "HVAC, Electrical, Plumbing")
    private String skills;
    
    @Size(max = 1000, message = "Certifications must not exceed 1000 characters")
    @Schema(description = "Comma-separated list of certifications", example = "EPA 608, NATE")
    private String certifications;
    
    @Size(max = 2000, message = "Notes must not exceed 2000 characters")
    @Schema(description = "Additional notes", example = "Preferred for emergency calls")
    private String notes;
}
