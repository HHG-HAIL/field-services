package com.hhg.fieldservices.technician.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.hhg.fieldservices.technician.model.SkillLevel;
import com.hhg.fieldservices.technician.model.TechnicianStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for Technician responses.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Technician details")
public class TechnicianDto {

    @Schema(description = "Technician ID", example = "1")
    private Long id;

    @Schema(description = "Employee ID", example = "EMP001")
    private String employeeId;

    @Schema(description = "First name", example = "John")
    private String firstName;

    @Schema(description = "Last name", example = "Doe")
    private String lastName;

    @Schema(description = "Email address", example = "john.doe@example.com")
    private String email;

    @Schema(description = "Phone number", example = "+1234567890")
    private String phone;

    @Schema(description = "Current status", example = "ACTIVE")
    private TechnicianStatus status;

    @Schema(description = "Skill level", example = "SENIOR")
    private SkillLevel skillLevel;

    @Schema(description = "Creation timestamp", example = "2025-11-05T16:56:25")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @Schema(description = "Last update timestamp", example = "2025-11-05T16:56:25")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;
}
