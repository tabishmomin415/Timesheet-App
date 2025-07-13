package com.timesheet.service;

import com.timesheet.dto.EmployeeDTO;
import com.timesheet.dto.LoginRequest;
import com.timesheet.dto.RegisterRequest;
import com.timesheet.model.Employee;
import com.timesheet.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public EmployeeDTO register(RegisterRequest request) {
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Employee employee = new Employee();
        employee.setEmail(request.getEmail());
        employee.setPassword(passwordEncoder.encode(request.getPassword()));
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setDepartment(request.getDepartment());

        Employee saved = employeeRepository.save(employee);
        return convertToDTO(saved);
    }

    public EmployeeDTO login(LoginRequest request) {
        Employee employee = employeeRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), employee.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return convertToDTO(employee);
    }

    private EmployeeDTO convertToDTO(Employee employee) {
        return new EmployeeDTO(
                employee.getId(),
                employee.getEmail(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getDepartment()
        );
    }
}
