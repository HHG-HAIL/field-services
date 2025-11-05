package com.hhg.fieldservices.technician.dto;

import com.hhg.fieldservices.technician.model.SkillLevel;
import com.hhg.fieldservices.technician.model.TechnicianStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating a new technician.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request to create a new technician")
public class CreateTechnicianRequest {

    @NotBlank(message = "Employee ID is required")
    @Size(min = 3, max = 50, message = "Employee ID must be between 3 and 50 characters")
    @Schema(description = "Employee ID", example = "EMP001", required = true)
    private String employeeId;

    @NotBlank(message = "First name is required")
    @Size(min = 1, max = 100, message = "First name must be between 1 and 100 characters")
    @Schema(description = "First name", example = "John", required = true)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 1, max = 100, message = "Last name must be between 1 and 100 characters")
    @Schema(description = "Last name", example = "Doe", required = true)
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    @Schema(description = "Email address", example = "john.doe@example.com", required = true)
    private String email;

    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    @Schema(description = "Phone number", example = "+1234567890")
    private String phone;

    @NotNull(message = "Status is required")
    @Schema(description = "Current status", example = "ACTIVE", required = true)
    private TechnicianStatus status;

    @NotNull(message = "Skill level is required")
    @Schema(description = "Skill level", example = "SENIOR", required = true)
    private SkillLevel skillLevel;
}
