package com.hhg.fieldservices.technician.exception;

import com.hhg.fieldservices.technician.dto.ErrorResponse;
import com.hhg.fieldservices.technician.dto.ValidationErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

/**
 * Unit tests for GlobalExceptionHandler.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@ExtendWith(MockitoExtension.class)
class GlobalExceptionHandlerTest {

    @Mock
    private HttpServletRequest request;

    @Mock
    private BindingResult bindingResult;

    @InjectMocks
    private GlobalExceptionHandler exceptionHandler;

    @BeforeEach
    void setUp() {
        when(request.getRequestURI()).thenReturn("/api/v1/technicians");
    }

    @Test
    void handleResourceNotFoundException_ReturnsNotFound() {
        // Given
        ResourceNotFoundException exception = new ResourceNotFoundException("Technician not found");

        // When
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleResourceNotFoundException(exception, request);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(404);
        assertThat(response.getBody().getMessage()).isEqualTo("Resource Not Found");
        assertThat(response.getBody().getDetails()).isEqualTo("Technician not found");
        assertThat(response.getBody().getPath()).isEqualTo("/api/v1/technicians");
    }

    @Test
    void handleDuplicateResourceException_ReturnsConflict() {
        // Given
        DuplicateResourceException exception = new DuplicateResourceException("Employee ID already exists");

        // When
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleDuplicateResourceException(exception, request);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(409);
        assertThat(response.getBody().getMessage()).isEqualTo("Duplicate Resource");
        assertThat(response.getBody().getDetails()).isEqualTo("Employee ID already exists");
    }

    @Test
    void handleInvalidRequestException_ReturnsBadRequest() {
        // Given
        InvalidRequestException exception = new InvalidRequestException("Invalid data");

        // When
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleInvalidRequestException(exception, request);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(400);
        assertThat(response.getBody().getMessage()).isEqualTo("Invalid Request");
    }

    @Test
    void handleValidationException_ReturnsValidationErrors() {
        // Given
        FieldError fieldError1 = new FieldError("createTechnicianRequest", "firstName", "First name is required");
        FieldError fieldError2 = new FieldError("createTechnicianRequest", "email", "Email must be valid");
        
        when(bindingResult.getFieldErrors()).thenReturn(List.of(fieldError1, fieldError2));
        
        // Create a real MethodParameter using a test method
        java.lang.reflect.Method testMethod;
        try {
            testMethod = this.getClass().getMethod("dummyValidationMethod", String.class);
        } catch (NoSuchMethodException e) {
            throw new RuntimeException(e);
        }
        org.springframework.core.MethodParameter methodParameter = new org.springframework.core.MethodParameter(testMethod, 0);
        MethodArgumentNotValidException exception = new MethodArgumentNotValidException(methodParameter, bindingResult);

        // When
        ResponseEntity<ValidationErrorResponse> response = exceptionHandler.handleValidationException(exception, request);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(400);
        assertThat(response.getBody().getMessage()).isEqualTo("Validation Failed");
        assertThat(response.getBody().getErrors()).hasSize(2);
        assertThat(response.getBody().getErrors().get("firstName")).contains("First name is required");
        assertThat(response.getBody().getErrors().get("email")).contains("Email must be valid");
    }
    
    // Dummy method for MethodParameter creation
    public void dummyValidationMethod(String param) {
    }

    @Test
    void handleTypeMismatchException_ReturnsBadRequest() {
        // Given
        MethodArgumentTypeMismatchException exception = new MethodArgumentTypeMismatchException(
                "invalid", Long.class, "id", null, null);

        // When
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleTypeMismatchException(exception, request);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(400);
        assertThat(response.getBody().getMessage()).isEqualTo("Invalid Parameter Type");
        assertThat(response.getBody().getDetails()).contains("invalid");
        assertThat(response.getBody().getDetails()).contains("Long");
    }

    @Test
    void handleGenericException_ReturnsInternalServerError() {
        // Given
        Exception exception = new RuntimeException("Unexpected error");

        // When
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleGenericException(exception, request);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(500);
        assertThat(response.getBody().getMessage()).isEqualTo("Internal Server Error");
        assertThat(response.getBody().getDetails()).isEqualTo("An unexpected error occurred. Please try again later.");
    }
}
