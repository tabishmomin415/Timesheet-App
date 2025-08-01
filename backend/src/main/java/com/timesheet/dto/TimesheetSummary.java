package com.timesheet.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class TimesheetSummary {
    private String period;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalHours;
    private List<TimesheetResponse> timesheets;

    public TimesheetSummary(String period, LocalDate startDate, LocalDate endDate,
                            BigDecimal totalHours, List<TimesheetResponse> timesheets) {
        this.period = period;
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalHours = totalHours;
        this.timesheets = timesheets;
    }

    // Getters and Setters
    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public BigDecimal getTotalHours() { return totalHours; }
    public void setTotalHours(BigDecimal totalHours) { this.totalHours = totalHours; }

    public List<TimesheetResponse> getTimesheets() { return timesheets; }
    public void setTimesheets(List<TimesheetResponse> timesheets) { this.timesheets = timesheets; }
}