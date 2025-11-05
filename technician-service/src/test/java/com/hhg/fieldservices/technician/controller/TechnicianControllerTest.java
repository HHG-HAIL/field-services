package com.hhg.fieldservices.technician.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hhg.fieldservices.technician.dto.CreateTechnicianRequest;
import com.hhg.fieldservices.technician.dto.UpdateTechnicianRequest;
import com.hhg.fieldservices.technician.model.TechnicianStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for TechnicianController.
 * Tests the REST API endpoints for technician management.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class TechnicianControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    void shouldCreateTechnician() throws Exception {
        CreateTechnicianRequest request = new CreateTechnicianRequest();
        request.setFirstName("John");
        request.setLastName("Smith");
        request.setEmail("john.smith@example.com");
        request.setPhoneNumber("555-1234");
        request.setCity("Springfield");
        request.setState("IL");
        request.setZipCode("62701");
        request.setSkills("HVAC, Electrical");
        request.setStatus(TechnicianStatus.AVAILABLE);
        
        mockMvc.perform(post("/api/v1/technicians")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Smith"))
                .andExpect(jsonPath("$.email").value("john.smith@example.com"))
                .andExpect(jsonPath("$.status").value("AVAILABLE"));
    }
    
    @Test
    void shouldGetAllTechnicians() throws Exception {
        // Create a technician first
        CreateTechnicianRequest request = new CreateTechnicianRequest();
        request.setFirstName("Jane");
        request.setLastName("Doe");
        request.setEmail("jane.doe@example.com");
        request.setPhoneNumber("555-5678");
        
        mockMvc.perform(post("/api/v1/technicians")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
        
        // Get all technicians
        mockMvc.perform(get("/api/v1/technicians"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }
    
    @Test
    void shouldGetTechnicianById() throws Exception {
        // Create a technician
        CreateTechnicianRequest request = new CreateTechnicianRequest();
        request.setFirstName("Bob");
        request.setLastName("Johnson");
        request.setEmail("bob.johnson@example.com");
        request.setPhoneNumber("555-9012");
        
        String createResponse = mockMvc.perform(post("/api/v1/technicians")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        
        Long id = objectMapper.readTree(createResponse).get("id").asLong();
        
        // Get technician by ID
        mockMvc.perform(get("/api/v1/technicians/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.firstName").value("Bob"))
                .andExpect(jsonPath("$.lastName").value("Johnson"));
    }
    
    @Test
    void shouldReturnNotFoundForNonExistentTechnician() throws Exception {
        mockMvc.perform(get("/api/v1/technicians/99999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").exists());
    }
    
    @Test
    void shouldUpdateTechnician() throws Exception {
        // Create a technician
        CreateTechnicianRequest createRequest = new CreateTechnicianRequest();
        createRequest.setFirstName("Alice");
        createRequest.setLastName("Williams");
        createRequest.setEmail("alice.williams@example.com");
        createRequest.setPhoneNumber("555-3456");
        
        String createResponse = mockMvc.perform(post("/api/v1/technicians")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        
        Long id = objectMapper.readTree(createResponse).get("id").asLong();
        
        // Update technician
        UpdateTechnicianRequest updateRequest = new UpdateTechnicianRequest();
        updateRequest.setPhoneNumber("555-7890");
        updateRequest.setSkills("Plumbing, HVAC");
        
        mockMvc.perform(put("/api/v1/technicians/" + id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.phoneNumber").value("555-7890"))
                .andExpect(jsonPath("$.skills").value("Plumbing, HVAC"));
    }
    
    @Test
    void shouldUpdateTechnicianStatus() throws Exception {
        // Create a technician
        CreateTechnicianRequest createRequest = new CreateTechnicianRequest();
        createRequest.setFirstName("Charlie");
        createRequest.setLastName("Brown");
        createRequest.setEmail("charlie.brown@example.com");
        createRequest.setPhoneNumber("555-2468");
        
        String createResponse = mockMvc.perform(post("/api/v1/technicians")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        
        Long id = objectMapper.readTree(createResponse).get("id").asLong();
        
        // Update status
        mockMvc.perform(patch("/api/v1/technicians/" + id + "/status")
                .param("status", "ON_JOB"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.status").value("ON_JOB"));
    }
    
    @Test
    void shouldDeleteTechnician() throws Exception {
        // Create a technician
        CreateTechnicianRequest createRequest = new CreateTechnicianRequest();
        createRequest.setFirstName("David");
        createRequest.setLastName("Miller");
        createRequest.setEmail("david.miller@example.com");
        createRequest.setPhoneNumber("555-1357");
        
        String createResponse = mockMvc.perform(post("/api/v1/technicians")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        
        Long id = objectMapper.readTree(createResponse).get("id").asLong();
        
        // Delete technician
        mockMvc.perform(delete("/api/v1/technicians/" + id))
                .andExpect(status().isNoContent());
        
        // Verify deletion
        mockMvc.perform(get("/api/v1/technicians/" + id))
                .andExpect(status().isNotFound());
    }
    
    @Test
    void shouldGetAvailableTechnicians() throws Exception {
        // Create available technician
        CreateTechnicianRequest request1 = new CreateTechnicianRequest();
        request1.setFirstName("Emma");
        request1.setLastName("Davis");
        request1.setEmail("emma.davis@example.com");
        request1.setPhoneNumber("555-2580");
        request1.setStatus(TechnicianStatus.AVAILABLE);
        
        mockMvc.perform(post("/api/v1/technicians")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request1)))
                .andExpect(status().isCreated());
        
        // Create unavailable technician
        CreateTechnicianRequest request2 = new CreateTechnicianRequest();
        request2.setFirstName("Frank");
        request2.setLastName("Wilson");
        request2.setEmail("frank.wilson@example.com");
        request2.setPhoneNumber("555-3691");
        request2.setStatus(TechnicianStatus.ON_JOB);
        
        mockMvc.perform(post("/api/v1/technicians")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request2)))
                .andExpect(status().isCreated());
        
        // Get available technicians
        mockMvc.perform(get("/api/v1/technicians/available"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }
    
    @Test
    void shouldGetTechniciansByStatus() throws Exception {
        // Create technician with specific status
        CreateTechnicianRequest request = new CreateTechnicianRequest();
        request.setFirstName("Grace");
        request.setLastName("Taylor");
        request.setEmail("grace.taylor@example.com");
        request.setPhoneNumber("555-4802");
        request.setStatus(TechnicianStatus.ON_BREAK);
        
        mockMvc.perform(post("/api/v1/technicians")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
        
        // Get technicians by status
        mockMvc.perform(get("/api/v1/technicians/status/ON_BREAK"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }
    
    @Test
    void shouldGetTechniciansBySkill() throws Exception {
        // Create technician with specific skill
        CreateTechnicianRequest request = new CreateTechnicianRequest();
        request.setFirstName("Henry");
        request.setLastName("Anderson");
        request.setEmail("henry.anderson@example.com");
        request.setPhoneNumber("555-5913");
        request.setSkills("HVAC, Electrical, Plumbing");
        
        mockMvc.perform(post("/api/v1/technicians")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
        
        // Get technicians by skill
        mockMvc.perform(get("/api/v1/technicians/skill/HVAC"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }
    
    @Test
    void shouldRejectInvalidEmail() throws Exception {
        CreateTechnicianRequest request = new CreateTechnicianRequest();
        request.setFirstName("Invalid");
        request.setLastName("Email");
        request.setEmail("not-an-email");
        request.setPhoneNumber("555-0000");
        
        mockMvc.perform(post("/api/v1/technicians")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.email").exists());
    }
    
    @Test
    void shouldRejectDuplicateEmail() throws Exception {
        CreateTechnicianRequest request1 = new CreateTechnicianRequest();
        request1.setFirstName("First");
        request1.setLastName("User");
        request1.setEmail("duplicate@example.com");
        request1.setPhoneNumber("555-1111");
        
        // Create first technician
        mockMvc.perform(post("/api/v1/technicians")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request1)))
                .andExpect(status().isCreated());
        
        // Try to create second technician with same email
        CreateTechnicianRequest request2 = new CreateTechnicianRequest();
        request2.setFirstName("Second");
        request2.setLastName("User");
        request2.setEmail("duplicate@example.com");
        request2.setPhoneNumber("555-2222");
        
        mockMvc.perform(post("/api/v1/technicians")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request2)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409));
    }
}
