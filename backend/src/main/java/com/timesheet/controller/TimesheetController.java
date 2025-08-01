package com.timesheet.controller;

import com.timesheet.dto.*;
import com.timesheet.entity.Project;
import com.timesheet.entity.Timesheet;
import com.timesheet.entity.User;
import com.timesheet.repository.ProjectRepository;
import com.timesheet.repository.TimesheetRepository;
import com.timesheet.repository.UserRepository;
import com.timesheet.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/timesheets")
public class TimesheetController {

    @Autowired
    private TimesheetRepository timesheetRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createTimesheet(@Valid @RequestBody TimesheetRequest request, Authentication auth) {
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Timesheet timesheet = new Timesheet();
        timesheet.setUser(user);
        timesheet.setProject(project);
        timesheet.setDate(request.getDate());
        timesheet.setHours(request.getHours());
        timesheet.setDescription(request.getDescription());

        Timesheet savedTimesheet = timesheetRepository.save(timesheet);
        return ResponseEntity.ok(TimesheetResponse.fromEntity(savedTimesheet));
    }

    @GetMapping
    public ResponseEntity<List<TimesheetResponse>> getMyTimesheets(Authentication auth) {
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Timesheet> timesheets = user.getTimesheets();
        List<TimesheetResponse> responses = timesheets.stream()
                .map(TimesheetResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/summary/week")
    public ResponseEntity<TimesheetSummary> getWeeklySummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Authentication auth) {

        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();

        WeekFields weekFields = WeekFields.of(Locale.getDefault());
        LocalDate startOfWeek = date.with(weekFields.dayOfWeek(), 1);
        LocalDate endOfWeek = startOfWeek.plusDays(6);

        List<Timesheet> timesheets = timesheetRepository.findByUserIdAndDateBetween(
                userPrincipal.getId(), startOfWeek, endOfWeek);

        return ResponseEntity.ok(createSummary(timesheets, startOfWeek, endOfWeek, "Week"));
    }

    @GetMapping("/summary/month")
    public ResponseEntity<TimesheetSummary> getMonthlySummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Authentication auth) {

        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();

        LocalDate startOfMonth = date.withDayOfMonth(1);
        LocalDate endOfMonth = date.withDayOfMonth(date.lengthOfMonth());

        List<Timesheet> timesheets = timesheetRepository.findByUserIdAndDateBetween(
                userPrincipal.getId(), startOfMonth, endOfMonth);

        return ResponseEntity.ok(createSummary(timesheets, startOfMonth, endOfMonth, "Month"));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TimesheetResponse>> getAllTimesheets(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<Timesheet> timesheets;
        if (startDate != null && endDate != null) {
            timesheets = timesheetRepository.findAllByDateBetween(startDate, endDate);
        } else {
            timesheets = timesheetRepository.findAll();
        }

        List<TimesheetResponse> responses = timesheets.stream()
                .map(TimesheetResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    private TimesheetSummary createSummary(List<Timesheet> timesheets, LocalDate startDate,
                                           LocalDate endDate, String period) {
        BigDecimal totalHours = timesheets.stream()
                .map(Timesheet::getHours)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<TimesheetResponse> timesheetResponses = timesheets.stream()
                .map(TimesheetResponse::fromEntity)
                .collect(Collectors.toList());

        return new TimesheetSummary(period, startDate, endDate, totalHours, timesheetResponses);
    }
}