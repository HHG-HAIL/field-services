package com.hhg.fieldservices.workorder.dto;

import com.hhg.fieldservices.workorder.model.WorkOrderPriority;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Request DTO for creating a new work order.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateWorkOrderRequest {
    
    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;
    
    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;
    
    @NotNull(message = "Priority is required")
    private WorkOrderPriority priority;
    
    @NotNull(message = "Customer ID is required")
    private Long customerId;
    
    @Size(max = 200, message = "Customer name must not exceed 200 characters")
    private String customerName;
    
    @Pattern(regexp = "^[0-9\\-\\+\\(\\)\\s]*$", message = "Invalid phone number format")
    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    private String customerPhone;
    
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String customerEmail;
    
    @Size(max = 500, message = "Service address must not exceed 500 characters")
    private String serviceAddress;
    
    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;
    
    @Size(max = 50, message = "State must not exceed 50 characters")
    private String state;
    
    @Pattern(regexp = "^[0-9]{5}(-[0-9]{4})?$", message = "Invalid ZIP code format")
    private String zipCode;
    
    @FutureOrPresent(message = "Scheduled date must be in the present or future")
    private LocalDateTime scheduledDate;
    
    @DecimalMin(value = "0.0", inclusive = true, message = "Estimated cost must be non-negative")
    @Digits(integer = 8, fraction = 2, message = "Estimated cost must have at most 8 integer digits and 2 decimal places")
    private BigDecimal estimatedCost;
    
    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;
    
    @Valid
    private List<CreateWorkOrderItemRequest> items;
}
