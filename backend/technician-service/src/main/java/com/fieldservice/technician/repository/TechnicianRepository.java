package com.fieldservice.technician.repository;

import com.fieldservice.technician.entity.Technician;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TechnicianRepository extends JpaRepository<Technician, Long> {
    
    List<Technician> findByStatus(Technician.Status status);
    
    @Query("SELECT t FROM Technician t WHERE t.status = 'AVAILABLE'")
    List<Technician> findAvailableTechnicians();
    
    @Query("SELECT t FROM Technician t JOIN t.skills s WHERE s = :skill")
    List<Technician> findBySkill(@Param("skill") String skill);
    
    @Query("SELECT t FROM Technician t WHERE t.status = 'AVAILABLE' AND :skill MEMBER OF t.skills")
    List<Technician> findAvailableTechniciansBySkill(@Param("skill") String skill);
    
    List<Technician> findByCurrentLocation(String location);
    
    @Query("SELECT t FROM Technician t WHERE t.experienceYears >= :minYears")
    List<Technician> findByMinimumExperience(@Param("minYears") Integer minYears);
    
    long countByStatus(Technician.Status status);
}