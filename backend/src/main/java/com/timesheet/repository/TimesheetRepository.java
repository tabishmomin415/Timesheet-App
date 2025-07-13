package com.timesheet.repository;

import com.timesheet.model.Timesheet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TimesheetRepository extends JpaRepository<Timesheet, Long> {

    List<Timesheet> findByEmployeeIdAndDateBetween(Long employeeId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT t FROM Timesheet t WHERE t.employee.id = :employeeId AND t.date BETWEEN :startDate AND :endDate")
    List<Timesheet> findTimesheetsByEmployeeAndDateRange(@Param("employeeId") Long employeeId,
                                                         @Param("startDate") LocalDate startDate,
                                                         @Param("endDate") LocalDate endDate);
}

