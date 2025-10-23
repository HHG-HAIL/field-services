package com.hhg.fieldservices.workorder.service;

import com.hhg.fieldservices.workorder.dto.*;
import com.hhg.fieldservices.workorder.exception.WorkOrderNotFoundException;
import com.hhg.fieldservices.workorder.exception.WorkOrderValidationException;
import com.hhg.fieldservices.workorder.mapper.WorkOrderMapper;
import com.hhg.fieldservices.workorder.model.WorkOrder;
import com.hhg.fieldservices.workorder.model.WorkOrderItem;
import com.hhg.fieldservices.workorder.model.WorkOrderPriority;
import com.hhg.fieldservices.workorder.model.WorkOrderStatus;
import com.hhg.fieldservices.workorder.repository.WorkOrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing work orders.
 * Implements business logic for work order operations.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class WorkOrderService {
    
    private final WorkOrderRepository workOrderRepository;
    private final WorkOrderMapper workOrderMapper;
    
    /**
     * Find all work orders
     */
    @Transactional(readOnly = true)
    public List<WorkOrderDto> findAll() {
        log.debug("Fetching all work orders");
        List<WorkOrder> workOrders = workOrderRepository.findAll();
        return workOrderMapper.toDtoList(workOrders);
    }
    
    /**
     * Find work order by ID
     */
    @Transactional(readOnly = true)
    public WorkOrderDto findById(Long id) {
        log.debug("Fetching work order with id: {}", id);
        WorkOrder workOrder = workOrderRepository.findById(id)
            .orElseThrow(() -> new WorkOrderNotFoundException(id));
        return workOrderMapper.toDto(workOrder);
    }
    
    /**
     * Find work order by work order number
     */
    @Transactional(readOnly = true)
    public WorkOrderDto findByWorkOrderNumber(String workOrderNumber) {
        log.debug("Fetching work order with number: {}", workOrderNumber);
        WorkOrder workOrder = workOrderRepository.findByWorkOrderNumber(workOrderNumber)
            .orElseThrow(() -> new WorkOrderNotFoundException(workOrderNumber));
        return workOrderMapper.toDto(workOrder);
    }
    
    /**
     * Find work orders by status
     */
    @Transactional(readOnly = true)
    public List<WorkOrderDto> findByStatus(WorkOrderStatus status) {
        log.debug("Fetching work orders with status: {}", status);
        List<WorkOrder> workOrders = workOrderRepository.findByStatus(status);
        return workOrderMapper.toDtoList(workOrders);
    }
    
    /**
     * Find work orders by priority
     */
    @Transactional(readOnly = true)
    public List<WorkOrderDto> findByPriority(WorkOrderPriority priority) {
        log.debug("Fetching work orders with priority: {}", priority);
        List<WorkOrder> workOrders = workOrderRepository.findByPriority(priority);
        return workOrderMapper.toDtoList(workOrders);
    }
    
    /**
     * Find work orders by customer ID
     */
    @Transactional(readOnly = true)
    public List<WorkOrderDto> findByCustomerId(Long customerId) {
        log.debug("Fetching work orders for customer: {}", customerId);
        List<WorkOrder> workOrders = workOrderRepository.findByCustomerId(customerId);
        return workOrderMapper.toDtoList(workOrders);
    }
    
    /**
     * Find work orders assigned to a technician
     */
    @Transactional(readOnly = true)
    public List<WorkOrderDto> findByAssignedTechnicianId(Long technicianId) {
        log.debug("Fetching work orders for technician: {}", technicianId);
        List<WorkOrder> workOrders = workOrderRepository.findByAssignedTechnicianId(technicianId);
        return workOrderMapper.toDtoList(workOrders);
    }
    
    /**
     * Find overdue work orders
     */
    @Transactional(readOnly = true)
    public List<WorkOrderDto> findOverdueWorkOrders() {
        log.debug("Fetching overdue work orders");
        List<WorkOrder> workOrders = workOrderRepository.findOverdueWorkOrders(LocalDateTime.now());
        return workOrderMapper.toDtoList(workOrders);
    }
    
    /**
     * Create a new work order
     */
    public WorkOrderDto create(CreateWorkOrderRequest request) {
        log.debug("Creating new work order: {}", request.getTitle());
        
        WorkOrder workOrder = workOrderMapper.toEntity(request);
        workOrder.setWorkOrderNumber(generateWorkOrderNumber());
        
        // Add items if present
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            List<WorkOrderItem> items = request.getItems().stream()
                .map(workOrderMapper::toItemEntity)
                .collect(Collectors.toList());
            items.forEach(workOrder::addItem);
        }
        
        workOrder = workOrderRepository.save(workOrder);
        log.info("Created work order with id: {} and number: {}", workOrder.getId(), workOrder.getWorkOrderNumber());
        
        return workOrderMapper.toDto(workOrder);
    }
    
    /**
     * Update an existing work order
     */
    public WorkOrderDto update(Long id, UpdateWorkOrderRequest request) {
        log.debug("Updating work order with id: {}", id);
        
        WorkOrder workOrder = workOrderRepository.findById(id)
            .orElseThrow(() -> new WorkOrderNotFoundException(id));
        
        workOrderMapper.updateEntityFromDto(request, workOrder);
        
        // Handle status transitions
        if (request.getStatus() != null) {
            handleStatusTransition(workOrder, request.getStatus());
        }
        
        workOrder = workOrderRepository.save(workOrder);
        log.info("Updated work order with id: {}", id);
        
        return workOrderMapper.toDto(workOrder);
    }
    
    /**
     * Delete a work order
     */
    public void delete(Long id) {
        log.debug("Deleting work order with id: {}", id);
        
        if (!workOrderRepository.existsById(id)) {
            throw new WorkOrderNotFoundException(id);
        }
        
        workOrderRepository.deleteById(id);
        log.info("Deleted work order with id: {}", id);
    }
    
    /**
     * Assign work order to a technician
     */
    public WorkOrderDto assignToTechnician(Long id, Long technicianId, String technicianName) {
        log.debug("Assigning work order {} to technician {}", id, technicianId);
        
        WorkOrder workOrder = workOrderRepository.findById(id)
            .orElseThrow(() -> new WorkOrderNotFoundException(id));
        
        if (workOrder.getStatus() == WorkOrderStatus.COMPLETED || 
            workOrder.getStatus() == WorkOrderStatus.CANCELLED) {
            throw new WorkOrderValidationException(
                "Cannot assign work order with status: " + workOrder.getStatus());
        }
        
        workOrder.setAssignedTechnicianId(technicianId);
        workOrder.setAssignedTechnicianName(technicianName);
        workOrder.setStatus(WorkOrderStatus.ASSIGNED);
        
        workOrder = workOrderRepository.save(workOrder);
        log.info("Assigned work order {} to technician {}", id, technicianId);
        
        return workOrderMapper.toDto(workOrder);
    }
    
    /**
     * Update work order status
     */
    public WorkOrderDto updateStatus(Long id, WorkOrderStatus newStatus) {
        log.debug("Updating status of work order {} to {}", id, newStatus);
        
        WorkOrder workOrder = workOrderRepository.findById(id)
            .orElseThrow(() -> new WorkOrderNotFoundException(id));
        
        handleStatusTransition(workOrder, newStatus);
        
        workOrder = workOrderRepository.save(workOrder);
        log.info("Updated status of work order {} to {}", id, newStatus);
        
        return workOrderMapper.toDto(workOrder);
    }
    
    /**
     * Handle status transitions and set timestamps accordingly
     */
    private void handleStatusTransition(WorkOrder workOrder, WorkOrderStatus newStatus) {
        WorkOrderStatus currentStatus = workOrder.getStatus();
        
        // Prevent invalid transitions
        if (currentStatus == WorkOrderStatus.COMPLETED || currentStatus == WorkOrderStatus.CANCELLED) {
            if (newStatus != currentStatus) {
                throw new WorkOrderValidationException(
                    "Cannot change status from " + currentStatus + " to " + newStatus);
            }
        }
        
        workOrder.setStatus(newStatus);
        
        // Set timestamps based on status
        switch (newStatus) {
            case IN_PROGRESS:
                if (workOrder.getStartedAt() == null) {
                    workOrder.setStartedAt(LocalDateTime.now());
                }
                break;
            case COMPLETED:
                if (workOrder.getCompletedAt() == null) {
                    workOrder.setCompletedAt(LocalDateTime.now());
                }
                break;
        }
    }
    
    /**
     * Generate a unique work order number
     */
    private String generateWorkOrderNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "WO-" + timestamp;
    }
}
