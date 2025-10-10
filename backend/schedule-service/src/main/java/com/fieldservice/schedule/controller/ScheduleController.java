package com.fieldservice.schedule.controller;

import com.fieldservice.schedule.entity.ScheduleEntry;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    @GetMapping
    public ResponseEntity<List<ScheduleEntry>> getAllSchedules() {
        // For now, return empty list - will be implemented with proper service
        List<ScheduleEntry> schedules = new ArrayList<>();
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/technician/{technicianId}")
    public ResponseEntity<List<ScheduleEntry>> getSchedulesByTechnician(@PathVariable Long technicianId) {
        // For now, return empty list - will be implemented with proper service
        List<ScheduleEntry> schedules = new ArrayList<>();
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<ScheduleEntry>> getSchedulesByDateRange(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        // For now, return empty list - will be implemented with proper service
        List<ScheduleEntry> schedules = new ArrayList<>();
        return ResponseEntity.ok(schedules);
    }

    @PostMapping
    public ResponseEntity<ScheduleEntry> createScheduleEntry(@RequestBody ScheduleEntry scheduleEntry) {
        // For now, return the same entry - will be implemented with proper service
        return ResponseEntity.ok(scheduleEntry);
    }
}