package com.timesheet.dto;

import com.timesheet.entity.Timesheet;
import java.math.BigDecimal;
import java.time.LocalDate;

public class TimesheetResponse {
    private Long id;
    private String projectName;
    private String userName;
    private LocalDate date;
    private BigDecimal hours;
    private String description;

    public static TimesheetResponse fromEntity(Timesheet timesheet) {
        TimesheetResponse response = new TimesheetResponse();
        response.setId(timesheet.getId());
        response.setProjectName(timesheet.getProject().getName());
        response.setUserName(timesheet.getUser().getFirstName() + " " + timesheet.getUser().getLastName());
        response.setDate(timesheet.getDate());
        response.setHours(timesheet.getHours());
        response.setDescription(timesheet.getDescription());
        return response;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public BigDecimal getHours() { return hours; }
    public void setHours(BigDecimal hours) { this.hours = hours; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}