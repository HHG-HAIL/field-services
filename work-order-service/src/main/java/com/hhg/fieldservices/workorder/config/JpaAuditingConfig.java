package com.hhg.fieldservices.workorder.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Configuration for JPA auditing.
 * Enables automatic population of @CreatedDate and @LastModifiedDate fields.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig {
}
