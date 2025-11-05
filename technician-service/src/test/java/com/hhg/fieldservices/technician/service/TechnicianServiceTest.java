package com.hhg.fieldservices.technician.service;

import com.hhg.fieldservices.technician.dto.CreateTechnicianRequest;
import com.hhg.fieldservices.technician.dto.TechnicianDto;
import com.hhg.fieldservices.technician.dto.UpdateTechnicianRequest;
import com.hhg.fieldservices.technician.exception.TechnicianNotFoundException;
import com.hhg.fieldservices.technician.exception.TechnicianValidationException;
import com.hhg.fieldservices.technician.mapper.TechnicianMapper;
import com.hhg.fieldservices.technician.model.Technician;
import com.hhg.fieldservices.technician.model.TechnicianSkillLevel;
import com.hhg.fieldservices.technician.model.TechnicianStatus;
import com.hhg.fieldservices.technician.repository.TechnicianRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for TechnicianService.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@ExtendWith(MockitoExtension.class)
class TechnicianServiceTest {
    
    @Mock
    private TechnicianRepository technicianRepository;
    
    @Mock
    private TechnicianMapper technicianMapper;
    
    @InjectMocks
    private TechnicianService technicianService;
    
    private Technician testTechnician;
    private TechnicianDto testTechnicianDto;
    private CreateTechnicianRequest createRequest;
    
    @BeforeEach
    void setUp() {
        testTechnician = Technician.builder()
            .id(1L)
            .employeeId("EMP-001")
            .firstName("John")
            .lastName("Smith")
            .email("john.smith@example.com")
            .phone("555-0100")
            .status(TechnicianStatus.ACTIVE)
            .skillLevel(TechnicianSkillLevel.SENIOR)
            .skills(Set.of("HVAC", "Plumbing"))
            .build();
        
        testTechnicianDto = TechnicianDto.builder()
            .id(1L)
            .employeeId("EMP-001")
            .firstName("John")
            .lastName("Smith")
            .email("john.smith@example.com")
            .phone("555-0100")
            .status(TechnicianStatus.ACTIVE)
            .skillLevel(TechnicianSkillLevel.SENIOR)
            .skills(Set.of("HVAC", "Plumbing"))
            .build();
        
        createRequest = CreateTechnicianRequest.builder()
            .employeeId("EMP-002")
            .firstName("Jane")
            .lastName("Doe")
            .email("jane.doe@example.com")
            .phone("555-0200")
            .status(TechnicianStatus.ACTIVE)
            .skillLevel(TechnicianSkillLevel.INTERMEDIATE)
            .build();
    }
    
    @Test
    void whenFindAll_thenReturnAllTechnicians() {
        // Given
        when(technicianRepository.findAll()).thenReturn(List.of(testTechnician));
        when(technicianMapper.toDtoList(anyList())).thenReturn(List.of(testTechnicianDto));
        
        // When
        List<TechnicianDto> result = technicianService.findAll();
        
        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getEmployeeId()).isEqualTo("EMP-001");
        verify(technicianRepository).findAll();
        verify(technicianMapper).toDtoList(anyList());
    }
    
    @Test
    void givenValidId_whenFindById_thenReturnTechnician() {
        // Given
        when(technicianRepository.findById(1L)).thenReturn(Optional.of(testTechnician));
        when(technicianMapper.toDto(testTechnician)).thenReturn(testTechnicianDto);
        
        // When
        TechnicianDto result = technicianService.findById(1L);
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getEmployeeId()).isEqualTo("EMP-001");
        verify(technicianRepository).findById(1L);
        verify(technicianMapper).toDto(testTechnician);
    }
    
    @Test
    void givenInvalidId_whenFindById_thenThrowException() {
        // Given
        when(technicianRepository.findById(99L)).thenReturn(Optional.empty());
        
        // When & Then
        assertThatThrownBy(() -> technicianService.findById(99L))
            .isInstanceOf(TechnicianNotFoundException.class)
            .hasMessageContaining("Technician not found with id: 99");
        
        verify(technicianRepository).findById(99L);
        verify(technicianMapper, never()).toDto(any());
    }
    
    @Test
    void givenValidEmployeeId_whenFindByEmployeeId_thenReturnTechnician() {
        // Given
        when(technicianRepository.findByEmployeeId("EMP-001"))
            .thenReturn(Optional.of(testTechnician));
        when(technicianMapper.toDto(testTechnician)).thenReturn(testTechnicianDto);
        
        // When
        TechnicianDto result = technicianService.findByEmployeeId("EMP-001");
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result.getEmployeeId()).isEqualTo("EMP-001");
        verify(technicianRepository).findByEmployeeId("EMP-001");
    }
    
    @Test
    void whenFindByStatus_thenReturnTechnicians() {
        // Given
        when(technicianRepository.findByStatus(TechnicianStatus.ACTIVE))
            .thenReturn(List.of(testTechnician));
        when(technicianMapper.toDtoList(anyList())).thenReturn(List.of(testTechnicianDto));
        
        // When
        List<TechnicianDto> result = technicianService.findByStatus(TechnicianStatus.ACTIVE);
        
        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStatus()).isEqualTo(TechnicianStatus.ACTIVE);
        verify(technicianRepository).findByStatus(TechnicianStatus.ACTIVE);
    }
    
    @Test
    void whenFindBySkillLevel_thenReturnTechnicians() {
        // Given
        when(technicianRepository.findBySkillLevel(TechnicianSkillLevel.SENIOR))
            .thenReturn(List.of(testTechnician));
        when(technicianMapper.toDtoList(anyList())).thenReturn(List.of(testTechnicianDto));
        
        // When
        List<TechnicianDto> result = technicianService.findBySkillLevel(TechnicianSkillLevel.SENIOR);
        
        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getSkillLevel()).isEqualTo(TechnicianSkillLevel.SENIOR);
        verify(technicianRepository).findBySkillLevel(TechnicianSkillLevel.SENIOR);
    }
    
    @Test
    void whenFindBySkill_thenReturnTechnicians() {
        // Given
        when(technicianRepository.findBySkill("HVAC")).thenReturn(List.of(testTechnician));
        when(technicianMapper.toDtoList(anyList())).thenReturn(List.of(testTechnicianDto));
        
        // When
        List<TechnicianDto> result = technicianService.findBySkill("HVAC");
        
        // Then
        assertThat(result).hasSize(1);
        verify(technicianRepository).findBySkill("HVAC");
    }
    
    @Test
    void givenValidRequest_whenCreate_thenReturnCreatedTechnician() {
        // Given
        Technician newTechnician = Technician.builder()
            .employeeId("EMP-002")
            .firstName("Jane")
            .lastName("Doe")
            .email("jane.doe@example.com")
            .status(TechnicianStatus.ACTIVE)
            .skillLevel(TechnicianSkillLevel.INTERMEDIATE)
            .build();
        
        Technician savedTechnician = Technician.builder()
            .id(2L)
            .employeeId("EMP-002")
            .firstName("Jane")
            .lastName("Doe")
            .email("jane.doe@example.com")
            .status(TechnicianStatus.ACTIVE)
            .skillLevel(TechnicianSkillLevel.INTERMEDIATE)
            .build();
        
        TechnicianDto createdDto = TechnicianDto.builder()
            .id(2L)
            .employeeId("EMP-002")
            .firstName("Jane")
            .lastName("Doe")
            .email("jane.doe@example.com")
            .status(TechnicianStatus.ACTIVE)
            .skillLevel(TechnicianSkillLevel.INTERMEDIATE)
            .build();
        
        when(technicianRepository.existsByEmployeeId("EMP-002")).thenReturn(false);
        when(technicianRepository.existsByEmail("jane.doe@example.com")).thenReturn(false);
        when(technicianMapper.toEntity(createRequest)).thenReturn(newTechnician);
        when(technicianRepository.save(newTechnician)).thenReturn(savedTechnician);
        when(technicianMapper.toDto(savedTechnician)).thenReturn(createdDto);
        
        // When
        TechnicianDto result = technicianService.create(createRequest);
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(2L);
        assertThat(result.getEmployeeId()).isEqualTo("EMP-002");
        verify(technicianRepository).existsByEmployeeId("EMP-002");
        verify(technicianRepository).existsByEmail("jane.doe@example.com");
        verify(technicianRepository).save(any(Technician.class));
    }
    
    @Test
    void givenDuplicateEmployeeId_whenCreate_thenThrowException() {
        // Given
        when(technicianRepository.existsByEmployeeId("EMP-002")).thenReturn(true);
        
        // When & Then
        assertThatThrownBy(() -> technicianService.create(createRequest))
            .isInstanceOf(TechnicianValidationException.class)
            .hasMessageContaining("Technician with employee ID EMP-002 already exists");
        
        verify(technicianRepository).existsByEmployeeId("EMP-002");
        verify(technicianRepository, never()).save(any());
    }
    
    @Test
    void givenDuplicateEmail_whenCreate_thenThrowException() {
        // Given
        when(technicianRepository.existsByEmployeeId("EMP-002")).thenReturn(false);
        when(technicianRepository.existsByEmail("jane.doe@example.com")).thenReturn(true);
        
        // When & Then
        assertThatThrownBy(() -> technicianService.create(createRequest))
            .isInstanceOf(TechnicianValidationException.class)
            .hasMessageContaining("Technician with email jane.doe@example.com already exists");
        
        verify(technicianRepository).existsByEmail("jane.doe@example.com");
        verify(technicianRepository, never()).save(any());
    }
    
    @Test
    void givenValidRequest_whenUpdate_thenReturnUpdatedTechnician() {
        // Given
        UpdateTechnicianRequest updateRequest = UpdateTechnicianRequest.builder()
            .status(TechnicianStatus.BUSY)
            .build();
        
        when(technicianRepository.findById(1L)).thenReturn(Optional.of(testTechnician));
        when(technicianRepository.save(testTechnician)).thenReturn(testTechnician);
        when(technicianMapper.toDto(testTechnician)).thenReturn(testTechnicianDto);
        
        // When
        TechnicianDto result = technicianService.update(1L, updateRequest);
        
        // Then
        assertThat(result).isNotNull();
        verify(technicianRepository).findById(1L);
        verify(technicianMapper).updateEntityFromDto(updateRequest, testTechnician);
        verify(technicianRepository).save(testTechnician);
    }
    
    @Test
    void givenInvalidId_whenUpdate_thenThrowException() {
        // Given
        UpdateTechnicianRequest updateRequest = UpdateTechnicianRequest.builder()
            .status(TechnicianStatus.BUSY)
            .build();
        
        when(technicianRepository.findById(99L)).thenReturn(Optional.empty());
        
        // When & Then
        assertThatThrownBy(() -> technicianService.update(99L, updateRequest))
            .isInstanceOf(TechnicianNotFoundException.class)
            .hasMessageContaining("Technician not found with id: 99");
        
        verify(technicianRepository).findById(99L);
        verify(technicianRepository, never()).save(any());
    }
    
    @Test
    void givenValidId_whenDelete_thenDeleteTechnician() {
        // Given
        when(technicianRepository.existsById(1L)).thenReturn(true);
        doNothing().when(technicianRepository).deleteById(1L);
        
        // When
        technicianService.delete(1L);
        
        // Then
        verify(technicianRepository).existsById(1L);
        verify(technicianRepository).deleteById(1L);
    }
    
    @Test
    void givenInvalidId_whenDelete_thenThrowException() {
        // Given
        when(technicianRepository.existsById(99L)).thenReturn(false);
        
        // When & Then
        assertThatThrownBy(() -> technicianService.delete(99L))
            .isInstanceOf(TechnicianNotFoundException.class)
            .hasMessageContaining("Technician not found with id: 99");
        
        verify(technicianRepository).existsById(99L);
        verify(technicianRepository, never()).deleteById(anyLong());
    }
}
