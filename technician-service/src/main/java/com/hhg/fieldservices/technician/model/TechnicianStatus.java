package com.hhg.fieldservices.technician.model;

/**
 * Enumeration of possible technician statuses.
 * 
 * @author Field Services Team
 * @version 1.0
 */
public enum TechnicianStatus {
    /**
     * Technician is active and available for work
     */
    ACTIVE,
    
    /**
     * Technician is inactive and not available
     */
    INACTIVE,
    
    /**
     * Technician is on leave
     */
    ON_LEAVE,
    
    /**
     * Technician is suspended
     */
    SUSPENDED
}
