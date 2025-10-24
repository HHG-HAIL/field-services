package com.hhg.fieldservices.workorder.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hhg.fieldservices.workorder.dto.CreateWorkOrderRequest;
import com.hhg.fieldservices.workorder.dto.UpdateWorkOrderRequest;
import com.hhg.fieldservices.workorder.dto.WorkOrderDto;
import com.hhg.fieldservices.workorder.exception.WorkOrderNotFoundException;
import com.hhg.fieldservices.workorder.model.WorkOrderPriority;
import com.hhg.fieldservices.workorder.model.WorkOrderStatus;
import com.hhg.fieldservices.workorder.service.WorkOrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for WorkOrderController.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@WebMvcTest(WorkOrderController.class)
class WorkOrderControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @MockBean
    private WorkOrderService workOrderService;
    
    private WorkOrderDto testWorkOrderDto;
    private CreateWorkOrderRequest createRequest;
    
    @BeforeEach
    void setUp() {
        testWorkOrderDto = WorkOrderDto.builder()
            .id(1L)
            .workOrderNumber("WO-20250101120000")
            .title("Test Work Order")
            .description("Test Description")
            .status(WorkOrderStatus.PENDING)
            .priority(WorkOrderPriority.NORMAL)
            .customerId(100L)
            .customerName("John Doe")
            .estimatedCost(BigDecimal.valueOf(500.00))
            .build();
        
        createRequest = CreateWorkOrderRequest.builder()
            .title("New Work Order")
            .description("New Description")
            .priority(WorkOrderPriority.HIGH)
            .customerId(100L)
            .customerName("Jane Doe")
            .estimatedCost(BigDecimal.valueOf(750.00))
            .build();
    }
    
    @Test
    void whenGetAllWorkOrders_thenReturnWorkOrdersList() throws Exception {
        // Given
        when(workOrderService.findAll()).thenReturn(List.of(testWorkOrderDto));
        
        // When & Then
        mockMvc.perform(get("/api/v1/work-orders"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].title").value("Test Work Order"));
        
        verify(workOrderService).findAll();
    }
    
    @Test
    void givenValidId_whenGetWorkOrderById_thenReturnWorkOrder() throws Exception {
        // Given
        when(workOrderService.findById(1L)).thenReturn(testWorkOrderDto);
        
        // When & Then
        mockMvc.perform(get("/api/v1/work-orders/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.title").value("Test Work Order"))
            .andExpect(jsonPath("$.status").value("PENDING"));
        
        verify(workOrderService).findById(1L);
    }
    
    @Test
    void givenInvalidId_whenGetWorkOrderById_thenReturnNotFound() throws Exception {
        // Given
        when(workOrderService.findById(999L)).thenThrow(new WorkOrderNotFoundException(999L));
        
        // When & Then
        mockMvc.perform(get("/api/v1/work-orders/999"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.status").value(404))
            .andExpect(jsonPath("$.message").value(containsString("999")));
        
        verify(workOrderService).findById(999L);
    }
    
    @Test
    void givenValidRequest_whenCreateWorkOrder_thenReturnCreated() throws Exception {
        // Given
        when(workOrderService.create(any(CreateWorkOrderRequest.class))).thenReturn(testWorkOrderDto);
        
        // When & Then
        mockMvc.perform(post("/api/v1/work-orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.title").value("Test Work Order"));
        
        verify(workOrderService).create(any(CreateWorkOrderRequest.class));
    }
    
    @Test
    void givenInvalidRequest_whenCreateWorkOrder_thenReturnBadRequest() throws Exception {
        // Given - Create request with missing required fields
        CreateWorkOrderRequest invalidRequest = CreateWorkOrderRequest.builder()
            .description("Description only")
            .build();
        
        // When & Then
        mockMvc.perform(post("/api/v1/work-orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.status").value(400))
            .andExpect(jsonPath("$.message").value("Validation failed"));
    }
    
    @Test
    void givenValidIdAndRequest_whenUpdateWorkOrder_thenReturnUpdated() throws Exception {
        // Given
        UpdateWorkOrderRequest updateRequest = UpdateWorkOrderRequest.builder()
            .title("Updated Title")
            .priority(WorkOrderPriority.HIGH)
            .build();
        
        WorkOrderDto updatedDto = WorkOrderDto.builder()
            .id(1L)
            .workOrderNumber("WO-20250101120000")
            .title("Updated Title")
            .priority(WorkOrderPriority.HIGH)
            .build();
        
        when(workOrderService.update(eq(1L), any(UpdateWorkOrderRequest.class))).thenReturn(updatedDto);
        
        // When & Then
        mockMvc.perform(put("/api/v1/work-orders/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.title").value("Updated Title"));
        
        verify(workOrderService).update(eq(1L), any(UpdateWorkOrderRequest.class));
    }
    
    @Test
    void givenValidId_whenDeleteWorkOrder_thenReturnNoContent() throws Exception {
        // Given
        doNothing().when(workOrderService).delete(1L);
        
        // When & Then
        mockMvc.perform(delete("/api/v1/work-orders/1"))
            .andExpect(status().isNoContent());
        
        verify(workOrderService).delete(1L);
    }
    
    @Test
    void givenStatus_whenGetWorkOrdersByStatus_thenReturnFilteredList() throws Exception {
        // Given
        when(workOrderService.findByStatus(WorkOrderStatus.PENDING)).thenReturn(List.of(testWorkOrderDto));
        
        // When & Then
        mockMvc.perform(get("/api/v1/work-orders/status/PENDING"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].status").value("PENDING"));
        
        verify(workOrderService).findByStatus(WorkOrderStatus.PENDING);
    }
    
    @Test
    void givenCustomerId_whenGetWorkOrdersByCustomerId_thenReturnCustomerOrders() throws Exception {
        // Given
        when(workOrderService.findByCustomerId(100L)).thenReturn(List.of(testWorkOrderDto));
        
        // When & Then
        mockMvc.perform(get("/api/v1/work-orders/customer/100"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].customerId").value(100));
        
        verify(workOrderService).findByCustomerId(100L);
    }
    
    @Test
    void whenGetOverdueWorkOrders_thenReturnOverdueList() throws Exception {
        // Given
        when(workOrderService.findOverdueWorkOrders()).thenReturn(List.of(testWorkOrderDto));
        
        // When & Then
        mockMvc.perform(get("/api/v1/work-orders/overdue"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)));
        
        verify(workOrderService).findOverdueWorkOrders();
    }
    
    @Test
    void givenValidParams_whenAssignWorkOrder_thenReturnAssignedWorkOrder() throws Exception {
        // Given
        WorkOrderDto assignedDto = WorkOrderDto.builder()
            .id(1L)
            .workOrderNumber("WO-20250101120000")
            .status(WorkOrderStatus.ASSIGNED)
            .assignedTechnicianId(200L)
            .assignedTechnicianName("Tech Name")
            .build();
        
        when(workOrderService.assignToTechnician(1L, 200L, "Tech Name")).thenReturn(assignedDto);
        
        // When & Then
        mockMvc.perform(post("/api/v1/work-orders/1/assign")
                .param("technicianId", "200")
                .param("technicianName", "Tech Name"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("ASSIGNED"))
            .andExpect(jsonPath("$.assignedTechnicianId").value(200));
        
        verify(workOrderService).assignToTechnician(1L, 200L, "Tech Name");
    }
    
    @Test
    void givenValidStatus_whenUpdateStatus_thenReturnUpdatedWorkOrder() throws Exception {
        // Given
        WorkOrderDto updatedDto = WorkOrderDto.builder()
            .id(1L)
            .workOrderNumber("WO-20250101120000")
            .status(WorkOrderStatus.IN_PROGRESS)
            .build();
        
        when(workOrderService.updateStatus(1L, WorkOrderStatus.IN_PROGRESS)).thenReturn(updatedDto);
        
        // When & Then
        mockMvc.perform(patch("/api/v1/work-orders/1/status")
                .param("status", "IN_PROGRESS"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("IN_PROGRESS"));
        
        verify(workOrderService).updateStatus(1L, WorkOrderStatus.IN_PROGRESS);
    }
}
