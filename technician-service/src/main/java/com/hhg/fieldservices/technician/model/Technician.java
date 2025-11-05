package com.hhg.fieldservices.technician.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity representing a field service technician.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Entity
@Table(name = "technicians", indexes = {
    @Index(name = "idx_employee_id", columnList = "employeeId", unique = true),
    @Index(name = "idx_email", columnList = "email", unique = true),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_skill_level", columnList = "skillLevel")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Technician {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 50)
    private String employeeId;
    
    @Column(nullable = false, length = 100)
    private String firstName;
    
    @Column(nullable = false, length = 100)
    private String lastName;
    
    @Column(nullable = false, unique = true, length = 255)
    private String email;
    
    @Column(length = 20)
    private String phone;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TechnicianStatus status;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TechnicianSkillLevel skillLevel;
    
    @ElementCollection
    @CollectionTable(name = "technician_skills", joinColumns = @JoinColumn(name = "technician_id"))
    @Column(name = "skill", length = 100)
    @Builder.Default
    private Set<String> skills = new HashSet<>();
    
    @Column(length = 500)
    private String address;
    
    @Column(length = 100)
    private String city;
    
    @Column(length = 50)
    private String state;
    
    @Column(length = 20)
    private String zipCode;
    
    @Column(length = 1000)
    private String notes;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @Version
    private Long version;
    
    /**
     * Get full name of the technician
     */
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
