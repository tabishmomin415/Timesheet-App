package com.timesheet.service;

import com.timesheet.model.Project;
import com.timesheet.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public List<Project> getAllActiveProjects() {
        return projectRepository.findByStatus("ACTIVE");
    }

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }
}