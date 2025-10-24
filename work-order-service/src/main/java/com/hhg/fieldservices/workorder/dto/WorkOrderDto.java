package com.hhg.fieldservices.workorder.dto;

import com.hhg.fieldservices.workorder.model.WorkOrderStatus;
import com.hhg.fieldservices.workorder.model.WorkOrderPriority;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Data Transfer Object for WorkOrder entity.
 * Used for API responses.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Work order data transfer object")
public class WorkOrderDto {
    @Schema(description = "Unique identifier", example = "1")
    private Long id;
    
    @Schema(description = "Auto-generated work order number", example = "WO-20251024123456")
    private String workOrderNumber;
    
    @Schema(description = "Work order title", example = "HVAC Repair")
    private String title;
    
    @Schema(description = "Detailed description", example = "Air conditioning unit not cooling")
    private String description;
    
    @Schema(description = "Current status", example = "PENDING")
    private WorkOrderStatus status;
    
    @Schema(description = "Priority level", example = "HIGH")
    private WorkOrderPriority priority;
    
    @Schema(description = "Customer ID", example = "100")
    private Long customerId;
    
    @Schema(description = "Customer name", example = "John Doe")
    private String customerName;
    
    @Schema(description = "Customer phone number", example = "555-1234")
    private String customerPhone;
    
    @Schema(description = "Customer email", example = "john@example.com")
    private String customerEmail;
    
    @Schema(description = "Service address", example = "123 Main St")
    private String serviceAddress;
    
    @Schema(description = "City", example = "Springfield")
    private String city;
    
    @Schema(description = "State", example = "IL")
    private String state;
    
    @Schema(description = "ZIP code", example = "62701")
    private String zipCode;
    
    @Schema(description = "Assigned technician ID", example = "200")
    private Long assignedTechnicianId;
    
    @Schema(description = "Assigned technician name", example = "Jane Tech")
    private String assignedTechnicianName;
    
    @Schema(description = "Scheduled date and time", example = "2025-10-25T10:00:00")
    private LocalDateTime scheduledDate;
    
    @Schema(description = "Actual start time", example = "2025-10-25T10:15:00")
    private LocalDateTime startedAt;
    
    @Schema(description = "Actual completion time", example = "2025-10-25T12:30:00")
    private LocalDateTime completedAt;
    
    @Schema(description = "Estimated cost", example = "500.00")
    private BigDecimal estimatedCost;
    
    @Schema(description = "Actual cost", example = "550.00")
    private BigDecimal actualCost;
    
    @Schema(description = "Additional notes")
    private String notes;
    
    @Schema(description = "Work order line items")
    private List<WorkOrderItemDto> items;
    
    @Schema(description = "Creation timestamp", example = "2025-10-24T09:00:00")
    private LocalDateTime createdAt;
    
    @Schema(description = "Last update timestamp", example = "2025-10-24T14:00:00")
    private LocalDateTime updatedAt;
    
    @Schema(description = "Version for optimistic locking", example = "0")
    private Long version;
}
