package com.hhg.fieldservices.technician;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application class for the Technician Service.
 * This microservice manages field service technicians.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@SpringBootApplication
public class TechnicianServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(TechnicianServiceApplication.class, args);
    }
}
