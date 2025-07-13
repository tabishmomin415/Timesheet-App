package com.timesheet.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimesheetDTO {
    private Long id;
    private Long employeeId;
    private Long projectId;
    private String projectName;
    private LocalDate date;
    private Double hours;
    private String description;
}