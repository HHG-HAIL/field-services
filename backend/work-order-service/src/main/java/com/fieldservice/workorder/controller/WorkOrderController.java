package com.fieldservice.workorder.controller;

import com.fieldservice.workorder.dto.WorkOrderDTO;
import com.fieldservice.workorder.entity.WorkOrder;
import com.fieldservice.workorder.service.WorkOrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/work-orders")
@Tag(name = "Work Orders", description = "Work order management operations")
public class WorkOrderController {
    
    @Autowired
    private WorkOrderService workOrderService;
    
    @GetMapping
    @Operation(summary = "Get all work orders", description = "Retrieve a list of all work orders in the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved work orders",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = WorkOrderDTO.class)))
    })
    public ResponseEntity<List<WorkOrderDTO>> getAllWorkOrders() {
        List<WorkOrderDTO> workOrders = workOrderService.getAllWorkOrders();
        return ResponseEntity.ok(workOrders);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get work order by ID", description = "Retrieve a specific work order by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Work order found",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = WorkOrderDTO.class))),
        @ApiResponse(responseCode = "404", description = "Work order not found")
    })
    public ResponseEntity<WorkOrderDTO> getWorkOrderById(
            @Parameter(description = "ID of the work order to retrieve") @PathVariable Long id) {
        return workOrderService.getWorkOrderById(id)
                .map(workOrder -> ResponseEntity.ok(workOrder))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<WorkOrderDTO>> getWorkOrdersByStatus(@PathVariable WorkOrder.Status status) {
        List<WorkOrderDTO> workOrders = workOrderService.getWorkOrdersByStatus(status);
        return ResponseEntity.ok(workOrders);
    }
    
    @GetMapping("/technician/{technicianId}")
    public ResponseEntity<List<WorkOrderDTO>> getWorkOrdersByTechnician(@PathVariable Long technicianId) {
        List<WorkOrderDTO> workOrders = workOrderService.getWorkOrdersByTechnician(technicianId);
        return ResponseEntity.ok(workOrders);
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<List<WorkOrderDTO>> getWorkOrdersByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<WorkOrderDTO> workOrders = workOrderService.getWorkOrdersByDateRange(start, end);
        return ResponseEntity.ok(workOrders);
    }
    
    @PostMapping
    public ResponseEntity<WorkOrderDTO> createWorkOrder(@Valid @RequestBody WorkOrderDTO workOrderDTO) {
        WorkOrderDTO createdWorkOrder = workOrderService.createWorkOrder(workOrderDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdWorkOrder);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<WorkOrderDTO> updateWorkOrder(@PathVariable Long id, 
                                                       @Valid @RequestBody WorkOrderDTO workOrderDTO) {
        return workOrderService.updateWorkOrder(id, workOrderDTO)
                .map(workOrder -> ResponseEntity.ok(workOrder))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PatchMapping("/{id}/assign")
    @Operation(summary = "Assign technician to work order", description = "Assign a technician to a work order and update statuses")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Technician assigned successfully"),
        @ApiResponse(responseCode = "404", description = "Work order not found")
    })
    public ResponseEntity<WorkOrderDTO> assignTechnician(@PathVariable Long id, 
                                                        @RequestBody Map<String, Long> request) {
        Long technicianId = request.get("technicianId");
        return workOrderService.assignTechnician(id, technicianId)
                .map(workOrder -> ResponseEntity.ok(workOrder))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PatchMapping("/{id}/unassign")
    @Operation(summary = "Unassign technician from work order", description = "Remove technician assignment and reset work order status")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Technician unassigned successfully"),
        @ApiResponse(responseCode = "404", description = "Work order not found")
    })
    public ResponseEntity<WorkOrderDTO> unassignTechnician(@PathVariable Long id) {
        return workOrderService.unassignTechnician(id)
                .map(workOrder -> ResponseEntity.ok(workOrder))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<WorkOrderDTO> updateStatus(@PathVariable Long id, 
                                                     @RequestBody Map<String, String> request) {
        WorkOrder.Status status = WorkOrder.Status.valueOf(request.get("status"));
        return workOrderService.updateStatus(id, status)
                .map(workOrder -> ResponseEntity.ok(workOrder))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkOrder(@PathVariable Long id) {
        if (workOrderService.deleteWorkOrder(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/stats/count-by-status/{status}")
    public ResponseEntity<Long> getWorkOrderCountByStatus(@PathVariable WorkOrder.Status status) {
        long count = workOrderService.getWorkOrderCountByStatus(status);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/stats/count-by-technician/{technicianId}")
    public ResponseEntity<Long> getWorkOrderCountByTechnician(@PathVariable Long technicianId) {
        long count = workOrderService.getWorkOrderCountByTechnician(technicianId);
        return ResponseEntity.ok(count);
    }
}