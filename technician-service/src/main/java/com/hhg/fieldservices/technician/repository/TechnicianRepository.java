package com.hhg.fieldservices.technician.repository;

import com.hhg.fieldservices.technician.model.SkillLevel;
import com.hhg.fieldservices.technician.model.Technician;
import com.hhg.fieldservices.technician.model.TechnicianStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Technician entity.
 * Provides data access methods for technician operations.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Repository
public interface TechnicianRepository extends JpaRepository<Technician, Long> {

    /**
     * Find a technician by employee ID.
     * 
     * @param employeeId the employee ID
     * @return Optional containing the technician if found
     */
    Optional<Technician> findByEmployeeId(String employeeId);

    /**
     * Find a technician by email address.
     * 
     * @param email the email address
     * @return Optional containing the technician if found
     */
    Optional<Technician> findByEmail(String email);

    /**
     * Find all technicians by status.
     * 
     * @param status the technician status
     * @return list of technicians with the specified status
     */
    List<Technician> findByStatus(TechnicianStatus status);

    /**
     * Find all technicians by skill level.
     * 
     * @param skillLevel the skill level
     * @return list of technicians with the specified skill level
     */
    List<Technician> findBySkillLevel(SkillLevel skillLevel);

    /**
     * Check if a technician exists by employee ID.
     * 
     * @param employeeId the employee ID
     * @return true if a technician with the given employee ID exists
     */
    boolean existsByEmployeeId(String employeeId);

    /**
     * Check if a technician exists by email address.
     * 
     * @param email the email address
     * @return true if a technician with the given email exists
     */
    boolean existsByEmail(String email);
}
