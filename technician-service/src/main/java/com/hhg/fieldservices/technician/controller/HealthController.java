package com.hhg.fieldservices.technician.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Health check controller for the Technician Service.
 * Provides a simple endpoint to verify the service is running.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@RestController
@RequestMapping("/api/v1")
@Slf4j
public class HealthController {

    /**
     * Basic health check endpoint.
     * 
     * @return ResponseEntity with service status
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        log.debug("Health check endpoint called");
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "technician-service");
        return ResponseEntity.ok(response);
    }
}
