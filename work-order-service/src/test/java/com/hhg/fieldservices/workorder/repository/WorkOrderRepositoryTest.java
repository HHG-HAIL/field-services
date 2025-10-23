package com.hhg.fieldservices.workorder.repository;

import com.hhg.fieldservices.workorder.model.WorkOrder;
import com.hhg.fieldservices.workorder.model.WorkOrderPriority;
import com.hhg.fieldservices.workorder.model.WorkOrderStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

/**
 * Integration tests for WorkOrderRepository.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@DataJpaTest
class WorkOrderRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private WorkOrderRepository workOrderRepository;
    
    private WorkOrder testWorkOrder;
    
    @BeforeEach
    void setUp() {
        LocalDateTime now = LocalDateTime.now();
        testWorkOrder = WorkOrder.builder()
            .workOrderNumber("WO-TEST-001")
            .title("Test Work Order")
            .description("Test Description")
            .status(WorkOrderStatus.PENDING)
            .priority(WorkOrderPriority.NORMAL)
            .customerId(100L)
            .customerName("John Doe")
            .customerPhone("555-1234")
            .customerEmail("john@example.com")
            .serviceAddress("123 Main St")
            .city("Springfield")
            .state("IL")
            .zipCode("62701")
            .scheduledDate(now.plusDays(1))
            .estimatedCost(BigDecimal.valueOf(500.00))
            .createdAt(now)
            .updatedAt(now)
            .build();
    }
    
    @Test
    void givenWorkOrder_whenSave_thenWorkOrderIsPersisted() {
        // When
        WorkOrder saved = workOrderRepository.save(testWorkOrder);
        
        // Then
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getWorkOrderNumber()).isEqualTo("WO-TEST-001");
        assertThat(saved.getCreatedAt()).isNotNull();
        assertThat(saved.getUpdatedAt()).isNotNull();
    }
    
    @Test
    void givenWorkOrderNumber_whenFindByWorkOrderNumber_thenReturnWorkOrder() {
        // Given
        entityManager.persistAndFlush(testWorkOrder);
        
        // When
        Optional<WorkOrder> found = workOrderRepository.findByWorkOrderNumber("WO-TEST-001");
        
        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getTitle()).isEqualTo("Test Work Order");
    }
    
    @Test
    void givenStatus_whenFindByStatus_thenReturnWorkOrders() {
        // Given
        entityManager.persistAndFlush(testWorkOrder);
        
        LocalDateTime now = LocalDateTime.now();
        WorkOrder anotherWorkOrder = WorkOrder.builder()
            .workOrderNumber("WO-TEST-002")
            .title("Another Work Order")
            .status(WorkOrderStatus.ASSIGNED)
            .priority(WorkOrderPriority.HIGH)
            .customerId(101L)
            .createdAt(now)
            .updatedAt(now)
            .build();
        entityManager.persistAndFlush(anotherWorkOrder);
        
        // When
        List<WorkOrder> pendingOrders = workOrderRepository.findByStatus(WorkOrderStatus.PENDING);
        
        // Then
        assertThat(pendingOrders).hasSize(1);
        assertThat(pendingOrders.get(0).getTitle()).isEqualTo("Test Work Order");
    }
    
    @Test
    void givenPriority_whenFindByPriority_thenReturnWorkOrders() {
        // Given
        entityManager.persistAndFlush(testWorkOrder);
        
        // When
        List<WorkOrder> normalPriorityOrders = workOrderRepository.findByPriority(WorkOrderPriority.NORMAL);
        
        // Then
        assertThat(normalPriorityOrders).hasSize(1);
        assertThat(normalPriorityOrders.get(0).getPriority()).isEqualTo(WorkOrderPriority.NORMAL);
    }
    
    @Test
    void givenCustomerId_whenFindByCustomerId_thenReturnCustomerWorkOrders() {
        // Given
        entityManager.persistAndFlush(testWorkOrder);
        
        LocalDateTime now = LocalDateTime.now();
        WorkOrder anotherWorkOrder = WorkOrder.builder()
            .workOrderNumber("WO-TEST-003")
            .title("Customer 100 Order 2")
            .status(WorkOrderStatus.PENDING)
            .priority(WorkOrderPriority.HIGH)
            .customerId(100L)
            .createdAt(now)
            .updatedAt(now)
            .build();
        entityManager.persistAndFlush(anotherWorkOrder);
        
        // When
        List<WorkOrder> customerOrders = workOrderRepository.findByCustomerId(100L);
        
        // Then
        assertThat(customerOrders).hasSize(2);
    }
    
    @Test
    void givenTechnicianId_whenFindByAssignedTechnicianId_thenReturnTechnicianWorkOrders() {
        // Given
        testWorkOrder.setAssignedTechnicianId(200L);
        testWorkOrder.setStatus(WorkOrderStatus.ASSIGNED);
        entityManager.persistAndFlush(testWorkOrder);
        
        // When
        List<WorkOrder> technicianOrders = workOrderRepository.findByAssignedTechnicianId(200L);
        
        // Then
        assertThat(technicianOrders).hasSize(1);
        assertThat(technicianOrders.get(0).getAssignedTechnicianId()).isEqualTo(200L);
    }
    
    @Test
    void givenDateRange_whenFindByScheduledDateBetween_thenReturnWorkOrders() {
        // Given
        LocalDateTime tomorrow = LocalDateTime.now().plusDays(1);
        testWorkOrder.setScheduledDate(tomorrow);
        entityManager.persistAndFlush(testWorkOrder);
        
        // When
        LocalDateTime startDate = LocalDateTime.now();
        LocalDateTime endDate = LocalDateTime.now().plusDays(2);
        List<WorkOrder> orders = workOrderRepository.findByScheduledDateBetween(startDate, endDate);
        
        // Then
        assertThat(orders).hasSize(1);
    }
    
    @Test
    void givenOverdueWorkOrder_whenFindOverdueWorkOrders_thenReturnOverdueOrders() {
        // Given
        testWorkOrder.setScheduledDate(LocalDateTime.now().minusDays(1));
        testWorkOrder.setStatus(WorkOrderStatus.PENDING);
        entityManager.persistAndFlush(testWorkOrder);
        
        // When
        List<WorkOrder> overdueOrders = workOrderRepository.findOverdueWorkOrders(LocalDateTime.now());
        
        // Then
        assertThat(overdueOrders).hasSize(1);
        assertThat(overdueOrders.get(0).getWorkOrderNumber()).isEqualTo("WO-TEST-001");
    }
    
    @Test
    void givenStatus_whenCountByStatus_thenReturnCount() {
        // Given
        entityManager.persistAndFlush(testWorkOrder);
        
        LocalDateTime now = LocalDateTime.now();
        WorkOrder anotherWorkOrder = WorkOrder.builder()
            .workOrderNumber("WO-TEST-004")
            .title("Another Pending Order")
            .status(WorkOrderStatus.PENDING)
            .priority(WorkOrderPriority.HIGH)
            .customerId(101L)
            .createdAt(now)
            .updatedAt(now)
            .build();
        entityManager.persistAndFlush(anotherWorkOrder);
        
        // When
        long count = workOrderRepository.countByStatus(WorkOrderStatus.PENDING);
        
        // Then
        assertThat(count).isEqualTo(2);
    }
}
