package com.finance.finance.config;

import javax.sql.DataSource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DatabaseExtensionConfig {

    private final DataSource dataSource;

    @EventListener(ApplicationReadyEvent.class)
    public void enableUnaccent() {
        try (var conn = dataSource.getConnection();
             var stmt = conn.createStatement()) {
            stmt.execute("CREATE EXTENSION IF NOT EXISTS unaccent");
            log.info("PostgreSQL extension 'unaccent' enabled");
        } catch (Exception e) {
            log.warn("Could not enable 'unaccent' extension: {}", e.getMessage());
        }
    }
}
