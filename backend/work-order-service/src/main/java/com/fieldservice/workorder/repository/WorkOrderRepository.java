package com.fieldservice.workorder.repository;

import com.fieldservice.workorder.entity.WorkOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {
    
    List<WorkOrder> findByStatus(WorkOrder.Status status);
    
    List<WorkOrder> findByAssignedTechnicianId(Long technicianId);
    
    List<WorkOrder> findByPriority(WorkOrder.Priority priority);
    
    @Query("SELECT w FROM WorkOrder w WHERE w.scheduledDate BETWEEN :start AND :end")
    List<WorkOrder> findByScheduledDateBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT w FROM WorkOrder w WHERE w.assignedTechnicianId = :technicianId AND w.scheduledDate BETWEEN :start AND :end")
    List<WorkOrder> findByTechnicianAndDateRange(@Param("technicianId") Long technicianId, 
                                                @Param("start") LocalDateTime start, 
                                                @Param("end") LocalDateTime end);
    
    @Query("SELECT w FROM WorkOrder w WHERE w.customerName LIKE %:customerName% OR w.customerEmail LIKE %:customerEmail%")
    List<WorkOrder> findByCustomer(@Param("customerName") String customerName, @Param("customerEmail") String customerEmail);
    
    long countByStatus(WorkOrder.Status status);
    
    long countByAssignedTechnicianId(Long technicianId);
}