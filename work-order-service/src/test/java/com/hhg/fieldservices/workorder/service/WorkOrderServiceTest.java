package com.hhg.fieldservices.workorder.service;

import com.hhg.fieldservices.workorder.dto.CreateWorkOrderRequest;
import com.hhg.fieldservices.workorder.dto.UpdateWorkOrderRequest;
import com.hhg.fieldservices.workorder.dto.WorkOrderDto;
import com.hhg.fieldservices.workorder.exception.WorkOrderNotFoundException;
import com.hhg.fieldservices.workorder.exception.WorkOrderValidationException;
import com.hhg.fieldservices.workorder.mapper.WorkOrderMapper;
import com.hhg.fieldservices.workorder.model.WorkOrder;
import com.hhg.fieldservices.workorder.model.WorkOrderPriority;
import com.hhg.fieldservices.workorder.model.WorkOrderStatus;
import com.hhg.fieldservices.workorder.repository.WorkOrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for WorkOrderService.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@ExtendWith(MockitoExtension.class)
class WorkOrderServiceTest {
    
    @Mock
    private WorkOrderRepository workOrderRepository;
    
    @Mock
    private WorkOrderMapper workOrderMapper;
    
    @InjectMocks
    private WorkOrderService workOrderService;
    
    private WorkOrder testWorkOrder;
    private WorkOrderDto testWorkOrderDto;
    private CreateWorkOrderRequest createRequest;
    
    @BeforeEach
    void setUp() {
        // Setup test data
        testWorkOrder = WorkOrder.builder()
            .id(1L)
            .workOrderNumber("WO-20250101120000")
            .title("Test Work Order")
            .description("Test Description")
            .status(WorkOrderStatus.PENDING)
            .priority(WorkOrderPriority.NORMAL)
            .customerId(100L)
            .customerName("John Doe")
            .estimatedCost(BigDecimal.valueOf(500.00))
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .version(0L)
            .build();
        
        testWorkOrderDto = WorkOrderDto.builder()
            .id(1L)
            .workOrderNumber("WO-20250101120000")
            .title("Test Work Order")
            .status(WorkOrderStatus.PENDING)
            .priority(WorkOrderPriority.NORMAL)
            .customerId(100L)
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
    void givenWorkOrdersExist_whenFindAll_thenReturnAllWorkOrders() {
        // Given
        List<WorkOrder> workOrders = List.of(testWorkOrder);
        List<WorkOrderDto> workOrderDtos = List.of(testWorkOrderDto);
        when(workOrderRepository.findAll()).thenReturn(workOrders);
        when(workOrderMapper.toDtoList(workOrders)).thenReturn(workOrderDtos);
        
        // When
        List<WorkOrderDto> result = workOrderService.findAll();
        
        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Test Work Order");
        verify(workOrderRepository).findAll();
    }
    
    @Test
    void givenValidId_whenFindById_thenReturnWorkOrder() {
        // Given
        when(workOrderRepository.findById(1L)).thenReturn(Optional.of(testWorkOrder));
        when(workOrderMapper.toDto(testWorkOrder)).thenReturn(testWorkOrderDto);
        
        // When
        WorkOrderDto result = workOrderService.findById(1L);
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getTitle()).isEqualTo("Test Work Order");
        verify(workOrderRepository).findById(1L);
    }
    
    @Test
    void givenInvalidId_whenFindById_thenThrowNotFoundException() {
        // Given
        when(workOrderRepository.findById(999L)).thenReturn(Optional.empty());
        
        // When & Then
        assertThatThrownBy(() -> workOrderService.findById(999L))
            .isInstanceOf(WorkOrderNotFoundException.class)
            .hasMessageContaining("999");
    }
    
    @Test
    void givenValidRequest_whenCreate_thenReturnCreatedWorkOrder() {
        // Given
        when(workOrderMapper.toEntity(createRequest)).thenReturn(testWorkOrder);
        when(workOrderRepository.save(any(WorkOrder.class))).thenReturn(testWorkOrder);
        when(workOrderMapper.toDto(testWorkOrder)).thenReturn(testWorkOrderDto);
        
        // When
        WorkOrderDto result = workOrderService.create(createRequest);
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        verify(workOrderRepository).save(any(WorkOrder.class));
    }
    
    @Test
    void givenValidIdAndRequest_whenUpdate_thenReturnUpdatedWorkOrder() {
        // Given
        UpdateWorkOrderRequest updateRequest = UpdateWorkOrderRequest.builder()
            .title("Updated Title")
            .priority(WorkOrderPriority.HIGH)
            .build();
        
        when(workOrderRepository.findById(1L)).thenReturn(Optional.of(testWorkOrder));
        when(workOrderRepository.save(testWorkOrder)).thenReturn(testWorkOrder);
        when(workOrderMapper.toDto(testWorkOrder)).thenReturn(testWorkOrderDto);
        doNothing().when(workOrderMapper).updateEntityFromDto(updateRequest, testWorkOrder);
        
        // When
        WorkOrderDto result = workOrderService.update(1L, updateRequest);
        
        // Then
        assertThat(result).isNotNull();
        verify(workOrderRepository).save(testWorkOrder);
    }
    
    @Test
    void givenValidId_whenDelete_thenWorkOrderIsDeleted() {
        // Given
        when(workOrderRepository.existsById(1L)).thenReturn(true);
        doNothing().when(workOrderRepository).deleteById(1L);
        
        // When
        workOrderService.delete(1L);
        
        // Then
        verify(workOrderRepository).deleteById(1L);
    }
    
    @Test
    void givenInvalidId_whenDelete_thenThrowNotFoundException() {
        // Given
        when(workOrderRepository.existsById(999L)).thenReturn(false);
        
        // When & Then
        assertThatThrownBy(() -> workOrderService.delete(999L))
            .isInstanceOf(WorkOrderNotFoundException.class);
    }
    
    @Test
    void givenValidWorkOrder_whenAssignToTechnician_thenWorkOrderIsAssigned() {
        // Given
        when(workOrderRepository.findById(1L)).thenReturn(Optional.of(testWorkOrder));
        when(workOrderRepository.save(testWorkOrder)).thenReturn(testWorkOrder);
        when(workOrderMapper.toDto(testWorkOrder)).thenReturn(testWorkOrderDto);
        
        // When
        WorkOrderDto result = workOrderService.assignToTechnician(1L, 200L, "Tech Name");
        
        // Then
        assertThat(result).isNotNull();
        assertThat(testWorkOrder.getAssignedTechnicianId()).isEqualTo(200L);
        assertThat(testWorkOrder.getStatus()).isEqualTo(WorkOrderStatus.ASSIGNED);
        verify(workOrderRepository).save(testWorkOrder);
    }
    
    @Test
    void givenCompletedWorkOrder_whenAssignToTechnician_thenThrowValidationException() {
        // Given
        testWorkOrder.setStatus(WorkOrderStatus.COMPLETED);
        when(workOrderRepository.findById(1L)).thenReturn(Optional.of(testWorkOrder));
        
        // When & Then
        assertThatThrownBy(() -> workOrderService.assignToTechnician(1L, 200L, "Tech Name"))
            .isInstanceOf(WorkOrderValidationException.class)
            .hasMessageContaining("Cannot assign");
    }
    
    @Test
    void givenValidStatus_whenUpdateStatus_thenStatusIsUpdated() {
        // Given
        when(workOrderRepository.findById(1L)).thenReturn(Optional.of(testWorkOrder));
        when(workOrderRepository.save(testWorkOrder)).thenReturn(testWorkOrder);
        when(workOrderMapper.toDto(testWorkOrder)).thenReturn(testWorkOrderDto);
        
        // When
        WorkOrderDto result = workOrderService.updateStatus(1L, WorkOrderStatus.IN_PROGRESS);
        
        // Then
        assertThat(result).isNotNull();
        assertThat(testWorkOrder.getStatus()).isEqualTo(WorkOrderStatus.IN_PROGRESS);
        assertThat(testWorkOrder.getStartedAt()).isNotNull();
        verify(workOrderRepository).save(testWorkOrder);
    }
    
    @Test
    void givenStatus_whenFindByStatus_thenReturnWorkOrdersWithStatus() {
        // Given
        List<WorkOrder> workOrders = List.of(testWorkOrder);
        List<WorkOrderDto> workOrderDtos = List.of(testWorkOrderDto);
        when(workOrderRepository.findByStatus(WorkOrderStatus.PENDING)).thenReturn(workOrders);
        when(workOrderMapper.toDtoList(workOrders)).thenReturn(workOrderDtos);
        
        // When
        List<WorkOrderDto> result = workOrderService.findByStatus(WorkOrderStatus.PENDING);
        
        // Then
        assertThat(result).hasSize(1);
        verify(workOrderRepository).findByStatus(WorkOrderStatus.PENDING);
    }
    
    @Test
    void givenCustomerId_whenFindByCustomerId_thenReturnCustomerWorkOrders() {
        // Given
        List<WorkOrder> workOrders = List.of(testWorkOrder);
        List<WorkOrderDto> workOrderDtos = List.of(testWorkOrderDto);
        when(workOrderRepository.findByCustomerId(100L)).thenReturn(workOrders);
        when(workOrderMapper.toDtoList(workOrders)).thenReturn(workOrderDtos);
        
        // When
        List<WorkOrderDto> result = workOrderService.findByCustomerId(100L);
        
        // Then
        assertThat(result).hasSize(1);
        verify(workOrderRepository).findByCustomerId(100L);
    }
}
