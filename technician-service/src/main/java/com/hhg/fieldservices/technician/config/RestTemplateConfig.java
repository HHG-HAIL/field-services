package com.hhg.fieldservices.technician.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

/**
 * Configuration for RestTemplate used for inter-service communication.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Configuration
public class RestTemplateConfig {
    
    /**
     * Creates a RestTemplate bean with timeout configurations.
     * 
     * @param builder RestTemplateBuilder
     * @return configured RestTemplate
     */
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
            .setConnectTimeout(Duration.ofSeconds(5))
            .setReadTimeout(Duration.ofSeconds(10))
            .build();
    }
}
