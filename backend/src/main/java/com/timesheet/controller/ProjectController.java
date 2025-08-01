package com.timesheet.controller;

import com.timesheet.dto.ProjectRequest;
import com.timesheet.dto.ProjectResponse;
import com.timesheet.entity.Project;
import com.timesheet.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllProjects() {
        List<Project> projects = projectRepository.findByStatus(Project.Status.ACTIVE);
        List<ProjectResponse> responses = projects.stream()
                .map(ProjectResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createProject(@Valid @RequestBody ProjectRequest request) {
        if (projectRepository.existsByName(request.getName())) {
            return ResponseEntity.badRequest().body("Project name already exists");
        }

        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());

        Project savedProject = projectRepository.save(project);
        return ResponseEntity.ok(ProjectResponse.fromEntity(savedProject));
    }
}