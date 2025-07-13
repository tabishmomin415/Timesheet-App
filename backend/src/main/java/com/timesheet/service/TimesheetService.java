package com.timesheet.service;

import com.timesheet.dto.TimesheetDTO;
import com.timesheet.dto.TimesheetRequest;
import com.timesheet.model.Employee;
import com.timesheet.model.Project;
import com.timesheet.model.Timesheet;
import com.timesheet.repository.EmployeeRepository;
import com.timesheet.repository.ProjectRepository;
import com.timesheet.repository.TimesheetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TimesheetService {

    @Autowired
    private TimesheetRepository timesheetRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public TimesheetDTO createTimesheet(Long employeeId, TimesheetRequest request) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Timesheet timesheet = new Timesheet();
        timesheet.setEmployee(employee);
        timesheet.setProject(project);
        timesheet.setDate(request.getDate());
        timesheet.setHours(request.getHours());
        timesheet.setDescription(request.getDescription());

        Timesheet saved = timesheetRepository.save(timesheet);
        return convertToDTO(saved);
    }

    public List<TimesheetDTO> getTimesheetsByDateRange(Long employeeId, LocalDate startDate, LocalDate endDate) {
        List<Timesheet> timesheets = timesheetRepository.findByEmployeeIdAndDateBetween(employeeId, startDate, endDate);
        return timesheets.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private TimesheetDTO convertToDTO(Timesheet timesheet) {
        return new TimesheetDTO(
                timesheet.getId(),
                timesheet.getEmployee().getId(),
                timesheet.getProject().getId(),
                timesheet.getProject().getName(),
                timesheet.getDate(),
                timesheet.getHours(),
                timesheet.getDescription()
        );
    }
}

