package com.timesheet.controller;

import com.timesheet.dto.TimesheetDTO;
import com.timesheet.dto.TimesheetRequest;
import com.timesheet.service.TimesheetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/timesheets")
public class TimesheetController {

    @Autowired
    private TimesheetService timesheetService;

    @PostMapping("/{employeeId}")
    public ResponseEntity<TimesheetDTO> createTimesheet(
            @PathVariable Long employeeId,
            @RequestBody TimesheetRequest request) {
        TimesheetDTO timesheet = timesheetService.createTimesheet(employeeId, request);
        return ResponseEntity.ok(timesheet);
    }

    @GetMapping("/{employeeId}")
    public ResponseEntity<List<TimesheetDTO>> getTimesheets(
            @PathVariable Long employeeId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        List<TimesheetDTO> timesheets = timesheetService.getTimesheetsByDateRange(employeeId, start, end);
        return ResponseEntity.ok(timesheets);
    }
}