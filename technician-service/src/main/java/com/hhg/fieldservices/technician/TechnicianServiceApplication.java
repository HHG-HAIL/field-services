package com.hhg.fieldservices.technician;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main application class for the Technician Service.
 * This microservice manages field service technicians.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@SpringBootApplication
@EnableJpaAuditing
public class TechnicianServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(TechnicianServiceApplication.class, args);
    }
}
