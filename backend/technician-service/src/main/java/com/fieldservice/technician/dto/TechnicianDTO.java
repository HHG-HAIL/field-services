package com.fieldservice.technician.dto;

import com.fieldservice.technician.entity.Technician;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Schema(description = "Technician data transfer object")
public class TechnicianDTO {
    
    @Schema(description = "Unique identifier of the technician", example = "1")
    private Long id;
    
    @NotBlank(message = "Name is required")
    @Schema(description = "Full name of the technician", example = "John Smith", required = true)
    private String name;
    
    @Email(message = "Valid email is required")
    @NotBlank(message = "Email is required")
    @Schema(description = "Email address of the technician", example = "john.smith@fieldservice.com", required = true)
    private String email;
    
    @Schema(description = "Phone number of the technician", example = "+1-555-1001")
    private String phoneNumber;
    
    @NotNull(message = "Status is required")
    @Schema(description = "Current availability status", example = "AVAILABLE", required = true)
    private Technician.Status status;
    
    @Schema(description = "Current location of the technician", example = "Downtown Office")
    private String currentLocation;
    
    @Schema(description = "List of technical skills", example = "[\"Network Installation\", \"Hardware Repair\"]")
    private List<String> skills = new ArrayList<>();
    
    private Integer experienceYears;
    
    private Double hourlyRate;
    
    private Integer maxConcurrentOrders;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // Current workload information
    private Integer currentWorkOrders;
    private Boolean isAvailableForAssignment;
    
    // Constructors
    public TechnicianDTO() {}
    
    public TechnicianDTO(Technician technician) {
        this.id = technician.getId();
        this.name = technician.getName();
        this.email = technician.getEmail();
        this.phoneNumber = technician.getPhoneNumber();
        this.status = technician.getStatus();
        this.currentLocation = technician.getCurrentLocation();
        this.skills = new ArrayList<>(technician.getSkills());
        this.experienceYears = technician.getExperienceYears();
        this.hourlyRate = technician.getHourlyRate();
        this.maxConcurrentOrders = technician.getMaxConcurrentOrders();
        this.createdAt = technician.getCreatedAt();
        this.updatedAt = technician.getUpdatedAt();
        this.isAvailableForAssignment = technician.getStatus() == Technician.Status.AVAILABLE;
    }
    
    // Convert DTO to Entity
    public Technician toEntity() {
        Technician technician = new Technician();
        technician.setId(this.id);
        technician.setName(this.name);
        technician.setEmail(this.email);
        technician.setPhoneNumber(this.phoneNumber);
        technician.setStatus(this.status);
        technician.setCurrentLocation(this.currentLocation);
        technician.setSkills(new ArrayList<>(this.skills));
        technician.setExperienceYears(this.experienceYears);
        technician.setHourlyRate(this.hourlyRate);
        technician.setMaxConcurrentOrders(this.maxConcurrentOrders);
        return technician;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public Technician.Status getStatus() { return status; }
    public void setStatus(Technician.Status status) { this.status = status; }
    
    public String getCurrentLocation() { return currentLocation; }
    public void setCurrentLocation(String currentLocation) { this.currentLocation = currentLocation; }
    
    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }
    
    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }
    
    public Double getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(Double hourlyRate) { this.hourlyRate = hourlyRate; }
    
    public Integer getMaxConcurrentOrders() { return maxConcurrentOrders; }
    public void setMaxConcurrentOrders(Integer maxConcurrentOrders) { this.maxConcurrentOrders = maxConcurrentOrders; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public Integer getCurrentWorkOrders() { return currentWorkOrders; }
    public void setCurrentWorkOrders(Integer currentWorkOrders) { this.currentWorkOrders = currentWorkOrders; }
    
    public Boolean getIsAvailableForAssignment() { return isAvailableForAssignment; }
    public void setIsAvailableForAssignment(Boolean isAvailableForAssignment) { this.isAvailableForAssignment = isAvailableForAssignment; }
}