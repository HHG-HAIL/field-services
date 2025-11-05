package com.hhg.fieldservices.technician.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Entity representing a field service technician.
 * Contains profile information, skills, and availability status.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Entity
@Table(name = "technicians", indexes = {
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_email", columnList = "email"),
    @Index(name = "idx_phone", columnList = "phone_number")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Technician {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;
    
    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;
    
    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;
    
    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;
    
    @Column(name = "address", length = 500)
    private String address;
    
    @Column(name = "city", length = 100)
    private String city;
    
    @Column(name = "state", length = 50)
    private String state;
    
    @Column(name = "zip_code", length = 20)
    private String zipCode;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private TechnicianStatus status = TechnicianStatus.AVAILABLE;
    
    @Column(name = "skills", length = 1000)
    private String skills;
    
    @Column(name = "certifications", length = 1000)
    private String certifications;
    
    @Column(name = "notes", length = 2000)
    private String notes;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @Version
    @Column(name = "version", nullable = false)
    private Long version = 0L;
}
