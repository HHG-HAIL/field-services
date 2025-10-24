package com.hhg.fieldservices.workorder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main application class for the Work Order Service.
 * This microservice manages field service work orders.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@SpringBootApplication
public class WorkOrderServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(WorkOrderServiceApplication.class, args);
    }
}
