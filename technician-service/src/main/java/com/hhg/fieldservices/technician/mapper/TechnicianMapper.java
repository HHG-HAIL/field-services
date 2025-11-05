package com.hhg.fieldservices.technician.mapper;

import com.hhg.fieldservices.technician.dto.CreateTechnicianRequest;
import com.hhg.fieldservices.technician.dto.TechnicianDto;
import com.hhg.fieldservices.technician.dto.UpdateTechnicianRequest;
import com.hhg.fieldservices.technician.model.Technician;
import com.hhg.fieldservices.technician.model.TechnicianStatus;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting between Technician entities and DTOs.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Component
public class TechnicianMapper {
    
    /**
     * Convert Technician entity to DTO.
     * 
     * @param technician the entity
     * @return the DTO
     */
    public TechnicianDto toDto(Technician technician) {
        if (technician == null) {
            return null;
        }
        
        return new TechnicianDto(
            technician.getId(),
            technician.getFirstName(),
            technician.getLastName(),
            technician.getEmail(),
            technician.getPhoneNumber(),
            technician.getAddress(),
            technician.getCity(),
            technician.getState(),
            technician.getZipCode(),
            technician.getStatus(),
            technician.getSkills(),
            technician.getCertifications(),
            technician.getNotes(),
            technician.getCreatedAt(),
            technician.getUpdatedAt(),
            technician.getVersion()
        );
    }
    
    /**
     * Convert CreateTechnicianRequest to entity.
     * 
     * @param request the creation request
     * @return the entity
     */
    public Technician toEntity(CreateTechnicianRequest request) {
        if (request == null) {
            return null;
        }
        
        Technician technician = new Technician();
        technician.setFirstName(request.getFirstName());
        technician.setLastName(request.getLastName());
        technician.setEmail(request.getEmail());
        technician.setPhoneNumber(request.getPhoneNumber());
        technician.setAddress(request.getAddress());
        technician.setCity(request.getCity());
        technician.setState(request.getState());
        technician.setZipCode(request.getZipCode());
        technician.setStatus(request.getStatus() != null ? request.getStatus() : TechnicianStatus.AVAILABLE);
        technician.setSkills(request.getSkills());
        technician.setCertifications(request.getCertifications());
        technician.setNotes(request.getNotes());
        
        return technician;
    }
    
    /**
     * Update entity with data from UpdateTechnicianRequest.
     * Only updates non-null fields.
     * 
     * @param technician the entity to update
     * @param request the update request
     */
    public void updateEntity(Technician technician, UpdateTechnicianRequest request) {
        if (technician == null || request == null) {
            return;
        }
        
        if (request.getFirstName() != null) {
            technician.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            technician.setLastName(request.getLastName());
        }
        if (request.getEmail() != null) {
            technician.setEmail(request.getEmail());
        }
        if (request.getPhoneNumber() != null) {
            technician.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getAddress() != null) {
            technician.setAddress(request.getAddress());
        }
        if (request.getCity() != null) {
            technician.setCity(request.getCity());
        }
        if (request.getState() != null) {
            technician.setState(request.getState());
        }
        if (request.getZipCode() != null) {
            technician.setZipCode(request.getZipCode());
        }
        if (request.getStatus() != null) {
            technician.setStatus(request.getStatus());
        }
        if (request.getSkills() != null) {
            technician.setSkills(request.getSkills());
        }
        if (request.getCertifications() != null) {
            technician.setCertifications(request.getCertifications());
        }
        if (request.getNotes() != null) {
            technician.setNotes(request.getNotes());
        }
    }
}
