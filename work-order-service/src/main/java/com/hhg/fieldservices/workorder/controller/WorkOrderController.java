package com.hhg.fieldservices.workorder.controller;

import com.hhg.fieldservices.workorder.dto.*;
import com.hhg.fieldservices.workorder.model.WorkOrderPriority;
import com.hhg.fieldservices.workorder.model.WorkOrderStatus;
import com.hhg.fieldservices.workorder.service.WorkOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for work order operations.
 * Provides endpoints for CRUD operations and work order management.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@RestController
@RequestMapping("/api/v1/work-orders")
@RequiredArgsConstructor
@Slf4j
public class WorkOrderController {
    
    private final WorkOrderService workOrderService;
    
    /**
     * Get all work orders
     */
    @GetMapping
    public ResponseEntity<List<WorkOrderDto>> getAllWorkOrders() {
        log.debug("GET /api/v1/work-orders - Fetching all work orders");
        List<WorkOrderDto> workOrders = workOrderService.findAll();
        return ResponseEntity.ok(workOrders);
    }
    
    /**
     * Get work order by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<WorkOrderDto> getWorkOrderById(@PathVariable Long id) {
        log.debug("GET /api/v1/work-orders/{} - Fetching work order by id", id);
        WorkOrderDto workOrder = workOrderService.findById(id);
        return ResponseEntity.ok(workOrder);
    }
    
    /**
     * Get work order by work order number
     */
    @GetMapping("/number/{workOrderNumber}")
    public ResponseEntity<WorkOrderDto> getWorkOrderByNumber(@PathVariable String workOrderNumber) {
        log.debug("GET /api/v1/work-orders/number/{} - Fetching work order by number", workOrderNumber);
        WorkOrderDto workOrder = workOrderService.findByWorkOrderNumber(workOrderNumber);
        return ResponseEntity.ok(workOrder);
    }
    
    /**
     * Get work orders by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<WorkOrderDto>> getWorkOrdersByStatus(@PathVariable WorkOrderStatus status) {
        log.debug("GET /api/v1/work-orders/status/{} - Fetching work orders by status", status);
        List<WorkOrderDto> workOrders = workOrderService.findByStatus(status);
        return ResponseEntity.ok(workOrders);
    }
    
    /**
     * Get work orders by priority
     */
    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<WorkOrderDto>> getWorkOrdersByPriority(@PathVariable WorkOrderPriority priority) {
        log.debug("GET /api/v1/work-orders/priority/{} - Fetching work orders by priority", priority);
        List<WorkOrderDto> workOrders = workOrderService.findByPriority(priority);
        return ResponseEntity.ok(workOrders);
    }
    
    /**
     * Get work orders by customer ID
     */
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<WorkOrderDto>> getWorkOrdersByCustomerId(@PathVariable Long customerId) {
        log.debug("GET /api/v1/work-orders/customer/{} - Fetching work orders by customer", customerId);
        List<WorkOrderDto> workOrders = workOrderService.findByCustomerId(customerId);
        return ResponseEntity.ok(workOrders);
    }
    
    /**
     * Get work orders by assigned technician ID
     */
    @GetMapping("/technician/{technicianId}")
    public ResponseEntity<List<WorkOrderDto>> getWorkOrdersByTechnicianId(@PathVariable Long technicianId) {
        log.debug("GET /api/v1/work-orders/technician/{} - Fetching work orders by technician", technicianId);
        List<WorkOrderDto> workOrders = workOrderService.findByAssignedTechnicianId(technicianId);
        return ResponseEntity.ok(workOrders);
    }
    
    /**
     * Get overdue work orders
     */
    @GetMapping("/overdue")
    public ResponseEntity<List<WorkOrderDto>> getOverdueWorkOrders() {
        log.debug("GET /api/v1/work-orders/overdue - Fetching overdue work orders");
        List<WorkOrderDto> workOrders = workOrderService.findOverdueWorkOrders();
        return ResponseEntity.ok(workOrders);
    }
    
    /**
     * Create a new work order
     */
    @PostMapping
    public ResponseEntity<WorkOrderDto> createWorkOrder(@Valid @RequestBody CreateWorkOrderRequest request) {
        log.debug("POST /api/v1/work-orders - Creating new work order: {}", request.getTitle());
        WorkOrderDto created = workOrderService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    /**
     * Update an existing work order
     */
    @PutMapping("/{id}")
    public ResponseEntity<WorkOrderDto> updateWorkOrder(
            @PathVariable Long id,
            @Valid @RequestBody UpdateWorkOrderRequest request) {
        log.debug("PUT /api/v1/work-orders/{} - Updating work order", id);
        WorkOrderDto updated = workOrderService.update(id, request);
        return ResponseEntity.ok(updated);
    }
    
    /**
     * Delete a work order
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkOrder(@PathVariable Long id) {
        log.debug("DELETE /api/v1/work-orders/{} - Deleting work order", id);
        workOrderService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Assign work order to a technician
     */
    @PostMapping("/{id}/assign")
    public ResponseEntity<WorkOrderDto> assignWorkOrder(
            @PathVariable Long id,
            @RequestParam Long technicianId,
            @RequestParam String technicianName) {
        log.debug("POST /api/v1/work-orders/{}/assign - Assigning to technician {}", id, technicianId);
        WorkOrderDto updated = workOrderService.assignToTechnician(id, technicianId, technicianName);
        return ResponseEntity.ok(updated);
    }
    
    /**
     * Update work order status
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<WorkOrderDto> updateWorkOrderStatus(
            @PathVariable Long id,
            @RequestParam WorkOrderStatus status) {
        log.debug("PATCH /api/v1/work-orders/{}/status - Updating status to {}", id, status);
        WorkOrderDto updated = workOrderService.updateStatus(id, status);
        return ResponseEntity.ok(updated);
    }
}
