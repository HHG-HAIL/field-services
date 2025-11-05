package com.hhg.fieldservices.technician.controller;

import com.hhg.fieldservices.technician.dto.CreateTechnicianRequest;
import com.hhg.fieldservices.technician.dto.ErrorResponse;
import com.hhg.fieldservices.technician.dto.TechnicianDto;
import com.hhg.fieldservices.technician.dto.UpdateTechnicianRequest;
import com.hhg.fieldservices.technician.dto.ValidationErrorResponse;
import com.hhg.fieldservices.technician.model.SkillLevel;
import com.hhg.fieldservices.technician.model.TechnicianStatus;
import com.hhg.fieldservices.technician.service.TechnicianService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing technicians.
 * Provides RESTful endpoints following standard HTTP conventions.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@RestController
@RequestMapping("/api/v1/technicians")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Technicians", description = "Technician management APIs")
public class TechnicianController {

    private final TechnicianService technicianService;

    /**
     * Get all technicians or filter by status/skill level.
     * 
     * @param status optional status filter
     * @param skillLevel optional skill level filter
     * @return list of technicians
     */
    @GetMapping
    @Operation(summary = "Get all technicians", description = "Retrieve all technicians, optionally filtered by status or skill level")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved technicians",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = TechnicianDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid parameters",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<List<TechnicianDto>> getAllTechnicians(
            @Parameter(description = "Filter by status") @RequestParam(required = false) TechnicianStatus status,
            @Parameter(description = "Filter by skill level") @RequestParam(required = false) SkillLevel skillLevel) {
        log.debug("GET /api/v1/technicians - status: {}, skillLevel: {}", status, skillLevel);
        
        List<TechnicianDto> technicians;
        
        if (status != null) {
            technicians = technicianService.findByStatus(status);
        } else if (skillLevel != null) {
            technicians = technicianService.findBySkillLevel(skillLevel);
        } else {
            technicians = technicianService.findAll();
        }
        
        return ResponseEntity.ok(technicians);
    }

    /**
     * Get a technician by ID.
     * 
     * @param id the technician ID
     * @return the technician
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get technician by ID", description = "Retrieve a specific technician by their ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved technician",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = TechnicianDto.class))),
            @ApiResponse(responseCode = "404", description = "Technician not found",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid ID format",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<TechnicianDto> getTechnicianById(
            @Parameter(description = "Technician ID", required = true) @PathVariable Long id) {
        log.debug("GET /api/v1/technicians/{}", id);
        TechnicianDto technician = technicianService.findById(id);
        return ResponseEntity.ok(technician);
    }

    /**
     * Get a technician by employee ID.
     * 
     * @param employeeId the employee ID
     * @return the technician
     */
    @GetMapping("/employee/{employeeId}")
    @Operation(summary = "Get technician by employee ID", description = "Retrieve a specific technician by their employee ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved technician",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = TechnicianDto.class))),
            @ApiResponse(responseCode = "404", description = "Technician not found",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<TechnicianDto> getTechnicianByEmployeeId(
            @Parameter(description = "Employee ID", required = true) @PathVariable String employeeId) {
        log.debug("GET /api/v1/technicians/employee/{}", employeeId);
        TechnicianDto technician = technicianService.findByEmployeeId(employeeId);
        return ResponseEntity.ok(technician);
    }

    /**
     * Create a new technician.
     * 
     * @param request the create request
     * @return the created technician
     */
    @PostMapping
    @Operation(summary = "Create a new technician", description = "Create a new technician with the provided details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Technician created successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = TechnicianDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request data",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ValidationErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Technician already exists",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<TechnicianDto> createTechnician(
            @Parameter(description = "Technician details", required = true) @Valid @RequestBody CreateTechnicianRequest request) {
        log.debug("POST /api/v1/technicians - Creating technician: {}", request);
        TechnicianDto created = technicianService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Update an existing technician.
     * 
     * @param id the technician ID
     * @param request the update request
     * @return the updated technician
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update a technician", description = "Update an existing technician with the provided details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Technician updated successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = TechnicianDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request data",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ValidationErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Technician not found",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Email already exists",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<TechnicianDto> updateTechnician(
            @Parameter(description = "Technician ID", required = true) @PathVariable Long id,
            @Parameter(description = "Updated technician details", required = true) @Valid @RequestBody UpdateTechnicianRequest request) {
        log.debug("PUT /api/v1/technicians/{} - Updating technician: {}", id, request);
        TechnicianDto updated = technicianService.update(id, request);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete a technician.
     * 
     * @param id the technician ID
     * @return no content response
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a technician", description = "Delete a technician by their ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Technician deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Technician not found",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid ID format",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<Void> deleteTechnician(
            @Parameter(description = "Technician ID", required = true) @PathVariable Long id) {
        log.debug("DELETE /api/v1/technicians/{}", id);
        technicianService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
