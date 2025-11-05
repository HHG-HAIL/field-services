package com.hhg.fieldservices.technician.dto;

import com.hhg.fieldservices.technician.model.TechnicianSkillLevel;
import com.hhg.fieldservices.technician.model.TechnicianStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * DTO for technician data transfer.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Technician data transfer object")
public class TechnicianDto {
    
    @Schema(description = "Technician ID", example = "1")
    private Long id;
    
    @Schema(description = "Employee ID", example = "EMP-001")
    private String employeeId;
    
    @Schema(description = "First name", example = "John")
    private String firstName;
    
    @Schema(description = "Last name", example = "Smith")
    private String lastName;
    
    @Schema(description = "Email address", example = "john.smith@example.com")
    private String email;
    
    @Schema(description = "Phone number", example = "555-0100")
    private String phone;
    
    @Schema(description = "Current status", example = "ACTIVE")
    private TechnicianStatus status;
    
    @Schema(description = "Skill level", example = "SENIOR")
    private TechnicianSkillLevel skillLevel;
    
    @Schema(description = "Set of skills", example = "[\"HVAC\", \"Plumbing\", \"Electrical\"]")
    private Set<String> skills;
    
    @Schema(description = "Address", example = "123 Main St")
    private String address;
    
    @Schema(description = "City", example = "Springfield")
    private String city;
    
    @Schema(description = "State", example = "IL")
    private String state;
    
    @Schema(description = "ZIP code", example = "62701")
    private String zipCode;
    
    @Schema(description = "Additional notes")
    private String notes;
    
    @Schema(description = "Creation timestamp")
    private LocalDateTime createdAt;
    
    @Schema(description = "Last update timestamp")
    private LocalDateTime updatedAt;
    
    @Schema(description = "Version for optimistic locking")
    private Long version;
}
