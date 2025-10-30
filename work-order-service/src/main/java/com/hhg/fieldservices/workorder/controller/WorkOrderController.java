package com.hhg.fieldservices.workorder.controller;

import com.hhg.fieldservices.workorder.dto.*;
import com.hhg.fieldservices.workorder.exception.ErrorResponse;
import com.hhg.fieldservices.workorder.model.WorkOrderPriority;
import com.hhg.fieldservices.workorder.model.WorkOrderStatus;
import com.hhg.fieldservices.workorder.service.WorkOrderService;
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
 * REST controller for work order operations.
 * Provides endpoints for CRUD operations and work order management.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@RestController
@RequestMapping("/api/v1/work-orders")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH, RequestMethod.OPTIONS})
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Work Orders", description = "Work Order Management API")
public class WorkOrderController {
    
    private final WorkOrderService workOrderService;
    
    /**
     * Get all work orders
     */
    @Operation(
        summary = "Get all work orders",
        description = "Retrieves a list of all work orders in the system"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved work orders")
    })
    @GetMapping
    public ResponseEntity<List<WorkOrderDto>> getAllWorkOrders() {
        log.debug("GET /api/v1/work-orders - Fetching all work orders");
        List<WorkOrderDto> workOrders = workOrderService.findAll();
        return ResponseEntity.ok(workOrders);
    }
    
    /**
     * Get work order by ID
     */
    @Operation(
        summary = "Get work order by ID",
        description = "Retrieves a specific work order by its unique identifier"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Work order found",
            content = @Content(schema = @Schema(implementation = WorkOrderDto.class))),
        @ApiResponse(responseCode = "404", description = "Work order not found",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<WorkOrderDto> getWorkOrderById(
            @Parameter(description = "Work order ID", required = true, example = "1")
            @PathVariable Long id) {
        log.debug("GET /api/v1/work-orders/{} - Fetching work order by id", id);
        WorkOrderDto workOrder = workOrderService.findById(id);
        return ResponseEntity.ok(workOrder);
    }
    
    /**
     * Get work order by work order number
     */
    @Operation(
        summary = "Get work order by number",
        description = "Retrieves a work order by its unique work order number"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Work order found"),
        @ApiResponse(responseCode = "404", description = "Work order not found",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/number/{workOrderNumber}")
    public ResponseEntity<WorkOrderDto> getWorkOrderByNumber(
            @Parameter(description = "Work order number", required = true, example = "WO-20251024123456")
            @PathVariable String workOrderNumber) {
        log.debug("GET /api/v1/work-orders/number/{} - Fetching work order by number", workOrderNumber);
        WorkOrderDto workOrder = workOrderService.findByWorkOrderNumber(workOrderNumber);
        return ResponseEntity.ok(workOrder);
    }
    
    /**
     * Get work orders by status
     */
    @Operation(
        summary = "Get work orders by status",
        description = "Retrieves all work orders with the specified status"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved work orders")
    })
    @GetMapping("/status/{status}")
    public ResponseEntity<List<WorkOrderDto>> getWorkOrdersByStatus(
            @Parameter(description = "Work order status", required = true)
            @PathVariable WorkOrderStatus status) {
        log.debug("GET /api/v1/work-orders/status/{} - Fetching work orders by status", status);
        List<WorkOrderDto> workOrders = workOrderService.findByStatus(status);
        return ResponseEntity.ok(workOrders);
    }
    
    /**
     * Get work orders by priority
     */
    @Operation(
        summary = "Get work orders by priority",
        description = "Retrieves all work orders with the specified priority level"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved work orders")
    })
    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<WorkOrderDto>> getWorkOrdersByPriority(
            @Parameter(description = "Work order priority", required = true)
            @PathVariable WorkOrderPriority priority) {
        log.debug("GET /api/v1/work-orders/priority/{} - Fetching work orders by priority", priority);
        List<WorkOrderDto> workOrders = workOrderService.findByPriority(priority);
        return ResponseEntity.ok(workOrders);
    }
    
    /**
     * Get work orders by customer ID
     */
    @Operation(
        summary = "Get work orders by customer",
        description = "Retrieves all work orders for a specific customer"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved work orders")
    })
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<WorkOrderDto>> getWorkOrdersByCustomerId(
            @Parameter(description = "Customer ID", required = true, example = "100")
            @PathVariable Long customerId) {
        log.debug("GET /api/v1/work-orders/customer/{} - Fetching work orders by customer", customerId);
        List<WorkOrderDto> workOrders = workOrderService.findByCustomerId(customerId);
        return ResponseEntity.ok(workOrders);
    }
    
    /**
     * Get work orders by assigned technician ID
     */
    @Operation(
        summary = "Get work orders by technician",
        description = "Retrieves all work orders assigned to a specific technician"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved work orders")
    })
    @GetMapping("/technician/{technicianId}")
    public ResponseEntity<List<WorkOrderDto>> getWorkOrdersByTechnicianId(
            @Parameter(description = "Technician ID", required = true, example = "200")
            @PathVariable Long technicianId) {
        log.debug("GET /api/v1/work-orders/technician/{} - Fetching work orders by technician", technicianId);
        List<WorkOrderDto> workOrders = workOrderService.findByAssignedTechnicianId(technicianId);
        return ResponseEntity.ok(workOrders);
    }
    
    /**
     * Get overdue work orders
     */
    @Operation(
        summary = "Get overdue work orders",
        description = "Retrieves all work orders that are past their scheduled date and not yet completed"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved overdue work orders")
    })
    @GetMapping("/overdue")
    public ResponseEntity<List<WorkOrderDto>> getOverdueWorkOrders() {
        log.debug("GET /api/v1/work-orders/overdue - Fetching overdue work orders");
        List<WorkOrderDto> workOrders = workOrderService.findOverdueWorkOrders();
        return ResponseEntity.ok(workOrders);
    }
    
    /**
     * Create a new work order
     */
    @Operation(
        summary = "Create new work order",
        description = "Creates a new work order with the provided details. A unique work order number will be automatically generated."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Work order created successfully",
            content = @Content(schema = @Schema(implementation = WorkOrderDto.class))),
        @ApiResponse(responseCode = "400", description = "Invalid request data",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping
    public ResponseEntity<WorkOrderDto> createWorkOrder(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Work order creation request",
                required = true
            )
            @Valid @RequestBody CreateWorkOrderRequest request) {
        log.debug("POST /api/v1/work-orders - Creating new work order: {}", request.getTitle());
        WorkOrderDto created = workOrderService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    /**
     * Update an existing work order
     */
    @Operation(
        summary = "Update work order",
        description = "Updates an existing work order with the provided details"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Work order updated successfully",
            content = @Content(schema = @Schema(implementation = WorkOrderDto.class))),
        @ApiResponse(responseCode = "404", description = "Work order not found",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid request data",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<WorkOrderDto> updateWorkOrder(
            @Parameter(description = "Work order ID", required = true, example = "1")
            @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Work order update request",
                required = true
            )
            @Valid @RequestBody UpdateWorkOrderRequest request) {
        log.debug("PUT /api/v1/work-orders/{} - Updating work order", id);
        WorkOrderDto updated = workOrderService.update(id, request);
        return ResponseEntity.ok(updated);
    }
    
    /**
     * Delete a work order
     */
    @Operation(
        summary = "Delete work order",
        description = "Deletes a work order by its ID. This also deletes all associated work order items."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Work order deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Work order not found",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkOrder(
            @Parameter(description = "Work order ID", required = true, example = "1")
            @PathVariable Long id) {
        log.debug("DELETE /api/v1/work-orders/{} - Deleting work order", id);
        workOrderService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Assign work order to a technician
     */
    @Operation(
        summary = "Assign work order to technician",
        description = "Assigns a work order to a technician and updates the status to ASSIGNED"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Work order assigned successfully",
            content = @Content(schema = @Schema(implementation = WorkOrderDto.class))),
        @ApiResponse(responseCode = "404", description = "Work order not found",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "400", description = "Work order cannot be assigned (already completed or cancelled)",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/{id}/assign")
    public ResponseEntity<WorkOrderDto> assignWorkOrder(
            @Parameter(description = "Work order ID", required = true, example = "1")
            @PathVariable Long id,
            @Parameter(description = "Technician ID", required = true, example = "200")
            @RequestParam Long technicianId,
            @Parameter(description = "Technician name", required = true, example = "Jane Tech")
            @RequestParam String technicianName) {
        log.debug("POST /api/v1/work-orders/{}/assign - Assigning to technician {}", id, technicianId);
        WorkOrderDto updated = workOrderService.assignToTechnician(id, technicianId, technicianName);
        return ResponseEntity.ok(updated);
    }
    
    /**
     * Update work order status
     */
    @Operation(
        summary = "Update work order status",
        description = "Updates the status of a work order. Automatically sets timestamps based on status transitions."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Work order status updated successfully",
            content = @Content(schema = @Schema(implementation = WorkOrderDto.class))),
        @ApiResponse(responseCode = "404", description = "Work order not found",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid status transition",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PatchMapping("/{id}/status")
    public ResponseEntity<WorkOrderDto> updateWorkOrderStatus(
            @Parameter(description = "Work order ID", required = true, example = "1")
            @PathVariable Long id,
            @Parameter(description = "New status", required = true)
            @RequestParam WorkOrderStatus status) {
        log.debug("PATCH /api/v1/work-orders/{}/status - Updating status to {}", id, status);
        WorkOrderDto updated = workOrderService.updateStatus(id, status);
        return ResponseEntity.ok(updated);
    }
}
