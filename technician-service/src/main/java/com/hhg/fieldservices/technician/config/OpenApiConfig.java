package com.hhg.fieldservices.technician.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI configuration for the Technician Service.
 * Configures Swagger/OpenAPI documentation for the REST API.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI technicianServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Technician Service API")
                        .description("""
                                REST API for managing field service technicians.
                                
                                ## REST Standards
                                This API follows RESTful best practices:
                                - Resource-based URLs (/api/v1/technicians)
                                - Standard HTTP methods (GET, POST, PUT, DELETE)
                                - Proper HTTP status codes
                                - JSON request/response bodies
                                
                                ## Error Handling
                                The API uses standard HTTP status codes and provides detailed error responses:
                                - 200 OK - Successful GET/PUT request
                                - 201 Created - Successful POST request
                                - 204 No Content - Successful DELETE request
                                - 400 Bad Request - Invalid request data or validation errors
                                - 404 Not Found - Resource not found
                                - 409 Conflict - Duplicate resource (e.g., employee ID or email already exists)
                                - 500 Internal Server Error - Unexpected server error
                                
                                ## Error Response Format
                                Error responses include:
                                - status: HTTP status code
                                - message: Brief error description
                                - details: Detailed error information
                                - timestamp: When the error occurred
                                - path: Request path that caused the error
                                
                                For validation errors (400), a map of field-specific errors is also included.
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Field Services Team")
                                .email("support@hhg-fieldservices.com")))
                .servers(List.of(
                        new Server().url("http://localhost:8085").description("Local development server")
                ));
    }
}
