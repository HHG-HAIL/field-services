package com.hhg.fieldservices.workorder.dto;

import com.hhg.fieldservices.workorder.model.WorkOrderPriority;
import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "Request for creating a new work order")
public class CreateWorkOrderRequest {
    
    @Schema(description = "Work order title", example = "HVAC Repair", required = true)
    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;
    
    @Schema(description = "Detailed description", example = "Air conditioning unit not cooling")
    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;
    
    @Schema(description = "Priority level", example = "HIGH", required = true)
    @NotNull(message = "Priority is required")
    private WorkOrderPriority priority;
    
    @Schema(description = "Customer ID", example = "100", required = true)
    @NotNull(message = "Customer ID is required")
    private Long customerId;
    
    @Schema(description = "Customer name", example = "John Doe")
    @Size(max = 200, message = "Customer name must not exceed 200 characters")
    private String customerName;
    
    @Schema(description = "Customer phone number", example = "555-1234")
    @Pattern(regexp = "^[0-9\\-\\+\\(\\)\\s]*$", message = "Invalid phone number format")
    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    private String customerPhone;
    
    @Schema(description = "Customer email", example = "john@example.com")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String customerEmail;
    
    @Schema(description = "Service address", example = "123 Main St")
    @Size(max = 500, message = "Service address must not exceed 500 characters")
    private String serviceAddress;
    
    @Schema(description = "City", example = "Springfield")
    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;
    
    @Schema(description = "State", example = "IL")
    @Size(max = 50, message = "State must not exceed 50 characters")
    private String state;
    
    @Schema(description = "ZIP code", example = "62701")
    @Pattern(regexp = "^[0-9]{5}(-[0-9]{4})?$", message = "Invalid ZIP code format")
    private String zipCode;
    
    @Schema(description = "Scheduled date and time", example = "2025-10-25T10:00:00")
    @FutureOrPresent(message = "Scheduled date must be in the present or future")
    private LocalDateTime scheduledDate;
    
    @Schema(description = "Estimated cost", example = "500.00")
    @DecimalMin(value = "0.0", inclusive = true, message = "Estimated cost must be non-negative")
    @Digits(integer = 8, fraction = 2, message = "Estimated cost must have at most 8 integer digits and 2 decimal places")
    private BigDecimal estimatedCost;
    
    @Schema(description = "Additional notes")
    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;
    
    @Schema(description = "Work order line items")
    @Valid
    private List<CreateWorkOrderItemRequest> items;
}
