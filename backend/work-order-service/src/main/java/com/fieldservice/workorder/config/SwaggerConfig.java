package com.fieldservice.workorder.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI workOrderServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Work Order Service API")
                        .description("Field Service Management System - Work Order Service\n\n" +
                                "This service manages work orders, including creation, assignment, status tracking, and real-time updates. " +
                                "It provides comprehensive CRUD operations and specialized endpoints for technician assignment and status management.")
                        .version("v1.0")
                        .contact(new Contact()
                                .name("Field Service Team")
                                .email("support@fieldservice.com")
                                .url("https://fieldservice.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8081")
                                .description("Development server")
                ))
                .tags(List.of(
                        new Tag()
                                .name("Work Orders")
                                .description("Work order management operations"),
                        new Tag()
                                .name("Assignment")
                                .description("Technician assignment operations"),
                        new Tag()
                                .name("Status Management")
                                .description("Work order status tracking operations"),
                        new Tag()
                                .name("Analytics")
                                .description("Work order analytics and reporting")
                ));
    }
}