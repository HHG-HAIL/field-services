package com.hhg.fieldservices.workorder.mapper;

import com.hhg.fieldservices.workorder.dto.*;
import com.hhg.fieldservices.workorder.model.WorkOrder;
import com.hhg.fieldservices.workorder.model.WorkOrderItem;
import org.mapstruct.*;

import java.util.List;

/**
 * MapStruct mapper for converting between WorkOrder entities and DTOs.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface WorkOrderMapper {
    
    /**
     * Convert WorkOrder entity to DTO
     */
    WorkOrderDto toDto(WorkOrder workOrder);
    
    /**
     * Convert list of WorkOrder entities to DTOs
     */
    List<WorkOrderDto> toDtoList(List<WorkOrder> workOrders);
    
    /**
     * Convert CreateWorkOrderRequest to WorkOrder entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "workOrderNumber", ignore = true)
    @Mapping(target = "status", constant = "PENDING")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "startedAt", ignore = true)
    @Mapping(target = "completedAt", ignore = true)
    @Mapping(target = "actualCost", ignore = true)
    WorkOrder toEntity(CreateWorkOrderRequest request);
    
    /**
     * Update existing WorkOrder entity from UpdateWorkOrderRequest
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "workOrderNumber", ignore = true)
    @Mapping(target = "customerId", ignore = true)
    @Mapping(target = "customerName", ignore = true)
    @Mapping(target = "customerPhone", ignore = true)
    @Mapping(target = "customerEmail", ignore = true)
    @Mapping(target = "serviceAddress", ignore = true)
    @Mapping(target = "city", ignore = true)
    @Mapping(target = "state", ignore = true)
    @Mapping(target = "zipCode", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "items", ignore = true)
    void updateEntityFromDto(UpdateWorkOrderRequest request, @MappingTarget WorkOrder workOrder);
    
    /**
     * Convert WorkOrderItem entity to DTO
     */
    WorkOrderItemDto toItemDto(WorkOrderItem item);
    
    /**
     * Convert CreateWorkOrderItemRequest to WorkOrderItem entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "workOrder", ignore = true)
    @Mapping(target = "totalPrice", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    WorkOrderItem toItemEntity(CreateWorkOrderItemRequest request);
}
