package com.fieldservice.technician.config;

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
    public OpenAPI technicianServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Technician Service API")
                        .description("Field Service Management System - Technician Service\n\n" +
                                "This service manages technician profiles, skills, availability, and location tracking. " +
                                "It provides operations for technician management, skill-based matching, and real-time status updates.")
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
                                .url("http://localhost:8082")
                                .description("Development server")
                ))
                .tags(List.of(
                        new Tag()
                                .name("Technicians")
                                .description("Technician profile management operations"),
                        new Tag()
                                .name("Availability")
                                .description("Technician availability and status operations"),
                        new Tag()
                                .name("Skills")
                                .description("Skill-based technician search and matching"),
                        new Tag()
                                .name("Location")
                                .description("Technician location tracking operations"),
                        new Tag()
                                .name("Analytics")
                                .description("Technician performance and statistics")
                ));
    }
}