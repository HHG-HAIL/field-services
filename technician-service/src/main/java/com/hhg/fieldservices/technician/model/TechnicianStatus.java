package com.hhg.fieldservices.technician.model;

/**
 * Enumeration representing the availability status of a technician.
 * 
 * @author Field Services Team
 * @version 1.0
 */
public enum TechnicianStatus {
    /**
     * Technician is available and can be assigned work
     */
    AVAILABLE,
    
    /**
     * Technician is currently on a job
     */
    ON_JOB,
    
    /**
     * Technician is on break
     */
    ON_BREAK,
    
    /**
     * Technician is off duty (end of work day or day off)
     */
    OFF_DUTY,
    
    /**
     * Technician is on vacation or extended leave
     */
    ON_LEAVE,
    
    /**
     * Technician account is inactive
     */
    INACTIVE
}
