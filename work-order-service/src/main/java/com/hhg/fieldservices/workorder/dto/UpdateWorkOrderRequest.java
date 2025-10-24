package com.hhg.fieldservices.workorder.dto;

import com.hhg.fieldservices.workorder.model.WorkOrderPriority;
import com.hhg.fieldservices.workorder.model.WorkOrderStatus;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Request DTO for updating an existing work order.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateWorkOrderRequest {
    
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;
    
    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;
    
    private WorkOrderStatus status;
    
    private WorkOrderPriority priority;
    
    private Long assignedTechnicianId;
    
    @Size(max = 200, message = "Technician name must not exceed 200 characters")
    private String assignedTechnicianName;
    
    private LocalDateTime scheduledDate;
    
    @DecimalMin(value = "0.0", inclusive = true, message = "Estimated cost must be non-negative")
    @Digits(integer = 8, fraction = 2, message = "Estimated cost must have at most 8 integer digits and 2 decimal places")
    private BigDecimal estimatedCost;
    
    @DecimalMin(value = "0.0", inclusive = true, message = "Actual cost must be non-negative")
    @Digits(integer = 8, fraction = 2, message = "Actual cost must have at most 8 integer digits and 2 decimal places")
    private BigDecimal actualCost;
    
    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;
}
