package com.hhg.fieldservices.technician.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hhg.fieldservices.technician.dto.CreateTechnicianRequest;
import com.hhg.fieldservices.technician.dto.TechnicianDto;
import com.hhg.fieldservices.technician.dto.UpdateTechnicianRequest;
import com.hhg.fieldservices.technician.exception.DuplicateResourceException;
import com.hhg.fieldservices.technician.exception.ResourceNotFoundException;
import com.hhg.fieldservices.technician.model.SkillLevel;
import com.hhg.fieldservices.technician.model.TechnicianStatus;
import com.hhg.fieldservices.technician.service.TechnicianService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
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

    @Test
    void getAllTechnicians_ReturnsListOfTechnicians() throws Exception {
        // Given
        List<TechnicianDto> technicians = Arrays.asList(
                createTestTechnicianDto(1L, "EMP001"),
                createTestTechnicianDto(2L, "EMP002")
        );
        when(technicianService.findAll()).thenReturn(technicians);

        // When/Then
        mockMvc.perform(get("/api/v1/technicians"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].employeeId").value("EMP001"))
                .andExpect(jsonPath("$[1].id").value(2));
    }

    @Test
    void getAllTechnicians_WithStatusFilter_ReturnsFilteredList() throws Exception {
        // Given
        List<TechnicianDto> technicians = List.of(createTestTechnicianDto(1L, "EMP001"));
        when(technicianService.findByStatus(TechnicianStatus.ACTIVE)).thenReturn(technicians);

        // When/Then
        mockMvc.perform(get("/api/v1/technicians")
                        .param("status", "ACTIVE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].status").value("ACTIVE"));
    }

    @Test
    void getTechnicianById_WhenExists_ReturnsTechnician() throws Exception {
        // Given
        TechnicianDto technician = createTestTechnicianDto(1L, "EMP001");
        when(technicianService.findById(1L)).thenReturn(technician);

        // When/Then
        mockMvc.perform(get("/api/v1/technicians/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.employeeId").value("EMP001"))
                .andExpect(jsonPath("$.firstName").value("John"));
    }

    @Test
    void getTechnicianById_WhenNotExists_ReturnsNotFound() throws Exception {
        // Given
        when(technicianService.findById(999L)).thenThrow(new ResourceNotFoundException("Technician with ID 999 not found"));

        // When/Then
        mockMvc.perform(get("/api/v1/technicians/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Resource Not Found"))
                .andExpect(jsonPath("$.details").value("Technician with ID 999 not found"));
    }

    @Test
    void getTechnicianById_WithInvalidId_ReturnsBadRequest() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/v1/technicians/invalid"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Invalid Parameter Type"));
    }

    @Test
    void getTechnicianByEmployeeId_WhenExists_ReturnsTechnician() throws Exception {
        // Given
        TechnicianDto technician = createTestTechnicianDto(1L, "EMP001");
        when(technicianService.findByEmployeeId("EMP001")).thenReturn(technician);

        // When/Then
        mockMvc.perform(get("/api/v1/technicians/employee/EMP001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.employeeId").value("EMP001"));
    }

    @Test
    void createTechnician_WithValidData_ReturnsCreated() throws Exception {
        // Given
        CreateTechnicianRequest request = createTestCreateRequest();
        TechnicianDto created = createTestTechnicianDto(1L, "EMP001");
        when(technicianService.create(any(CreateTechnicianRequest.class))).thenReturn(created);

        // When/Then
        mockMvc.perform(post("/api/v1/technicians")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.employeeId").value("EMP001"));
    }

    @Test
    void createTechnician_WithInvalidData_ReturnsBadRequest() throws Exception {
        // Given - empty request
        CreateTechnicianRequest request = new CreateTechnicianRequest();

        // When/Then
        mockMvc.perform(post("/api/v1/technicians")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Validation Failed"))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void createTechnician_WithDuplicateEmployeeId_ReturnsConflict() throws Exception {
        // Given
        CreateTechnicianRequest request = createTestCreateRequest();
        when(technicianService.create(any(CreateTechnicianRequest.class)))
                .thenThrow(new DuplicateResourceException("Technician with employee ID EMP001 already exists"));

        // When/Then
        mockMvc.perform(post("/api/v1/technicians")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.message").value("Duplicate Resource"));
    }

    @Test
    void updateTechnician_WithValidData_ReturnsUpdated() throws Exception {
        // Given
        UpdateTechnicianRequest request = UpdateTechnicianRequest.builder()
                .firstName("Jane")
                .status(TechnicianStatus.ON_LEAVE)
                .build();
        TechnicianDto updated = createTestTechnicianDto(1L, "EMP001");
        updated.setFirstName("Jane");
        when(technicianService.update(eq(1L), any(UpdateTechnicianRequest.class))).thenReturn(updated);

        // When/Then
        mockMvc.perform(put("/api/v1/technicians/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.firstName").value("Jane"));
    }

    @Test
    void updateTechnician_WhenNotExists_ReturnsNotFound() throws Exception {
        // Given
        UpdateTechnicianRequest request = UpdateTechnicianRequest.builder()
                .firstName("Jane")
                .build();
        when(technicianService.update(eq(999L), any(UpdateTechnicianRequest.class)))
                .thenThrow(new ResourceNotFoundException("Technician with ID 999 not found"));

        // When/Then
        mockMvc.perform(put("/api/v1/technicians/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void deleteTechnician_WhenExists_ReturnsNoContent() throws Exception {
        // When/Then
        mockMvc.perform(delete("/api/v1/technicians/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteTechnician_WhenNotExists_ReturnsNotFound() throws Exception {
        // Given
        doThrow(new ResourceNotFoundException("Technician with ID 999 not found"))
                .when(technicianService).delete(999L);

        // When/Then
        mockMvc.perform(delete("/api/v1/technicians/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    private TechnicianDto createTestTechnicianDto(Long id, String employeeId) {
        return TechnicianDto.builder()
                .id(id)
                .employeeId(employeeId)
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .phone("+1234567890")
                .status(TechnicianStatus.ACTIVE)
                .skillLevel(SkillLevel.SENIOR)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private CreateTechnicianRequest createTestCreateRequest() {
        return CreateTechnicianRequest.builder()
                .employeeId("EMP001")
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .phone("+1234567890")
                .status(TechnicianStatus.ACTIVE)
                .skillLevel(SkillLevel.SENIOR)
                .build();
    }
}
