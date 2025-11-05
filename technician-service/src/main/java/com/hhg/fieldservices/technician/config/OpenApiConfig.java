package com.hhg.fieldservices.technician.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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
                        .description("REST API for managing field service technicians")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Field Services Team")
                                .email("support@hhg-fieldservices.com")));
    }
}
