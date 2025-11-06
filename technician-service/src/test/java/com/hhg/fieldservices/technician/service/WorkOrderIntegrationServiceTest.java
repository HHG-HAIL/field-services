package com.hhg.fieldservices.technician.service;

import com.hhg.fieldservices.technician.dto.WorkOrderSummaryDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for WorkOrderIntegrationService.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@ExtendWith(MockitoExtension.class)
class WorkOrderIntegrationServiceTest {
    
    @Mock
    private RestTemplate restTemplate;
    
    private WorkOrderIntegrationService workOrderIntegrationService;
    
    private static final String WORK_ORDER_SERVICE_URL = "http://localhost:8084";
    
    @BeforeEach
    void setUp() {
        workOrderIntegrationService = new WorkOrderIntegrationService(
            restTemplate,
            WORK_ORDER_SERVICE_URL
        );
    }
    
    @Test
    void givenValidTechnicianId_whenGetWorkOrders_thenReturnWorkOrdersList() {
        // Given
        Long technicianId = 1L;
        List<WorkOrderSummaryDto> expectedWorkOrders = List.of(
            WorkOrderSummaryDto.builder()
                .id(1L)
                .workOrderNumber("WO-20251106123456")
                .title("HVAC Repair")
                .status("ASSIGNED")
                .priority("HIGH")
                .build(),
            WorkOrderSummaryDto.builder()
                .id(2L)
                .workOrderNumber("WO-20251106123457")
                .title("Plumbing Fix")
                .status("IN_PROGRESS")
                .priority("NORMAL")
                .build()
        );
        
        ResponseEntity<List<WorkOrderSummaryDto>> response = 
            new ResponseEntity<>(expectedWorkOrders, HttpStatus.OK);
        
        when(restTemplate.exchange(
            anyString(),
            eq(HttpMethod.GET),
            isNull(),
            any(ParameterizedTypeReference.class)
        )).thenReturn(response);
        
        // When
        List<WorkOrderSummaryDto> result = workOrderIntegrationService.getWorkOrdersForTechnician(technicianId);
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getTitle()).isEqualTo("HVAC Repair");
        assertThat(result.get(1).getTitle()).isEqualTo("Plumbing Fix");
        
        verify(restTemplate).exchange(
            eq(WORK_ORDER_SERVICE_URL + "/api/v1/work-orders/technician/" + technicianId),
            eq(HttpMethod.GET),
            isNull(),
            any(ParameterizedTypeReference.class)
        );
    }
    
    @Test
    void givenTechnicianWithNoWorkOrders_whenGetWorkOrders_thenReturnEmptyList() {
        // Given
        Long technicianId = 1L;
        ResponseEntity<List<WorkOrderSummaryDto>> response = 
            new ResponseEntity<>(Collections.emptyList(), HttpStatus.OK);
        
        when(restTemplate.exchange(
            anyString(),
            eq(HttpMethod.GET),
            isNull(),
            any(ParameterizedTypeReference.class)
        )).thenReturn(response);
        
        // When
        List<WorkOrderSummaryDto> result = workOrderIntegrationService.getWorkOrdersForTechnician(technicianId);
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result).isEmpty();
    }
    
    @Test
    void givenRestClientException_whenGetWorkOrders_thenReturnEmptyList() {
        // Given
        Long technicianId = 1L;
        
        when(restTemplate.exchange(
            anyString(),
            eq(HttpMethod.GET),
            isNull(),
            any(ParameterizedTypeReference.class)
        )).thenThrow(new RestClientException("Connection refused"));
        
        // When
        List<WorkOrderSummaryDto> result = workOrderIntegrationService.getWorkOrdersForTechnician(technicianId);
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result).isEmpty();
    }
    
    @Test
    void givenNullResponseBody_whenGetWorkOrders_thenReturnEmptyList() {
        // Given
        Long technicianId = 1L;
        ResponseEntity<List<WorkOrderSummaryDto>> response = 
            new ResponseEntity<>(null, HttpStatus.OK);
        
        when(restTemplate.exchange(
            anyString(),
            eq(HttpMethod.GET),
            isNull(),
            any(ParameterizedTypeReference.class)
        )).thenReturn(response);
        
        // When
        List<WorkOrderSummaryDto> result = workOrderIntegrationService.getWorkOrdersForTechnician(technicianId);
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result).isEmpty();
    }
}
