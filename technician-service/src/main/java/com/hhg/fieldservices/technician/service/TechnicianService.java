package com.hhg.fieldservices.technician.service;

import com.hhg.fieldservices.technician.dto.CreateTechnicianRequest;
import com.hhg.fieldservices.technician.dto.TechnicianDto;
import com.hhg.fieldservices.technician.dto.UpdateTechnicianRequest;
import com.hhg.fieldservices.technician.exception.TechnicianAlreadyExistsException;
import com.hhg.fieldservices.technician.exception.TechnicianNotFoundException;
import com.hhg.fieldservices.technician.mapper.TechnicianMapper;
import com.hhg.fieldservices.technician.model.Technician;
import com.hhg.fieldservices.technician.model.TechnicianStatus;
import com.hhg.fieldservices.technician.repository.TechnicianRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for managing technician operations.
 * Handles business logic for CRUD operations and technician management.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TechnicianService {
    
    private final TechnicianRepository technicianRepository;
    private final TechnicianMapper technicianMapper;
    
    /**
     * Get all technicians.
     * 
     * @return list of all technicians
     */
    @Transactional(readOnly = true)
    public List<TechnicianDto> findAll() {
        log.debug("Finding all technicians");
        return technicianRepository.findAll().stream()
                .map(technicianMapper::toDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Get technician by ID.
     * 
     * @param id the technician ID
     * @return the technician DTO
     * @throws TechnicianNotFoundException if technician not found
     */
    @Transactional(readOnly = true)
    public TechnicianDto findById(Long id) {
        log.debug("Finding technician by id: {}", id);
        Technician technician = technicianRepository.findById(id)
                .orElseThrow(() -> new TechnicianNotFoundException(id));
        return technicianMapper.toDto(technician);
    }
    
    /**
     * Get technician by email.
     * 
     * @param email the email address
     * @return the technician DTO
     * @throws TechnicianNotFoundException if technician not found
     */
    @Transactional(readOnly = true)
    public TechnicianDto findByEmail(String email) {
        log.debug("Finding technician by email: {}", email);
        Technician technician = technicianRepository.findByEmail(email)
                .orElseThrow(() -> new TechnicianNotFoundException(email));
        return technicianMapper.toDto(technician);
    }
    
    /**
     * Get technicians by status.
     * 
     * @param status the technician status
     * @return list of technicians with the specified status
     */
    @Transactional(readOnly = true)
    public List<TechnicianDto> findByStatus(TechnicianStatus status) {
        log.debug("Finding technicians by status: {}", status);
        return technicianRepository.findByStatus(status).stream()
                .map(technicianMapper::toDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Get available technicians.
     * 
     * @return list of available technicians
     */
    @Transactional(readOnly = true)
    public List<TechnicianDto> findAvailableTechnicians() {
        log.debug("Finding available technicians");
        return technicianRepository.findAvailableTechnicians().stream()
                .map(technicianMapper::toDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Get technicians by skill.
     * 
     * @param skill the skill to search for
     * @return list of technicians with the specified skill
     */
    @Transactional(readOnly = true)
    public List<TechnicianDto> findBySkill(String skill) {
        log.debug("Finding technicians by skill: {}", skill);
        return technicianRepository.findBySkillContaining(skill).stream()
                .map(technicianMapper::toDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Get technicians by city.
     * 
     * @param city the city name
     * @return list of technicians in the specified city
     */
    @Transactional(readOnly = true)
    public List<TechnicianDto> findByCity(String city) {
        log.debug("Finding technicians by city: {}", city);
        return technicianRepository.findByCity(city).stream()
                .map(technicianMapper::toDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Get technicians by state.
     * 
     * @param state the state code
     * @return list of technicians in the specified state
     */
    @Transactional(readOnly = true)
    public List<TechnicianDto> findByState(String state) {
        log.debug("Finding technicians by state: {}", state);
        return technicianRepository.findByState(state).stream()
                .map(technicianMapper::toDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Create a new technician.
     * 
     * @param request the creation request
     * @return the created technician DTO
     * @throws TechnicianAlreadyExistsException if email already exists
     */
    public TechnicianDto create(CreateTechnicianRequest request) {
        log.debug("Creating new technician with email: {}", request.getEmail());
        
        // Check if technician with email already exists
        if (technicianRepository.existsByEmail(request.getEmail())) {
            throw new TechnicianAlreadyExistsException(request.getEmail());
        }
        
        Technician technician = technicianMapper.toEntity(request);
        Technician saved = technicianRepository.save(technician);
        
        log.info("Created technician with id: {}", saved.getId());
        return technicianMapper.toDto(saved);
    }
    
    /**
     * Update an existing technician.
     * 
     * @param id the technician ID
     * @param request the update request
     * @return the updated technician DTO
     * @throws TechnicianNotFoundException if technician not found
     */
    public TechnicianDto update(Long id, UpdateTechnicianRequest request) {
        log.debug("Updating technician with id: {}", id);
        
        Technician technician = technicianRepository.findById(id)
                .orElseThrow(() -> new TechnicianNotFoundException(id));
        
        // If email is being changed, check if new email already exists
        if (request.getEmail() != null && !request.getEmail().equals(technician.getEmail())) {
            if (technicianRepository.existsByEmail(request.getEmail())) {
                throw new TechnicianAlreadyExistsException(request.getEmail());
            }
        }
        
        technicianMapper.updateEntity(technician, request);
        Technician updated = technicianRepository.save(technician);
        
        log.info("Updated technician with id: {}", id);
        return technicianMapper.toDto(updated);
    }
    
    /**
     * Update technician status.
     * 
     * @param id the technician ID
     * @param status the new status
     * @return the updated technician DTO
     * @throws TechnicianNotFoundException if technician not found
     */
    public TechnicianDto updateStatus(Long id, TechnicianStatus status) {
        log.debug("Updating status of technician {} to {}", id, status);
        
        Technician technician = technicianRepository.findById(id)
                .orElseThrow(() -> new TechnicianNotFoundException(id));
        
        technician.setStatus(status);
        Technician updated = technicianRepository.save(technician);
        
        log.info("Updated status of technician {} to {}", id, status);
        return technicianMapper.toDto(updated);
    }
    
    /**
     * Delete a technician.
     * 
     * @param id the technician ID
     * @throws TechnicianNotFoundException if technician not found
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
