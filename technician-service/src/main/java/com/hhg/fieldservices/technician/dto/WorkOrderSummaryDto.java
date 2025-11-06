package com.hhg.fieldservices.technician.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for work order summary information returned by technician service.
 * Contains essential work order details for integration with work-order-service.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Work order summary data transfer object")
public class WorkOrderSummaryDto {
    
    @Schema(description = "Work order ID", example = "1")
    private Long id;
    
    @Schema(description = "Work order number", example = "WO-20251106123456")
    private String workOrderNumber;
    
    @Schema(description = "Work order title", example = "HVAC Repair")
    private String title;
    
    @Schema(description = "Work order description")
    private String description;
    
    @Schema(description = "Work order status", example = "ASSIGNED")
    private String status;
    
    @Schema(description = "Work order priority", example = "HIGH")
    private String priority;
    
    @Schema(description = "Customer ID", example = "100")
    private Long customerId;
    
    @Schema(description = "Customer name", example = "John Doe")
    private String customerName;
    
    @Schema(description = "Service address", example = "123 Main St")
    private String serviceAddress;
    
    @Schema(description = "City", example = "Springfield")
    private String city;
    
    @Schema(description = "State", example = "IL")
    private String state;
    
    @Schema(description = "ZIP code", example = "62701")
    private String zipCode;
    
    @Schema(description = "Scheduled date and time")
    private LocalDateTime scheduledDate;
    
    @Schema(description = "Actual start time")
    private LocalDateTime startedAt;
    
    @Schema(description = "Completion time")
    private LocalDateTime completedAt;
    
    @Schema(description = "Estimated cost", example = "500.00")
    private BigDecimal estimatedCost;
    
    @Schema(description = "Creation timestamp")
    private LocalDateTime createdAt;
    
    @Schema(description = "Last update timestamp")
    private LocalDateTime updatedAt;
}
