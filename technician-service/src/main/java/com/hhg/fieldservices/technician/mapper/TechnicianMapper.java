package com.hhg.fieldservices.technician.mapper;

import com.hhg.fieldservices.technician.dto.CreateTechnicianRequest;
import com.hhg.fieldservices.technician.dto.TechnicianDto;
import com.hhg.fieldservices.technician.dto.UpdateTechnicianRequest;
import com.hhg.fieldservices.technician.model.Technician;
import org.mapstruct.*;

import java.util.List;

/**
 * MapStruct mapper for Technician entity and DTOs.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TechnicianMapper {
    
    /**
     * Convert entity to DTO
     */
    TechnicianDto toDto(Technician technician);
    
    /**
     * Convert list of entities to list of DTOs
     */
    List<TechnicianDto> toDtoList(List<Technician> technicians);
    
    /**
     * Convert create request to entity
     */
    Technician toEntity(CreateTechnicianRequest request);
    
    /**
     * Update entity from update request
     * Only updates non-null fields
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateTechnicianRequest request, @MappingTarget Technician technician);
}
