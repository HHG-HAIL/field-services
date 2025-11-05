package com.hhg.fieldservices.technician.service;

import com.hhg.fieldservices.technician.dto.CreateTechnicianRequest;
import com.hhg.fieldservices.technician.dto.TechnicianDto;
import com.hhg.fieldservices.technician.dto.UpdateTechnicianRequest;
import com.hhg.fieldservices.technician.exception.DuplicateResourceException;
import com.hhg.fieldservices.technician.exception.ResourceNotFoundException;
import com.hhg.fieldservices.technician.model.SkillLevel;
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
 * Service class for managing technicians.
 * Handles business logic for technician operations.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TechnicianService {

    private final TechnicianRepository technicianRepository;

    /**
     * Retrieve all technicians.
     * 
     * @return list of all technicians
     */
    @Transactional(readOnly = true)
    public List<TechnicianDto> findAll() {
        log.debug("Fetching all technicians");
        return technicianRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Retrieve a technician by ID.
     * 
     * @param id the technician ID
     * @return the technician DTO
     * @throws ResourceNotFoundException if technician not found
     */
    @Transactional(readOnly = true)
    public TechnicianDto findById(Long id) {
        log.debug("Fetching technician with ID: {}", id);
        Technician technician = technicianRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Technician with ID " + id + " not found"));
        return toDto(technician);
    }

    /**
     * Retrieve a technician by employee ID.
     * 
     * @param employeeId the employee ID
     * @return the technician DTO
     * @throws ResourceNotFoundException if technician not found
     */
    @Transactional(readOnly = true)
    public TechnicianDto findByEmployeeId(String employeeId) {
        log.debug("Fetching technician with employee ID: {}", employeeId);
        Technician technician = technicianRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Technician with employee ID " + employeeId + " not found"));
        return toDto(technician);
    }

    /**
     * Retrieve technicians by status.
     * 
     * @param status the status to filter by
     * @return list of technicians with the specified status
     */
    @Transactional(readOnly = true)
    public List<TechnicianDto> findByStatus(TechnicianStatus status) {
        log.debug("Fetching technicians with status: {}", status);
        return technicianRepository.findByStatus(status).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Retrieve technicians by skill level.
     * 
     * @param skillLevel the skill level to filter by
     * @return list of technicians with the specified skill level
     */
    @Transactional(readOnly = true)
    public List<TechnicianDto> findBySkillLevel(SkillLevel skillLevel) {
        log.debug("Fetching technicians with skill level: {}", skillLevel);
        return technicianRepository.findBySkillLevel(skillLevel).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Create a new technician.
     * 
     * @param request the create request
     * @return the created technician DTO
     * @throws DuplicateResourceException if employee ID or email already exists
     */
    @Transactional
    public TechnicianDto create(CreateTechnicianRequest request) {
        log.debug("Creating technician with employee ID: {}", request.getEmployeeId());
        
        // Check for duplicate employee ID
        if (technicianRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new DuplicateResourceException("Technician with employee ID " + request.getEmployeeId() + " already exists");
        }
        
        // Check for duplicate email
        if (technicianRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Technician with email " + request.getEmail() + " already exists");
        }
        
        Technician technician = Technician.builder()
                .employeeId(request.getEmployeeId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .status(request.getStatus())
                .skillLevel(request.getSkillLevel())
                .build();
        
        Technician saved = technicianRepository.save(technician);
        log.info("Technician created with ID: {}", saved.getId());
        return toDto(saved);
    }

    /**
     * Update an existing technician.
     * 
     * @param id the technician ID
     * @param request the update request
     * @return the updated technician DTO
     * @throws ResourceNotFoundException if technician not found
     * @throws DuplicateResourceException if email already exists for another technician
     */
    @Transactional
    public TechnicianDto update(Long id, UpdateTechnicianRequest request) {
        log.debug("Updating technician with ID: {}", id);
        
        Technician technician = technicianRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Technician with ID " + id + " not found"));
        
        // Check for duplicate email if email is being updated
        if (request.getEmail() != null && !request.getEmail().equals(technician.getEmail())) {
            if (technicianRepository.existsByEmail(request.getEmail())) {
                throw new DuplicateResourceException("Technician with email " + request.getEmail() + " already exists");
            }
            technician.setEmail(request.getEmail());
        }
        
        // Update fields if provided
        if (request.getFirstName() != null) {
            technician.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            technician.setLastName(request.getLastName());
        }
        if (request.getPhone() != null) {
            technician.setPhone(request.getPhone());
        }
        if (request.getStatus() != null) {
            technician.setStatus(request.getStatus());
        }
        if (request.getSkillLevel() != null) {
            technician.setSkillLevel(request.getSkillLevel());
        }
        
        Technician updated = technicianRepository.save(technician);
        log.info("Technician updated with ID: {}", updated.getId());
        return toDto(updated);
    }

    /**
     * Delete a technician by ID.
     * 
     * @param id the technician ID
     * @throws ResourceNotFoundException if technician not found
     */
    @Transactional
    public void delete(Long id) {
        log.debug("Deleting technician with ID: {}", id);
        
        if (!technicianRepository.existsById(id)) {
            throw new ResourceNotFoundException("Technician with ID " + id + " not found");
        }
        
        technicianRepository.deleteById(id);
        log.info("Technician deleted with ID: {}", id);
    }

    /**
     * Convert Technician entity to DTO.
     * 
     * @param technician the entity
     * @return the DTO
     */
    private TechnicianDto toDto(Technician technician) {
        return TechnicianDto.builder()
                .id(technician.getId())
                .employeeId(technician.getEmployeeId())
                .firstName(technician.getFirstName())
                .lastName(technician.getLastName())
                .email(technician.getEmail())
                .phone(technician.getPhone())
                .status(technician.getStatus())
                .skillLevel(technician.getSkillLevel())
                .createdAt(technician.getCreatedAt())
                .updatedAt(technician.getUpdatedAt())
                .build();
    }
}
