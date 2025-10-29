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
 * OpenAPI/Swagger configuration for the Work Order Service.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI workOrderServiceOpenAPI() {
        Server devServer = new Server();
        devServer.setUrl("http://localhost:8084");
        devServer.setDescription("Development server");

        Contact contact = new Contact();
        contact.setEmail("team@fieldservices.com");
        contact.setName("Field Services Team");
        contact.setUrl("https://github.com/HHG-HAIL/field-services");

        License license = new License()
            .name("MIT License")
            .url("https://choosealicense.com/licenses/mit/");

        Info info = new Info()
            .title("Work Order Service API")
            .version("1.0.0")
            .contact(contact)
            .description("RESTful API for managing field service work orders. " +
                        "This service provides comprehensive work order management capabilities " +
                        "including creation, updates, assignments, and tracking.")
            .termsOfService("https://fieldservices.com/terms")
            .license(license);

        return new OpenAPI()
            .info(info)
            .servers(List.of(devServer));
    }
}