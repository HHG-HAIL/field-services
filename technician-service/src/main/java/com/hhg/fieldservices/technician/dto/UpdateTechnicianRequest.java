package com.hhg.fieldservices.technician.dto;

import com.hhg.fieldservices.technician.model.SkillLevel;
import com.hhg.fieldservices.technician.model.TechnicianStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for updating an existing technician.
 * All fields are optional to support partial updates.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request to update an existing technician")
public class UpdateTechnicianRequest {

    @Size(min = 1, max = 100, message = "First name must be between 1 and 100 characters")
    @Schema(description = "First name", example = "John")
    private String firstName;

    @Size(min = 1, max = 100, message = "Last name must be between 1 and 100 characters")
    @Schema(description = "Last name", example = "Doe")
    private String lastName;

    @Email(message = "Email must be valid")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    @Schema(description = "Email address", example = "john.doe@example.com")
    private String email;

    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    @Schema(description = "Phone number", example = "+1234567890")
    private String phone;

    @Schema(description = "Current status", example = "ACTIVE")
    private TechnicianStatus status;

    @Schema(description = "Skill level", example = "SENIOR")
    private SkillLevel skillLevel;
}
