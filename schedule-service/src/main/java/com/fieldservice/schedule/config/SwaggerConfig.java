package com.fieldservice.schedule.config;

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
    public OpenAPI scheduleServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Schedule Service API")
                        .description("Field Service Management System - Schedule Service\n\n" +
                                "This service manages scheduling operations, including calendar management, conflict detection, " +
                                "time slot optimization, and schedule coordination between work orders and technicians.")
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
                                .url("http://localhost:8083")
                                .description("Development server")
                ))
                .tags(List.of(
                        new Tag()
                                .name("Schedules")
                                .description("Schedule management operations"),
                        new Tag()
                                .name("Calendar")
                                .description("Calendar view and time slot operations"),
                        new Tag()
                                .name("Conflicts")
                                .description("Schedule conflict detection and resolution"),
                        new Tag()
                                .name("Optimization")
                                .description("Schedule optimization and efficiency operations")
                ));
    }
}