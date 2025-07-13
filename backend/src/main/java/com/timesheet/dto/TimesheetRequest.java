package com.timesheet.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class TimesheetRequest {
    private Long projectId;
    private LocalDate date;
    private Double hours;
    private String description;
}