package com.hhg.fieldservices.technician.controller;

import com.hhg.fieldservices.technician.dto.CreateTechnicianRequest;
import com.hhg.fieldservices.technician.dto.TechnicianDto;
import com.hhg.fieldservices.technician.dto.UpdateTechnicianRequest;
import com.hhg.fieldservices.technician.exception.ErrorResponse;
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
 * REST controller for technician operations.
 * Provides endpoints for CRUD operations and technician management.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@RestController
@RequestMapping("/api/v1/technicians")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH, RequestMethod.OPTIONS})
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Technicians", description = "Technician Management API")
public class TechnicianController {
    
    private final TechnicianService technicianService;
    
    /**
     * Get all technicians.
     */
    @Operation(
        summary = "Get all technicians",
        description = "Retrieves a list of all technicians in the system"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved technicians")
    })
    @GetMapping
    public ResponseEntity<List<TechnicianDto>> getAllTechnicians() {
        log.debug("GET /api/v1/technicians - Fetching all technicians");
        List<TechnicianDto> technicians = technicianService.findAll();
        return ResponseEntity.ok(technicians);
    }
    
    /**
     * Get technician by ID.
     */
    @Operation(
        summary = "Get technician by ID",
        description = "Retrieves a specific technician by their unique identifier"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Technician found",
            content = @Content(schema = @Schema(implementation = TechnicianDto.class))),
        @ApiResponse(responseCode = "404", description = "Technician not found",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<TechnicianDto> getTechnicianById(
            @Parameter(description = "Technician ID", required = true, example = "1")
            @PathVariable Long id) {
        log.debug("GET /api/v1/technicians/{} - Fetching technician by id", id);
        TechnicianDto technician = technicianService.findById(id);
        return ResponseEntity.ok(technician);
    }
    
    /**
     * Get technician by email.
     */
    @Operation(
        summary = "Get technician by email",
        description = "Retrieves a technician by their email address"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Technician found"),
        @ApiResponse(responseCode = "404", description = "Technician not found",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/email/{email}")
    public ResponseEntity<TechnicianDto> getTechnicianByEmail(
            @Parameter(description = "Email address", required = true, example = "john.smith@example.com")
            @PathVariable String email) {
        log.debug("GET /api/v1/technicians/email/{} - Fetching technician by email", email);
        TechnicianDto technician = technicianService.findByEmail(email);
        return ResponseEntity.ok(technician);
    }
    
    /**
     * Get technicians by status.
     */
    @Operation(
        summary = "Get technicians by status",
        description = "Retrieves all technicians with the specified status"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved technicians")
    })
    @GetMapping("/status/{status}")
    public ResponseEntity<List<TechnicianDto>> getTechniciansByStatus(
            @Parameter(description = "Technician status", required = true)
            @PathVariable TechnicianStatus status) {
        log.debug("GET /api/v1/technicians/status/{} - Fetching technicians by status", status);
        List<TechnicianDto> technicians = technicianService.findByStatus(status);
        return ResponseEntity.ok(technicians);
    }
    
    /**
     * Get available technicians.
     */
    @Operation(
        summary = "Get available technicians",
        description = "Retrieves all technicians with AVAILABLE status for work order assignment"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved available technicians")
    })
    @GetMapping("/available")
    public ResponseEntity<List<TechnicianDto>> getAvailableTechnicians() {
        log.debug("GET /api/v1/technicians/available - Fetching available technicians");
        List<TechnicianDto> technicians = technicianService.findAvailableTechnicians();
        return ResponseEntity.ok(technicians);
    }
    
    /**
     * Get technicians by skill.
     */
    @Operation(
        summary = "Get technicians by skill",
        description = "Retrieves all technicians with the specified skill"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved technicians")
    })
    @GetMapping("/skill/{skill}")
    public ResponseEntity<List<TechnicianDto>> getTechniciansBySkill(
            @Parameter(description = "Skill name", required = true, example = "HVAC")
            @PathVariable String skill) {
        log.debug("GET /api/v1/technicians/skill/{} - Fetching technicians by skill", skill);
        List<TechnicianDto> technicians = technicianService.findBySkill(skill);
        return ResponseEntity.ok(technicians);
    }
    
    /**
     * Get technicians by city.
     */
    @Operation(
        summary = "Get technicians by city",
        description = "Retrieves all technicians in the specified city"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved technicians")
    })
    @GetMapping("/city/{city}")
    public ResponseEntity<List<TechnicianDto>> getTechniciansByCity(
            @Parameter(description = "City name", required = true, example = "Springfield")
            @PathVariable String city) {
        log.debug("GET /api/v1/technicians/city/{} - Fetching technicians by city", city);
        List<TechnicianDto> technicians = technicianService.findByCity(city);
        return ResponseEntity.ok(technicians);
    }
    
    /**
     * Get technicians by state.
     */
    @Operation(
        summary = "Get technicians by state",
        description = "Retrieves all technicians in the specified state"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved technicians")
    })
    @GetMapping("/state/{state}")
    public ResponseEntity<List<TechnicianDto>> getTechniciansByState(
            @Parameter(description = "State code", required = true, example = "IL")
            @PathVariable String state) {
        log.debug("GET /api/v1/technicians/state/{} - Fetching technicians by state", state);
        List<TechnicianDto> technicians = technicianService.findByState(state);
        return ResponseEntity.ok(technicians);
    }
    
    /**
     * Create a new technician.
     */
    @Operation(
        summary = "Create new technician",
        description = "Creates a new technician with the provided details"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Technician created successfully",
            content = @Content(schema = @Schema(implementation = TechnicianDto.class))),
        @ApiResponse(responseCode = "400", description = "Invalid request data",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "409", description = "Technician with email already exists",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping
    public ResponseEntity<TechnicianDto> createTechnician(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Technician creation request",
                required = true
            )
            @Valid @RequestBody CreateTechnicianRequest request) {
        log.debug("POST /api/v1/technicians - Creating new technician: {} {}", 
                  request.getFirstName(), request.getLastName());
        TechnicianDto created = technicianService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    /**
     * Update an existing technician.
     */
    @Operation(
        summary = "Update technician",
        description = "Updates an existing technician with the provided details"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Technician updated successfully",
            content = @Content(schema = @Schema(implementation = TechnicianDto.class))),
        @ApiResponse(responseCode = "404", description = "Technician not found",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid request data",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<TechnicianDto> updateTechnician(
            @Parameter(description = "Technician ID", required = true, example = "1")
            @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Technician update request",
                required = true
            )
            @Valid @RequestBody UpdateTechnicianRequest request) {
        log.debug("PUT /api/v1/technicians/{} - Updating technician", id);
        TechnicianDto updated = technicianService.update(id, request);
        return ResponseEntity.ok(updated);
    }
    
    /**
     * Update technician status.
     */
    @Operation(
        summary = "Update technician status",
        description = "Updates the status of a technician (e.g., AVAILABLE, ON_JOB, OFF_DUTY)"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Technician status updated successfully",
            content = @Content(schema = @Schema(implementation = TechnicianDto.class))),
        @ApiResponse(responseCode = "404", description = "Technician not found",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PatchMapping("/{id}/status")
    public ResponseEntity<TechnicianDto> updateTechnicianStatus(
            @Parameter(description = "Technician ID", required = true, example = "1")
            @PathVariable Long id,
            @Parameter(description = "New status", required = true)
            @RequestParam TechnicianStatus status) {
        log.debug("PATCH /api/v1/technicians/{}/status - Updating status to {}", id, status);
        TechnicianDto updated = technicianService.updateStatus(id, status);
        return ResponseEntity.ok(updated);
    }
    
    /**
     * Delete a technician.
     */
    @Operation(
        summary = "Delete technician",
        description = "Deletes a technician by their ID"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Technician deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Technician not found",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTechnician(
            @Parameter(description = "Technician ID", required = true, example = "1")
            @PathVariable Long id) {
        log.debug("DELETE /api/v1/technicians/{} - Deleting technician", id);
        technicianService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
