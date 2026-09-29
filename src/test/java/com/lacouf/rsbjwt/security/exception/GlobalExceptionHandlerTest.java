package com.lacouf.rsbjwt.security.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.access.AccessDeniedException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler exceptionHandler = new GlobalExceptionHandler();

    @Test
    void handleAccessDeniedException_returnsForbiddenErrorResponse() {
        HttpServletRequest request = new MockHttpServletRequest("GET", "/user/gestionnaire/demo");

        ResponseEntity<ApiErrorResponse> response = exceptionHandler.handleAccessDeniedException(
                new AccessDeniedException("Access denied"),
                request
        );

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(403, response.getBody().getStatus());
        assertEquals("Access denied", response.getBody().getMessage());
        assertEquals("/user/gestionnaire/demo", response.getBody().getPath());
    }
}
