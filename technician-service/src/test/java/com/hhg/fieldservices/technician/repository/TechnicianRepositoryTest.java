package com.hhg.fieldservices.technician.repository;

import com.hhg.fieldservices.technician.model.Technician;
import com.hhg.fieldservices.technician.model.TechnicianSkillLevel;
import com.hhg.fieldservices.technician.model.TechnicianStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.*;

/**
 * Repository tests for TechnicianRepository.
 * 
 * @author Field Services Team
 * @version 1.0
 */
@DataJpaTest
class TechnicianRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private TechnicianRepository technicianRepository;
    
    private Technician testTechnician1;
    private Technician testTechnician2;
    
    @BeforeEach
    void setUp() {
        testTechnician1 = Technician.builder()
            .employeeId("EMP-001")
            .firstName("John")
            .lastName("Smith")
            .email("john.smith@example.com")
            .phone("555-0100")
            .status(TechnicianStatus.ACTIVE)
            .skillLevel(TechnicianSkillLevel.SENIOR)
            .skills(Set.of("HVAC", "Plumbing"))
            .build();
        
        testTechnician2 = Technician.builder()
            .employeeId("EMP-002")
            .firstName("Jane")
            .lastName("Doe")
            .email("jane.doe@example.com")
            .phone("555-0200")
            .status(TechnicianStatus.INACTIVE)
            .skillLevel(TechnicianSkillLevel.INTERMEDIATE)
            .skills(Set.of("Electrical", "HVAC"))
            .build();
        
        entityManager.persist(testTechnician1);
        entityManager.persist(testTechnician2);
        entityManager.flush();
    }
    
    @Test
    void whenFindByEmployeeId_thenReturnTechnician() {
        // When
        Optional<Technician> found = technicianRepository.findByEmployeeId("EMP-001");
        
        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getFirstName()).isEqualTo("John");
        assertThat(found.get().getLastName()).isEqualTo("Smith");
    }
    
    @Test
    void whenFindByEmployeeIdNotExists_thenReturnEmpty() {
        // When
        Optional<Technician> found = technicianRepository.findByEmployeeId("EMP-999");
        
        // Then
        assertThat(found).isEmpty();
    }
    
    @Test
    void whenFindByEmail_thenReturnTechnician() {
        // When
        Optional<Technician> found = technicianRepository.findByEmail("john.smith@example.com");
        
        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getEmployeeId()).isEqualTo("EMP-001");
    }
    
    @Test
    void whenFindByStatus_thenReturnTechnicians() {
        // When
        List<Technician> activeTechnicians = technicianRepository.findByStatus(TechnicianStatus.ACTIVE);
        
        // Then
        assertThat(activeTechnicians).hasSize(1);
        assertThat(activeTechnicians.get(0).getStatus()).isEqualTo(TechnicianStatus.ACTIVE);
        assertThat(activeTechnicians.get(0).getEmployeeId()).isEqualTo("EMP-001");
    }
    
    @Test
    void whenFindBySkillLevel_thenReturnTechnicians() {
        // When
        List<Technician> seniorTechnicians = technicianRepository.findBySkillLevel(TechnicianSkillLevel.SENIOR);
        
        // Then
        assertThat(seniorTechnicians).hasSize(1);
        assertThat(seniorTechnicians.get(0).getSkillLevel()).isEqualTo(TechnicianSkillLevel.SENIOR);
        assertThat(seniorTechnicians.get(0).getEmployeeId()).isEqualTo("EMP-001");
    }
    
    @Test
    void whenFindByStatusAndSkillLevel_thenReturnTechnicians() {
        // When
        List<Technician> technicians = technicianRepository
            .findByStatusAndSkillLevel(TechnicianStatus.ACTIVE, TechnicianSkillLevel.SENIOR);
        
        // Then
        assertThat(technicians).hasSize(1);
        assertThat(technicians.get(0).getEmployeeId()).isEqualTo("EMP-001");
    }
    
    @Test
    void whenExistsByEmployeeId_thenReturnTrue() {
        // When
        boolean exists = technicianRepository.existsByEmployeeId("EMP-001");
        
        // Then
        assertThat(exists).isTrue();
    }
    
    @Test
    void whenExistsByEmployeeIdNotExists_thenReturnFalse() {
        // When
        boolean exists = technicianRepository.existsByEmployeeId("EMP-999");
        
        // Then
        assertThat(exists).isFalse();
    }
    
    @Test
    void whenExistsByEmail_thenReturnTrue() {
        // When
        boolean exists = technicianRepository.existsByEmail("john.smith@example.com");
        
        // Then
        assertThat(exists).isTrue();
    }
    
    @Test
    void whenFindBySkill_thenReturnTechnicians() {
        // When
        List<Technician> techniciansWithHVAC = technicianRepository.findBySkill("HVAC");
        
        // Then
        assertThat(techniciansWithHVAC).hasSize(2);
        assertThat(techniciansWithHVAC)
            .extracting(Technician::getEmployeeId)
            .containsExactlyInAnyOrder("EMP-001", "EMP-002");
    }
    
    @Test
    void whenFindBySkillNotExists_thenReturnEmpty() {
        // When
        List<Technician> techniciansWithUnknownSkill = technicianRepository.findBySkill("NonExistentSkill");
        
        // Then
        assertThat(techniciansWithUnknownSkill).isEmpty();
    }
}
