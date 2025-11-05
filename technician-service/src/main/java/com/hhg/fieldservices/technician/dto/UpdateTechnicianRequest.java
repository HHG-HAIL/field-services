package com.hhg.fieldservices.technician.dto;

import com.hhg.fieldservices.technician.model.TechnicianSkillLevel;
import com.hhg.fieldservices.technician.model.TechnicianStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

/**
 * Request DTO for updating an existing technician.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request for updating an existing technician")
public class UpdateTechnicianRequest {
    
    @Schema(description = "First name", example = "John")
    @Size(min = 2, max = 100, message = "First name must be between 2 and 100 characters")
    private String firstName;
    
    @Schema(description = "Last name", example = "Smith")
    @Size(min = 2, max = 100, message = "Last name must be between 2 and 100 characters")
    private String lastName;
    
    @Schema(description = "Email address", example = "john.smith@example.com")
    @Email(message = "Invalid email format")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;
    
    @Schema(description = "Phone number", example = "555-0100")
    @Pattern(regexp = "^[0-9\\-\\+\\(\\)\\s]*$", message = "Invalid phone number format")
    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    private String phone;
    
    @Schema(description = "Current status", example = "ACTIVE")
    private TechnicianStatus status;
    
    @Schema(description = "Skill level", example = "SENIOR")
    private TechnicianSkillLevel skillLevel;
    
    @Schema(description = "Set of skills", example = "[\"HVAC\", \"Plumbing\", \"Electrical\"]")
    private Set<String> skills;
    
    @Schema(description = "Address", example = "123 Main St")
    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;
    
    @Schema(description = "City", example = "Springfield")
    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;
    
    @Schema(description = "State", example = "IL")
    @Size(max = 50, message = "State must not exceed 50 characters")
    private String state;
    
    @Schema(description = "ZIP code", example = "62701")
    @Pattern(regexp = "^[0-9]{5}(-[0-9]{4})?$", message = "Invalid ZIP code format")
    private String zipCode;
    
    @Schema(description = "Additional notes")
    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;
}
