package com.fieldservice.technician.service;

import com.fieldservice.technician.dto.TechnicianDTO;
import com.fieldservice.technician.entity.Technician;
import com.fieldservice.technician.repository.TechnicianRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class TechnicianService {
    
    @Autowired
    private TechnicianRepository technicianRepository;
    
    public List<TechnicianDTO> getAllTechnicians() {
        return technicianRepository.findAll().stream()
                .map(TechnicianDTO::new)
                .collect(Collectors.toList());
    }
    
    public Optional<TechnicianDTO> getTechnicianById(Long id) {
        return technicianRepository.findById(id)
                .map(TechnicianDTO::new);
    }
    
    public List<TechnicianDTO> getAvailableTechnicians() {
        return technicianRepository.findAvailableTechnicians().stream()
                .map(TechnicianDTO::new)
                .collect(Collectors.toList());
    }
    
    public List<TechnicianDTO> getTechniciansByStatus(Technician.Status status) {
        return technicianRepository.findByStatus(status).stream()
                .map(TechnicianDTO::new)
                .collect(Collectors.toList());
    }
    
    public List<TechnicianDTO> getTechniciansBySkill(String skill) {
        return technicianRepository.findBySkill(skill).stream()
                .map(TechnicianDTO::new)
                .collect(Collectors.toList());
    }
    
    public List<TechnicianDTO> getAvailableTechniciansBySkill(String skill) {
        return technicianRepository.findAvailableTechniciansBySkill(skill).stream()
                .map(TechnicianDTO::new)
                .collect(Collectors.toList());
    }
    
    public List<TechnicianDTO> getTechniciansByLocation(String location) {
        return technicianRepository.findByCurrentLocation(location).stream()
                .map(TechnicianDTO::new)
                .collect(Collectors.toList());
    }
    
    public TechnicianDTO createTechnician(TechnicianDTO technicianDTO) {
        Technician technician = technicianDTO.toEntity();
        Technician savedTechnician = technicianRepository.save(technician);
        return new TechnicianDTO(savedTechnician);
    }
    
    public Optional<TechnicianDTO> updateTechnician(Long id, TechnicianDTO technicianDTO) {
        return technicianRepository.findById(id)
                .map(existingTechnician -> {
                    // Update fields
                    existingTechnician.setName(technicianDTO.getName());
                    existingTechnician.setEmail(technicianDTO.getEmail());
                    existingTechnician.setPhoneNumber(technicianDTO.getPhoneNumber());
                    existingTechnician.setStatus(technicianDTO.getStatus());
                    existingTechnician.setCurrentLocation(technicianDTO.getCurrentLocation());
                    existingTechnician.setSkills(technicianDTO.getSkills());
                    existingTechnician.setExperienceYears(technicianDTO.getExperienceYears());
                    existingTechnician.setHourlyRate(technicianDTO.getHourlyRate());
                    existingTechnician.setMaxConcurrentOrders(technicianDTO.getMaxConcurrentOrders());
                    
                    Technician updatedTechnician = technicianRepository.save(existingTechnician);
                    return new TechnicianDTO(updatedTechnician);
                });
    }
    
    public Optional<TechnicianDTO> updateTechnicianStatus(Long id, Technician.Status status) {
        return technicianRepository.findById(id)
                .map(technician -> {
                    technician.setStatus(status);
                    Technician updatedTechnician = technicianRepository.save(technician);
                    return new TechnicianDTO(updatedTechnician);
                });
    }
    
    public Optional<TechnicianDTO> updateTechnicianLocation(Long id, String location) {
        return technicianRepository.findById(id)
                .map(technician -> {
                    technician.setCurrentLocation(location);
                    Technician updatedTechnician = technicianRepository.save(technician);
                    return new TechnicianDTO(updatedTechnician);
                });
    }
    
    public boolean deleteTechnician(Long id) {
        if (technicianRepository.existsById(id)) {
            technicianRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public long getTechnicianCountByStatus(Technician.Status status) {
        return technicianRepository.countByStatus(status);
    }
    
    // Assignment algorithm - find best technician for a work order
    public Optional<TechnicianDTO> findBestTechnicianForSkills(List<String> requiredSkills) {
        List<Technician> availableTechnicians = technicianRepository.findAvailableTechnicians();
        
        return availableTechnicians.stream()
                .filter(tech -> tech.getSkills().containsAll(requiredSkills))
                .max((t1, t2) -> {
                    // Prioritize by experience, then by skills match
                    int experienceCompare = Integer.compare(
                        t1.getExperienceYears() != null ? t1.getExperienceYears() : 0,
                        t2.getExperienceYears() != null ? t2.getExperienceYears() : 0
                    );
                    if (experienceCompare != 0) return experienceCompare;
                    
                    // If experience is equal, prefer technician with more matching skills
                    long t1MatchingSkills = t1.getSkills().stream()
                            .mapToLong(skill -> requiredSkills.contains(skill) ? 1 : 0)
                            .sum();
                    long t2MatchingSkills = t2.getSkills().stream()
                            .mapToLong(skill -> requiredSkills.contains(skill) ? 1 : 0)
                            .sum();
                    
                    return Long.compare(t1MatchingSkills, t2MatchingSkills);
                })
                .map(TechnicianDTO::new);
    }
}