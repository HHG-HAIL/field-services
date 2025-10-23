package com.hhg.fieldservices.workorder.dto;

import com.hhg.fieldservices.workorder.model.WorkOrderStatus;
import com.hhg.fieldservices.workorder.model.WorkOrderPriority;
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
public class WorkOrderDto {
    private Long id;
    private String workOrderNumber;
    private String title;
    private String description;
    private WorkOrderStatus status;
    private WorkOrderPriority priority;
    private Long customerId;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String serviceAddress;
    private String city;
    private String state;
    private String zipCode;
    private Long assignedTechnicianId;
    private String assignedTechnicianName;
    private LocalDateTime scheduledDate;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private BigDecimal estimatedCost;
    private BigDecimal actualCost;
    private String notes;
    private List<WorkOrderItemDto> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long version;
}
