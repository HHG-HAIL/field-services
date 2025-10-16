package com.fieldservice.workorder.dto;

import com.fieldservice.workorder.entity.WorkOrder;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class WorkOrderDTO {
    
    private Long id;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotNull(message = "Priority is required")
    private WorkOrder.Priority priority;
    
    private WorkOrder.Status status;
    
    private String customerName;
    
    private String customerPhone;
    
    private String customerEmail;
    
    private String location;
    
    private Long assignedTechnicianId;
    
    private String assignedTechnicianName;
    
    private Integer estimatedDuration;
    
    private LocalDateTime scheduledDate;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // Constructors
    public WorkOrderDTO() {}
    
    public WorkOrderDTO(WorkOrder workOrder) {
        this.id = workOrder.getId();
        this.title = workOrder.getTitle();
        this.description = workOrder.getDescription();
        this.priority = workOrder.getPriority();
        this.status = workOrder.getStatus();
        this.customerName = workOrder.getCustomerName();
        this.customerPhone = workOrder.getCustomerPhone();
        this.customerEmail = workOrder.getCustomerEmail();
        this.location = workOrder.getLocation();
        this.assignedTechnicianId = workOrder.getAssignedTechnicianId();
        this.estimatedDuration = workOrder.getEstimatedDuration();
        this.scheduledDate = workOrder.getScheduledDate();
        this.createdAt = workOrder.getCreatedAt();
        this.updatedAt = workOrder.getUpdatedAt();
    }
    
    // Convert DTO to Entity
    public WorkOrder toEntity() {
        WorkOrder workOrder = new WorkOrder();
        workOrder.setId(this.id);
        workOrder.setTitle(this.title);
        workOrder.setDescription(this.description);
        workOrder.setPriority(this.priority);
        workOrder.setStatus(this.status);
        workOrder.setCustomerName(this.customerName);
        workOrder.setCustomerPhone(this.customerPhone);
        workOrder.setCustomerEmail(this.customerEmail);
        workOrder.setLocation(this.location);
        workOrder.setAssignedTechnicianId(this.assignedTechnicianId);
        workOrder.setEstimatedDuration(this.estimatedDuration);
        workOrder.setScheduledDate(this.scheduledDate);
        return workOrder;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public WorkOrder.Priority getPriority() { return priority; }
    public void setPriority(WorkOrder.Priority priority) { this.priority = priority; }
    
    public WorkOrder.Status getStatus() { return status; }
    public void setStatus(WorkOrder.Status status) { this.status = status; }
    
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    
    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }
    
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public Long getAssignedTechnicianId() { return assignedTechnicianId; }
    public void setAssignedTechnicianId(Long assignedTechnicianId) { this.assignedTechnicianId = assignedTechnicianId; }
    
    public String getAssignedTechnicianName() { return assignedTechnicianName; }
    public void setAssignedTechnicianName(String assignedTechnicianName) { this.assignedTechnicianName = assignedTechnicianName; }
    
    public Integer getEstimatedDuration() { return estimatedDuration; }
    public void setEstimatedDuration(Integer estimatedDuration) { this.estimatedDuration = estimatedDuration; }
    
    public LocalDateTime getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDateTime scheduledDate) { this.scheduledDate = scheduledDate; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}