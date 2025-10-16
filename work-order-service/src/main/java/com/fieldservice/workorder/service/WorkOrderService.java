package com.fieldservice.workorder.service;

import com.fieldservice.workorder.client.TechnicianClient;
import com.fieldservice.workorder.dto.WorkOrderDTO;
import com.fieldservice.workorder.entity.WorkOrder;
import com.fieldservice.workorder.repository.WorkOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class WorkOrderService {
    
    @Autowired
    private WorkOrderRepository workOrderRepository;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private TechnicianClient technicianClient;
    
    public List<WorkOrderDTO> getAllWorkOrders() {
        return workOrderRepository.findAll().stream()
                .map(workOrder -> {
                    WorkOrderDTO dto = new WorkOrderDTO(workOrder);
                    // Populate technician name if assigned
                    if (workOrder.getAssignedTechnicianId() != null) {
                        String technicianName = technicianClient.getTechnicianName(workOrder.getAssignedTechnicianId());
                        if (technicianName != null) {
                            dto.setAssignedTechnicianName(technicianName);
                        }
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }
    
    public Optional<WorkOrderDTO> getWorkOrderById(Long id) {
        return workOrderRepository.findById(id)
                .map(workOrder -> {
                    WorkOrderDTO dto = new WorkOrderDTO(workOrder);
                    // Populate technician name if assigned
                    if (workOrder.getAssignedTechnicianId() != null) {
                        String technicianName = technicianClient.getTechnicianName(workOrder.getAssignedTechnicianId());
                        if (technicianName != null) {
                            dto.setAssignedTechnicianName(technicianName);
                        }
                    }
                    return dto;
                });
    }
    
    public List<WorkOrderDTO> getWorkOrdersByStatus(WorkOrder.Status status) {
        return workOrderRepository.findByStatus(status).stream()
                .map(WorkOrderDTO::new)
                .collect(Collectors.toList());
    }
    
    public List<WorkOrderDTO> getWorkOrdersByTechnician(Long technicianId) {
        return workOrderRepository.findByAssignedTechnicianId(technicianId).stream()
                .map(WorkOrderDTO::new)
                .collect(Collectors.toList());
    }
    
    public List<WorkOrderDTO> getWorkOrdersByDateRange(LocalDateTime start, LocalDateTime end) {
        return workOrderRepository.findByScheduledDateBetween(start, end).stream()
                .map(WorkOrderDTO::new)
                .collect(Collectors.toList());
    }
    
    public WorkOrderDTO createWorkOrder(WorkOrderDTO workOrderDTO) {
        WorkOrder workOrder = workOrderDTO.toEntity();
        WorkOrder savedWorkOrder = workOrderRepository.save(workOrder);
        WorkOrderDTO result = new WorkOrderDTO(savedWorkOrder);
        
        // Send real-time notification
        messagingTemplate.convertAndSend("/topic/workorders", result);
        
        return result;
    }
    
    public Optional<WorkOrderDTO> updateWorkOrder(Long id, WorkOrderDTO workOrderDTO) {
        return workOrderRepository.findById(id)
                .map(existingWorkOrder -> {
                    // Update fields
                    existingWorkOrder.setTitle(workOrderDTO.getTitle());
                    existingWorkOrder.setDescription(workOrderDTO.getDescription());
                    existingWorkOrder.setPriority(workOrderDTO.getPriority());
                    existingWorkOrder.setStatus(workOrderDTO.getStatus());
                    existingWorkOrder.setCustomerName(workOrderDTO.getCustomerName());
                    existingWorkOrder.setCustomerPhone(workOrderDTO.getCustomerPhone());
                    existingWorkOrder.setCustomerEmail(workOrderDTO.getCustomerEmail());
                    existingWorkOrder.setLocation(workOrderDTO.getLocation());
                    existingWorkOrder.setEstimatedDuration(workOrderDTO.getEstimatedDuration());
                    existingWorkOrder.setScheduledDate(workOrderDTO.getScheduledDate());
                    
                    WorkOrder updatedWorkOrder = workOrderRepository.save(existingWorkOrder);
                    WorkOrderDTO result = new WorkOrderDTO(updatedWorkOrder);
                    
                    // Send real-time notification
                    messagingTemplate.convertAndSend("/topic/workorders/updated", result);
                    
                    return result;
                });
    }
    
    public Optional<WorkOrderDTO> assignTechnician(Long workOrderId, Long technicianId) {
        return workOrderRepository.findById(workOrderId)
                .map(workOrder -> {
                    workOrder.setAssignedTechnicianId(technicianId);
                    workOrder.setStatus(WorkOrder.Status.ASSIGNED);
                    
                    WorkOrder updatedWorkOrder = workOrderRepository.save(workOrder);
                    WorkOrderDTO result = new WorkOrderDTO(updatedWorkOrder);
                    
                    // Get technician name and set it on the DTO
                    String technicianName = technicianClient.getTechnicianName(technicianId);
                    if (technicianName != null) {
                        result.setAssignedTechnicianName(technicianName);
                    }
                    
                    // Update technician status to BUSY
                    technicianClient.updateTechnicianStatus(technicianId, "BUSY");
                    
                    // Send real-time notification
                    messagingTemplate.convertAndSend("/topic/workorders/assigned", result);
                    messagingTemplate.convertAndSend("/topic/technicians/" + technicianId + "/assignments", result);
                    
                    return result;
                });
    }
    
    public Optional<WorkOrderDTO> unassignTechnician(Long workOrderId) {
        return workOrderRepository.findById(workOrderId)
                .map(workOrder -> {
                    Long previousTechnicianId = workOrder.getAssignedTechnicianId();
                    
                    // Clear assignment and reset status to PENDING
                    workOrder.setAssignedTechnicianId(null);
                    workOrder.setStatus(WorkOrder.Status.PENDING);
                    
                    WorkOrder updatedWorkOrder = workOrderRepository.save(workOrder);
                    WorkOrderDTO result = new WorkOrderDTO(updatedWorkOrder);
                    result.setAssignedTechnicianName(null);
                    
                    // Update previous technician status to AVAILABLE if they were assigned
                    if (previousTechnicianId != null) {
                        technicianClient.updateTechnicianStatus(previousTechnicianId, "AVAILABLE");
                    }
                    
                    // Send real-time notification
                    messagingTemplate.convertAndSend("/topic/workorders/unassigned", result);
                    if (previousTechnicianId != null) {
                        messagingTemplate.convertAndSend("/topic/technicians/" + previousTechnicianId + "/unassigned", result);
                    }
                    
                    return result;
                });
    }
    
    public Optional<WorkOrderDTO> updateStatus(Long workOrderId, WorkOrder.Status status) {
        return workOrderRepository.findById(workOrderId)
                .map(workOrder -> {
                    workOrder.setStatus(status);
                    
                    WorkOrder updatedWorkOrder = workOrderRepository.save(workOrder);
                    WorkOrderDTO result = new WorkOrderDTO(updatedWorkOrder);
                    
                    // Send real-time notification
                    messagingTemplate.convertAndSend("/topic/workorders/status", result);
                    
                    return result;
                });
    }
    
    public boolean deleteWorkOrder(Long id) {
        if (workOrderRepository.existsById(id)) {
            workOrderRepository.deleteById(id);
            
            // Send real-time notification
            messagingTemplate.convertAndSend("/topic/workorders/deleted", id);
            
            return true;
        }
        return false;
    }
    
    public long getWorkOrderCountByStatus(WorkOrder.Status status) {
        return workOrderRepository.countByStatus(status);
    }
    
    public long getWorkOrderCountByTechnician(Long technicianId) {
        return workOrderRepository.countByAssignedTechnicianId(technicianId);
    }
}