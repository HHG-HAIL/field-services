package com.hhg.fieldservices.technician.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hhg.fieldservices.technician.dto.CreateTechnicianRequest;
import com.hhg.fieldservices.technician.dto.TechnicianDto;
import com.hhg.fieldservices.technician.dto.UpdateTechnicianRequest;
import com.hhg.fieldservices.technician.exception.TechnicianNotFoundException;
import com.hhg.fieldservices.technician.exception.TechnicianValidationException;
import com.hhg.fieldservices.technician.model.TechnicianSkillLevel;
import com.hhg.fieldservices.technician.model.TechnicianStatus;
import com.hhg.fieldservices.technician.service.TechnicianService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Set;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for TechnicianController.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@WebMvcTest(TechnicianController.class)
class TechnicianControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @MockBean
    private TechnicianService technicianService;
    
    private TechnicianDto testTechnicianDto;
    private CreateTechnicianRequest createRequest;
    
    @BeforeEach
    void setUp() {
        testTechnicianDto = TechnicianDto.builder()
            .id(1L)
            .employeeId("EMP-001")
            .firstName("John")
            .lastName("Smith")
            .email("john.smith@example.com")
            .phone("555-0100")
            .status(TechnicianStatus.ACTIVE)
            .skillLevel(TechnicianSkillLevel.SENIOR)
            .skills(Set.of("HVAC", "Plumbing"))
            .city("Springfield")
            .state("IL")
            .build();
        
        createRequest = CreateTechnicianRequest.builder()
            .employeeId("EMP-002")
            .firstName("Jane")
            .lastName("Doe")
            .email("jane.doe@example.com")
            .phone("555-0200")
            .status(TechnicianStatus.ACTIVE)
            .skillLevel(TechnicianSkillLevel.INTERMEDIATE)
            .skills(Set.of("Electrical"))
            .build();
    }
    
    @Test
    void whenGetAllTechnicians_thenReturnTechniciansList() throws Exception {
        // Given
        when(technicianService.findAll()).thenReturn(List.of(testTechnicianDto));
        
        // When & Then
        mockMvc.perform(get("/api/v1/technicians"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].employeeId").value("EMP-001"))
            .andExpect(jsonPath("$[0].firstName").value("John"))
            .andExpect(jsonPath("$[0].lastName").value("Smith"));
        
        verify(technicianService).findAll();
    }
    
    @Test
    void givenValidId_whenGetTechnicianById_thenReturnTechnician() throws Exception {
        // Given
        when(technicianService.findById(1L)).thenReturn(testTechnicianDto);
        
        // When & Then
        mockMvc.perform(get("/api/v1/technicians/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.employeeId").value("EMP-001"))
            .andExpect(jsonPath("$.status").value("ACTIVE"));
        
        verify(technicianService).findById(1L);
    }
    
    @Test
    void givenInvalidId_whenGetTechnicianById_thenReturn404() throws Exception {
        // Given
        when(technicianService.findById(99L)).thenThrow(new TechnicianNotFoundException(99L));
        
        // When & Then
        mockMvc.perform(get("/api/v1/technicians/99"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.status").value(404))
            .andExpect(jsonPath("$.message").value("Technician not found with id: 99"))
            .andExpect(jsonPath("$.path").value("/api/v1/technicians/99"));
        
        verify(technicianService).findById(99L);
    }
    
    @Test
    void givenValidEmployeeId_whenGetTechnicianByEmployeeId_thenReturnTechnician() throws Exception {
        // Given
        when(technicianService.findByEmployeeId("EMP-001")).thenReturn(testTechnicianDto);
        
        // When & Then
        mockMvc.perform(get("/api/v1/technicians/employee/EMP-001"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.employeeId").value("EMP-001"))
            .andExpect(jsonPath("$.firstName").value("John"));
        
        verify(technicianService).findByEmployeeId("EMP-001");
    }
    
    @Test
    void whenGetTechniciansByStatus_thenReturnTechniciansList() throws Exception {
        // Given
        when(technicianService.findByStatus(TechnicianStatus.ACTIVE))
            .thenReturn(List.of(testTechnicianDto));
        
        // When & Then
        mockMvc.perform(get("/api/v1/technicians/status/ACTIVE"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].status").value("ACTIVE"));
        
        verify(technicianService).findByStatus(TechnicianStatus.ACTIVE);
    }
    
    @Test
    void whenGetTechniciansBySkillLevel_thenReturnTechniciansList() throws Exception {
        // Given
        when(technicianService.findBySkillLevel(TechnicianSkillLevel.SENIOR))
            .thenReturn(List.of(testTechnicianDto));
        
        // When & Then
        mockMvc.perform(get("/api/v1/technicians/skill-level/SENIOR"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].skillLevel").value("SENIOR"));
        
        verify(technicianService).findBySkillLevel(TechnicianSkillLevel.SENIOR);
    }
    
    @Test
    void whenGetTechniciansBySkill_thenReturnTechniciansList() throws Exception {
        // Given
        when(technicianService.findBySkill("HVAC")).thenReturn(List.of(testTechnicianDto));
        
        // When & Then
        mockMvc.perform(get("/api/v1/technicians/skill/HVAC"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)));
        
        verify(technicianService).findBySkill("HVAC");
    }
    
    @Test
    void givenValidRequest_whenCreateTechnician_thenReturnCreated() throws Exception {
        // Given
        TechnicianDto createdDto = TechnicianDto.builder()
            .id(2L)
            .employeeId(createRequest.getEmployeeId())
            .firstName(createRequest.getFirstName())
            .lastName(createRequest.getLastName())
            .email(createRequest.getEmail())
            .phone(createRequest.getPhone())
            .status(createRequest.getStatus())
            .skillLevel(createRequest.getSkillLevel())
            .skills(createRequest.getSkills())
            .build();
        
        when(technicianService.create(any(CreateTechnicianRequest.class))).thenReturn(createdDto);
        
        // When & Then
        mockMvc.perform(post("/api/v1/technicians")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(2))
            .andExpect(jsonPath("$.employeeId").value("EMP-002"))
            .andExpect(jsonPath("$.firstName").value("Jane"));
        
        verify(technicianService).create(any(CreateTechnicianRequest.class));
    }
    
    @Test
    void givenInvalidRequest_whenCreateTechnician_thenReturnBadRequest() throws Exception {
        // Given - request with missing required fields
        CreateTechnicianRequest invalidRequest = CreateTechnicianRequest.builder()
            .firstName("Jane")
            // Missing required fields
            .build();
        
        // When & Then
        mockMvc.perform(post("/api/v1/technicians")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.status").value(400))
            .andExpect(jsonPath("$.path").value("/api/v1/technicians"))
            .andExpect(jsonPath("$.details").isArray());
        
        verify(technicianService, never()).create(any());
    }
    
    @Test
    void givenValidRequest_whenUpdateTechnician_thenReturnUpdated() throws Exception {
        // Given
        UpdateTechnicianRequest updateRequest = UpdateTechnicianRequest.builder()
            .firstName("John")
            .lastName("Doe")
            .status(TechnicianStatus.BUSY)
            .build();
        
        TechnicianDto updatedDto = TechnicianDto.builder()
            .id(1L)
            .employeeId("EMP-001")
            .firstName("John")
            .lastName("Doe")
            .email("john.smith@example.com")
            .status(TechnicianStatus.BUSY)
            .skillLevel(TechnicianSkillLevel.SENIOR)
            .build();
        
        when(technicianService.update(eq(1L), any(UpdateTechnicianRequest.class)))
            .thenReturn(updatedDto);
        
        // When & Then
        mockMvc.perform(put("/api/v1/technicians/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.lastName").value("Doe"))
            .andExpect(jsonPath("$.status").value("BUSY"));
        
        verify(technicianService).update(eq(1L), any(UpdateTechnicianRequest.class));
    }
    
    @Test
    void givenValidId_whenDeleteTechnician_thenReturn204() throws Exception {
        // Given
        doNothing().when(technicianService).delete(1L);
        
        // When & Then
        mockMvc.perform(delete("/api/v1/technicians/1"))
            .andExpect(status().isNoContent());
        
        verify(technicianService).delete(1L);
    }
    
    @Test
    void givenInvalidId_whenDeleteTechnician_thenReturn404() throws Exception {
        // Given
        doThrow(new TechnicianNotFoundException(99L)).when(technicianService).delete(99L);
        
        // When & Then
        mockMvc.perform(delete("/api/v1/technicians/99"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.status").value(404))
            .andExpect(jsonPath("$.path").value("/api/v1/technicians/99"));
        
        verify(technicianService).delete(99L);
    }
    
    @Test
    void givenInvalidJsonBody_whenCreateTechnician_thenReturnBadRequest() throws Exception {
        // Given - invalid JSON
        String invalidJson = "{ invalid json }";
        
        // When & Then
        mockMvc.perform(post("/api/v1/technicians")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidJson))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.status").value(400))
            .andExpect(jsonPath("$.error").value("Bad Request"))
            .andExpect(jsonPath("$.message").value("Invalid request body format"))
            .andExpect(jsonPath("$.path").value("/api/v1/technicians"));
        
        verify(technicianService, never()).create(any());
    }
    
    @Test
    void givenInvalidPathVariable_whenGetTechnicianById_thenReturnBadRequest() throws Exception {
        // When & Then - passing a non-numeric ID
        mockMvc.perform(get("/api/v1/technicians/invalid-id"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.status").value(400))
            .andExpect(jsonPath("$.error").value("Bad Request"))
            .andExpect(jsonPath("$.path").value("/api/v1/technicians/invalid-id"));
        
        verify(technicianService, never()).findById(any());
    }
    
    @Test
    void givenDuplicateEmployeeId_whenCreateTechnician_thenReturnConflict() throws Exception {
        // Given - employee ID already exists
        when(technicianService.create(any(CreateTechnicianRequest.class)))
            .thenThrow(new TechnicianValidationException("Technician with employee ID EMP-002 already exists"));
        
        // When & Then
        mockMvc.perform(post("/api/v1/technicians")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest)))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.status").value(409))
            .andExpect(jsonPath("$.error").value("Conflict"))
            .andExpect(jsonPath("$.message").value("Technician with employee ID EMP-002 already exists"))
            .andExpect(jsonPath("$.path").value("/api/v1/technicians"));
        
        verify(technicianService).create(any(CreateTechnicianRequest.class));
    }
}
