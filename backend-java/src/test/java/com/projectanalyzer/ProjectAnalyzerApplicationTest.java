package com.projectanalyzer;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

/**
 * Smoke test — verifies that the Spring application context loads successfully.
 */
@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
class ProjectAnalyzerApplicationTest {

    @Test
    void contextLoads() {
        // If the context fails to start, this test will fail
    }
}
