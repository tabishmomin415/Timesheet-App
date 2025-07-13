package com.timesheet.controller;

import com.timesheet.dto.EmployeeDTO;
import com.timesheet.dto.LoginRequest;
import com.timesheet.dto.RegisterRequest;
import com.timesheet.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @PostMapping("/register")
    public ResponseEntity<EmployeeDTO> register(@RequestBody RegisterRequest request) {
        try {
            EmployeeDTO employee = employeeService.register(request);
            return ResponseEntity.ok(employee);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<EmployeeDTO> login(@RequestBody LoginRequest request) {
        try {
            EmployeeDTO employee = employeeService.login(request);
            return ResponseEntity.ok(employee);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
