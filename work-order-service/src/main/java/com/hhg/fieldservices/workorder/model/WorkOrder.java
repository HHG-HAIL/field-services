package com.hhg.fieldservices.workorder.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing a work order in the field services system.
 * A work order is a request for service that needs to be completed by a technician.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Entity
@Table(name = "work_orders", indexes = {
    @Index(name = "idx_work_order_number", columnList = "workOrderNumber", unique = true),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_priority", columnList = "priority"),
    @Index(name = "idx_customer_id", columnList = "customerId"),
    @Index(name = "idx_assigned_technician_id", columnList = "assignedTechnicianId"),
    @Index(name = "idx_scheduled_date", columnList = "scheduledDate"),
    @Index(name = "idx_created_at", columnList = "createdAt")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkOrder {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 50)
    private String workOrderNumber;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(length = 2000)
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private WorkOrderStatus status;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private WorkOrderPriority priority;
    
    @Column(nullable = false)
    private Long customerId;
    
    @Column(length = 200)
    private String customerName;
    
    @Column(length = 20)
    private String customerPhone;
    
    @Column(length = 100)
    private String customerEmail;
    
    @Column(length = 500)
    private String serviceAddress;
    
    @Column(length = 100)
    private String city;
    
    @Column(length = 50)
    private String state;
    
    @Column(length = 20)
    private String zipCode;
    
    @Column
    private Long assignedTechnicianId;
    
    @Column(length = 200)
    private String assignedTechnicianName;
    
    @Column
    private LocalDateTime scheduledDate;
    
    @Column
    private LocalDateTime startedAt;
    
    @Column
    private LocalDateTime completedAt;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal estimatedCost;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal actualCost;
    
    @Column(length = 1000)
    private String notes;
    
    @OneToMany(mappedBy = "workOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<WorkOrderItem> items = new ArrayList<>();
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @Version
    private Long version;
    
    /**
     * Helper method to add an item to the work order
     */
    public void addItem(WorkOrderItem item) {
        items.add(item);
        item.setWorkOrder(this);
    }
    
    /**
     * Helper method to remove an item from the work order
     */
    public void removeItem(WorkOrderItem item) {
        items.remove(item);
        item.setWorkOrder(null);
    }
}
