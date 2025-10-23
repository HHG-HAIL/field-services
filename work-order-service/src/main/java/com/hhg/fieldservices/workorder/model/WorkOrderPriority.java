package com.hhg.fieldservices.workorder.model;

/**
 * Enumeration for work order priority levels.
 * 
 * @author Field Services Team
 * @version 1.0
 */
public enum WorkOrderPriority {
    /**
     * Low priority - can be scheduled at convenience
     */
    LOW,
    
    /**
     * Normal priority - standard scheduling
     */
    NORMAL,
    
    /**
     * High priority - should be scheduled soon
     */
    HIGH,
    
    /**
     * Critical priority - requires immediate attention
     */
    CRITICAL,
    
    /**
     * Emergency - highest priority requiring immediate response
     */
    EMERGENCY
}
