package com.hhg.fieldservices.technician.repository;

import com.hhg.fieldservices.technician.model.Technician;
import com.hhg.fieldservices.technician.model.TechnicianSkillLevel;
import com.hhg.fieldservices.technician.model.TechnicianStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Technician entity.
 * Provides data access methods for technicians.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Repository
public interface TechnicianRepository extends JpaRepository<Technician, Long> {
    
    /**
     * Find a technician by employee ID
     */
    Optional<Technician> findByEmployeeId(String employeeId);
    
    /**
     * Find a technician by email
     */
    Optional<Technician> findByEmail(String email);
    
    /**
     * Find technicians by status
     */
    List<Technician> findByStatus(TechnicianStatus status);
    
    /**
     * Find technicians by skill level
     */
    List<Technician> findBySkillLevel(TechnicianSkillLevel skillLevel);
    
    /**
     * Find technicians by status and skill level
     */
    List<Technician> findByStatusAndSkillLevel(TechnicianStatus status, TechnicianSkillLevel skillLevel);
    
    /**
     * Check if a technician exists by employee ID
     */
    boolean existsByEmployeeId(String employeeId);
    
    /**
     * Check if a technician exists by email
     */
    boolean existsByEmail(String email);
    
    /**
     * Find technicians with a specific skill
     */
    @Query("SELECT t FROM Technician t JOIN t.skills s WHERE s = :skill")
    List<Technician> findBySkill(@Param("skill") String skill);
}
