package com.fieldservice.workorder.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.Map;

@Service
public class TechnicianClient {
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Value("${technician.service.url:http://localhost:8082}")
    private String technicianServiceUrl;
    
    public void updateTechnicianStatus(Long technicianId, String status) {
        try {
            String url = technicianServiceUrl + "/api/technicians/" + technicianId + "/status";
            System.out.println("Attempting to update technician status: " + url + " with status: " + status);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
            
            Map<String, String> requestBody = Collections.singletonMap("status", status);
            HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);
            
            restTemplate.exchange(url, HttpMethod.PATCH, request, Void.class);
            System.out.println("Successfully updated technician status for technician: " + technicianId);
        } catch (Exception e) {
            // Log error but don't fail the assignment if technician service is unavailable
            System.err.println("Failed to update technician status for technician " + technicianId + ": " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    public String getTechnicianName(Long technicianId) {
        try {
            String url = technicianServiceUrl + "/api/technicians/" + technicianId;
            System.out.println("Attempting to get technician name: " + url);
            
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("name")) {
                String name = (String) response.get("name");
                System.out.println("Successfully retrieved technician name: " + name);
                return name;
            }
        } catch (Exception e) {
            System.err.println("Failed to get technician name for technician " + technicianId + ": " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }
}