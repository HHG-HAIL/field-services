package com.hhg.fieldservices.workorder.repository;

import com.hhg.fieldservices.workorder.model.WorkOrder;
import com.hhg.fieldservices.workorder.model.WorkOrderStatus;
import com.hhg.fieldservices.workorder.model.WorkOrderPriority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for WorkOrder entity.
 * Provides data access methods for work orders.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Repository
public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {
    
    /**
     * Find a work order by its unique work order number
     */
    Optional<WorkOrder> findByWorkOrderNumber(String workOrderNumber);
    
    /**
     * Find work orders by status
     */
    List<WorkOrder> findByStatus(WorkOrderStatus status);
    
    /**
     * Find work orders by priority
     */
    List<WorkOrder> findByPriority(WorkOrderPriority priority);
    
    /**
     * Find work orders by customer ID
     */
    List<WorkOrder> findByCustomerId(Long customerId);
    
    /**
     * Find work orders assigned to a specific technician
     */
    List<WorkOrder> findByAssignedTechnicianId(Long technicianId);
    
    /**
     * Find work orders scheduled between two dates
     */
    List<WorkOrder> findByScheduledDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Find work orders by status and priority
     */
    List<WorkOrder> findByStatusAndPriority(WorkOrderStatus status, WorkOrderPriority priority);
    
    /**
     * Count work orders by status
     */
    long countByStatus(WorkOrderStatus status);
    
    /**
     * Find work orders created after a specific date
     */
    List<WorkOrder> findByCreatedAtAfter(LocalDateTime date);
    
    /**
     * Find overdue work orders (scheduled date in the past but not completed)
     */
    @Query("SELECT w FROM WorkOrder w WHERE w.scheduledDate < :currentDate AND w.status NOT IN ('COMPLETED', 'CANCELLED')")
    List<WorkOrder> findOverdueWorkOrders(@Param("currentDate") LocalDateTime currentDate);
    
    /**
     * Find work orders by customer ID and status
     */
    List<WorkOrder> findByCustomerIdAndStatus(Long customerId, WorkOrderStatus status);
}
