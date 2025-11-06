package com.hhg.fieldservices.technician.service;

import com.hhg.fieldservices.technician.dto.WorkOrderSummaryDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;

/**
 * Service for integrating with work-order-service.
 * Provides methods to fetch work order information for technicians.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Service
@Slf4j
public class WorkOrderIntegrationService {
    
    private final RestTemplate restTemplate;
    private final String workOrderServiceUrl;
    
    public WorkOrderIntegrationService(
            RestTemplate restTemplate,
            @Value("${integration.work-order-service.url:http://localhost:8084}") String workOrderServiceUrl) {
        this.restTemplate = restTemplate;
        this.workOrderServiceUrl = workOrderServiceUrl;
    }
    
    /**
     * Get all work orders assigned to a specific technician.
     * Fetches data from work-order-service.
     * 
     * @param technicianId the technician ID
     * @return list of work order summaries
     */
    public List<WorkOrderSummaryDto> getWorkOrdersForTechnician(Long technicianId) {
        log.debug("Fetching work orders for technician: {}", technicianId);
        
        try {
            String url = workOrderServiceUrl + "/api/v1/work-orders/technician/" + technicianId;
            
            ResponseEntity<List<WorkOrderSummaryDto>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<WorkOrderSummaryDto>>() {}
            );
            
            List<WorkOrderSummaryDto> workOrders = response.getBody();
            log.info("Retrieved {} work orders for technician {}", 
                workOrders != null ? workOrders.size() : 0, technicianId);
            
            return workOrders != null ? workOrders : Collections.emptyList();
            
        } catch (RestClientException e) {
            log.error("Error fetching work orders for technician {}: {}", technicianId, e.getMessage());
            // Return empty list instead of throwing exception to maintain service availability
            return Collections.emptyList();
        }
    }
}
