package com.fieldservice.technician.controller;

import com.fieldservice.technician.dto.TechnicianDTO;
import com.fieldservice.technician.entity.Technician;
import com.fieldservice.technician.service.TechnicianService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/technicians")
@Tag(name = "Technicians", description = "Technician management operations")
public class TechnicianController {
    
    @Autowired
    private TechnicianService technicianService;
    
    @GetMapping
    @Operation(summary = "Get all technicians", description = "Retrieve a list of all technicians in the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved technicians",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = TechnicianDTO.class)))
    })
    public ResponseEntity<List<TechnicianDTO>> getAllTechnicians() {
        List<TechnicianDTO> technicians = technicianService.getAllTechnicians();
        return ResponseEntity.ok(technicians);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get technician by ID", description = "Retrieve a specific technician by their ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Technician found",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = TechnicianDTO.class))),
        @ApiResponse(responseCode = "404", description = "Technician not found")
    })
    public ResponseEntity<TechnicianDTO> getTechnicianById(
            @Parameter(description = "ID of the technician to retrieve") @PathVariable Long id) {
        return technicianService.getTechnicianById(id)
                .map(technician -> ResponseEntity.ok(technician))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<TechnicianDTO>> getAvailableTechnicians() {
        List<TechnicianDTO> technicians = technicianService.getAvailableTechnicians();
        return ResponseEntity.ok(technicians);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<TechnicianDTO>> getTechniciansByStatus(@PathVariable Technician.Status status) {
        List<TechnicianDTO> technicians = technicianService.getTechniciansByStatus(status);
        return ResponseEntity.ok(technicians);
    }
    
    @GetMapping("/skill/{skill}")
    public ResponseEntity<List<TechnicianDTO>> getTechniciansBySkill(@PathVariable String skill) {
        List<TechnicianDTO> technicians = technicianService.getTechniciansBySkill(skill);
        return ResponseEntity.ok(technicians);
    }
    
    @GetMapping("/available/skill/{skill}")
    public ResponseEntity<List<TechnicianDTO>> getAvailableTechniciansBySkill(@PathVariable String skill) {
        List<TechnicianDTO> technicians = technicianService.getAvailableTechniciansBySkill(skill);
        return ResponseEntity.ok(technicians);
    }
    
    @GetMapping("/location/{location}")
    public ResponseEntity<List<TechnicianDTO>> getTechniciansByLocation(@PathVariable String location) {
        List<TechnicianDTO> technicians = technicianService.getTechniciansByLocation(location);
        return ResponseEntity.ok(technicians);
    }
    
    @PostMapping
    @Operation(summary = "Create technician", description = "Create a new technician profile")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Technician created successfully",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = TechnicianDTO.class))),
        @ApiResponse(responseCode = "400", description = "Invalid technician data")
    })
    public ResponseEntity<TechnicianDTO> createTechnician(
            @Parameter(description = "Technician data to create") @Valid @RequestBody TechnicianDTO technicianDTO) {
        TechnicianDTO createdTechnician = technicianService.createTechnician(technicianDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTechnician);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TechnicianDTO> updateTechnician(@PathVariable Long id, 
                                                         @Valid @RequestBody TechnicianDTO technicianDTO) {
        return technicianService.updateTechnician(id, technicianDTO)
                .map(technician -> ResponseEntity.ok(technician))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PatchMapping("/{id}/status")
    @Operation(summary = "Update technician status", description = "Update the availability status of a technician")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Status updated successfully",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = TechnicianDTO.class))),
        @ApiResponse(responseCode = "404", description = "Technician not found"),
        @ApiResponse(responseCode = "400", description = "Invalid status value")
    })
    public ResponseEntity<TechnicianDTO> updateTechnicianStatus(
            @Parameter(description = "ID of the technician") @PathVariable Long id, 
            @Parameter(description = "Status update request containing status field") @RequestBody Map<String, String> request) {
        Technician.Status status = Technician.Status.valueOf(request.get("status"));
        return technicianService.updateTechnicianStatus(id, status)
                .map(technician -> ResponseEntity.ok(technician))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PatchMapping("/{id}/location")
    public ResponseEntity<TechnicianDTO> updateTechnicianLocation(@PathVariable Long id, 
                                                                 @RequestBody Map<String, String> request) {
        String location = request.get("location");
        return technicianService.updateTechnicianLocation(id, location)
                .map(technician -> ResponseEntity.ok(technician))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTechnician(@PathVariable Long id) {
        if (technicianService.deleteTechnician(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/stats/count-by-status/{status}")
    public ResponseEntity<Long> getTechnicianCountByStatus(@PathVariable Technician.Status status) {
        long count = technicianService.getTechnicianCountByStatus(status);
        return ResponseEntity.ok(count);
    }
    
    @PostMapping("/find-best")
    public ResponseEntity<TechnicianDTO> findBestTechnicianForSkills(@RequestBody Map<String, List<String>> request) {
        List<String> requiredSkills = request.get("skills");
        return technicianService.findBestTechnicianForSkills(requiredSkills)
                .map(technician -> ResponseEntity.ok(technician))
                .orElse(ResponseEntity.notFound().build());
    }
}