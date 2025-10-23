package com.hhg.fieldservices.workorder.repository;

import com.hhg.fieldservices.workorder.model.WorkOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for WorkOrderItem entity.
 * Provides data access methods for work order items.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Repository
public interface WorkOrderItemRepository extends JpaRepository<WorkOrderItem, Long> {
    
    /**
     * Find all items for a specific work order
     */
    List<WorkOrderItem> findByWorkOrderId(Long workOrderId);
    
    /**
     * Find items by item type
     */
    List<WorkOrderItem> findByItemType(String itemType);
}
