package com.hhg.fieldservices.technician.repository;

import com.hhg.fieldservices.technician.model.Technician;
import com.hhg.fieldservices.technician.model.TechnicianStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Technician entity.
 * Provides data access methods for technician management.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Repository
public interface TechnicianRepository extends JpaRepository<Technician, Long> {
    
    /**
     * Find technician by email address.
     * 
     * @param email the email address
     * @return Optional containing the technician if found
     */
    Optional<Technician> findByEmail(String email);
    
    /**
     * Find technicians by status.
     * 
     * @param status the technician status
     * @return list of technicians with the specified status
     */
    List<Technician> findByStatus(TechnicianStatus status);
    
    /**
     * Find available technicians (status = AVAILABLE).
     * 
     * @return list of available technicians
     */
    @Query("SELECT t FROM Technician t WHERE t.status = 'AVAILABLE' ORDER BY t.lastName, t.firstName")
    List<Technician> findAvailableTechnicians();
    
    /**
     * Check if technician exists with given email.
     * 
     * @param email the email address
     * @return true if technician exists
     */
    boolean existsByEmail(String email);
    
    /**
     * Find technicians by skill (case-insensitive search in skills field).
     * 
     * @param skill the skill to search for
     * @return list of technicians with the specified skill
     */
    @Query("SELECT t FROM Technician t WHERE LOWER(t.skills) LIKE LOWER(CONCAT('%', :skill, '%'))")
    List<Technician> findBySkillContaining(@Param("skill") String skill);
    
    /**
     * Find technicians by city.
     * 
     * @param city the city name
     * @return list of technicians in the specified city
     */
    List<Technician> findByCity(String city);
    
    /**
     * Find technicians by state.
     * 
     * @param state the state code
     * @return list of technicians in the specified state
     */
    List<Technician> findByState(String state);
}
