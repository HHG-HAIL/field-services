package com.hhg.fieldservices.technician.service;

import com.hhg.fieldservices.technician.dto.CreateTechnicianRequest;
import com.hhg.fieldservices.technician.dto.TechnicianDto;
import com.hhg.fieldservices.technician.dto.UpdateTechnicianRequest;
import com.hhg.fieldservices.technician.exception.TechnicianNotFoundException;
import com.hhg.fieldservices.technician.exception.TechnicianValidationException;
import com.hhg.fieldservices.technician.mapper.TechnicianMapper;
import com.hhg.fieldservices.technician.model.Technician;
import com.hhg.fieldservices.technician.model.TechnicianSkillLevel;
import com.hhg.fieldservices.technician.model.TechnicianStatus;
import com.hhg.fieldservices.technician.repository.TechnicianRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for managing technicians.
 * Implements business logic for technician operations.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class TechnicianService {
    
    private final TechnicianRepository technicianRepository;
    private final TechnicianMapper technicianMapper;
    
    /**
     * Find all technicians
     */
    @Transactional(readOnly = true)
    public List<TechnicianDto> findAll() {
        log.debug("Fetching all technicians");
        List<Technician> technicians = technicianRepository.findAll();
        return technicianMapper.toDtoList(technicians);
    }
    
    /**
     * Find technician by ID
     */
    @Transactional(readOnly = true)
    public TechnicianDto findById(Long id) {
        log.debug("Fetching technician with id: {}", id);
        Technician technician = technicianRepository.findById(id)
            .orElseThrow(() -> new TechnicianNotFoundException(id));
        return technicianMapper.toDto(technician);
    }
    
    /**
     * Find technician by employee ID
     */
    @Transactional(readOnly = true)
    public TechnicianDto findByEmployeeId(String employeeId) {
        log.debug("Fetching technician with employee ID: {}", employeeId);
        Technician technician = technicianRepository.findByEmployeeId(employeeId)
            .orElseThrow(() -> new TechnicianNotFoundException(employeeId));
        return technicianMapper.toDto(technician);
    }
    
    /**
     * Find technicians by status
     */
    @Transactional(readOnly = true)
    public List<TechnicianDto> findByStatus(TechnicianStatus status) {
        log.debug("Fetching technicians with status: {}", status);
        List<Technician> technicians = technicianRepository.findByStatus(status);
        return technicianMapper.toDtoList(technicians);
    }
    
    /**
     * Find technicians by skill level
     */
    @Transactional(readOnly = true)
    public List<TechnicianDto> findBySkillLevel(TechnicianSkillLevel skillLevel) {
        log.debug("Fetching technicians with skill level: {}", skillLevel);
        List<Technician> technicians = technicianRepository.findBySkillLevel(skillLevel);
        return technicianMapper.toDtoList(technicians);
    }
    
    /**
     * Find technicians with a specific skill
     */
    @Transactional(readOnly = true)
    public List<TechnicianDto> findBySkill(String skill) {
        log.debug("Fetching technicians with skill: {}", skill);
        List<Technician> technicians = technicianRepository.findBySkill(skill);
        return technicianMapper.toDtoList(technicians);
    }
    
    /**
     * Create a new technician
     */
    public TechnicianDto create(CreateTechnicianRequest request) {
        log.debug("Creating new technician: {} {}", request.getFirstName(), request.getLastName());
        
        // Validate unique constraints
        if (technicianRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new TechnicianValidationException(
                "Technician with employee ID " + request.getEmployeeId() + " already exists");
        }
        
        if (technicianRepository.existsByEmail(request.getEmail())) {
            throw new TechnicianValidationException(
                "Technician with email " + request.getEmail() + " already exists");
        }
        
        Technician technician = technicianMapper.toEntity(request);
        technician = technicianRepository.save(technician);
        log.info("Created technician with id: {} and employee ID: {}", 
            technician.getId(), technician.getEmployeeId());
        
        return technicianMapper.toDto(technician);
    }
    
    /**
     * Update an existing technician
     */
    public TechnicianDto update(Long id, UpdateTechnicianRequest request) {
        log.debug("Updating technician with id: {}", id);
        
        Technician technician = technicianRepository.findById(id)
            .orElseThrow(() -> new TechnicianNotFoundException(id));
        
        // Validate email uniqueness if it's being changed
        if (request.getEmail() != null && !request.getEmail().equals(technician.getEmail())) {
            if (technicianRepository.existsByEmail(request.getEmail())) {
                throw new TechnicianValidationException(
                    "Technician with email " + request.getEmail() + " already exists");
            }
        }
        
        technicianMapper.updateEntityFromDto(request, technician);
        technician = technicianRepository.save(technician);
        log.info("Updated technician with id: {}", id);
        
        return technicianMapper.toDto(technician);
    }
    
    /**
     * Delete a technician
     */
    public void delete(Long id) {
        log.debug("Deleting technician with id: {}", id);
        
        if (!technicianRepository.existsById(id)) {
            throw new TechnicianNotFoundException(id);
        }
        
        technicianRepository.deleteById(id);
        log.info("Deleted technician with id: {}", id);
    }
}
