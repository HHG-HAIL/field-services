package com.hhg.fieldservices.workorder.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI/Swagger configuration for Work Order Service.
 * Provides API documentation UI at /swagger-ui.html
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI workOrderServiceOpenAPI() {
        Server localServer = new Server()
                .url("http://localhost:8084")
                .description("Local development server");

        Contact contact = new Contact()
                .name("Field Services Team")
                .email("team@fieldservices.com");

        License license = new License()
                .name("MIT License")
                .url("https://opensource.org/licenses/MIT");

        Info info = new Info()
                .title("Work Order Service API")
                .version("1.0.0")
                .description("RESTful API for managing field service work orders. " +
                        "Provides endpoints for creating, updating, viewing, and deleting work orders.")
                .contact(contact)
                .license(license);

        return new OpenAPI()
                .info(info)
                .servers(List.of(localServer));
    }
}
