package com.hhg.fieldservices.workorder.model;

/**
 * Enumeration for work order status lifecycle.
 * 
 * @author Field Services Team
 * @version 1.0
 */
public enum WorkOrderStatus {
    /**
     * Work order has been created but not yet assigned
     */
    PENDING,
    
    /**
     * Work order has been assigned to a technician
     */
    ASSIGNED,
    
    /**
     * Work order is currently being worked on
     */
    IN_PROGRESS,
    
    /**
     * Work order has been paused or put on hold
     */
    ON_HOLD,
    
    /**
     * Work order has been completed successfully
     */
    COMPLETED,
    
    /**
     * Work order has been cancelled
     */
    CANCELLED
}
