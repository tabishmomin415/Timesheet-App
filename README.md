# Timesheet-App

A modern, full-stack web application for managing employee timesheets with role-based access control, interactive dashboards, and comprehensive reporting features.

---

## Tech Stack

| Layer     | Technology       |
|-----------|------------------|
| Frontend  | React            |
| Backend   | Spring Boot REST |
| Database  | PostgreSQL       |
| DevOps    | Docker           |

---

## Features

 # Employee Features

   - Create and manage personal timesheets
   - Project selection with hours tracking
   - Weekly and monthly summary reports
   - Interactive dashboard with charts
   - Date-based filtering and search
     
 # Admin Features
 
   - View all employee timesheets
   - Comprehensive admin dashboard
   - Create and manage projects
   - Employee performance analytics
   - Advanced reporting with charts

---

## Project Structure

### Frontend (React)

```bash
timesheet-app/
│
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── .mvn/
│   │   └── wrapper/
│   │       ├── maven-wrapper.jar
│   │       └── maven-wrapper.properties
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   │   └── com/
│       │   │       └── timesheet/
│       │   │           ├── TimesheetApplication.java
│       │   │           ├── entity/
│       │   │           │   ├── User.java
│       │   │           │   ├── Project.java
│       │   │           │   └── Timesheet.java
│       │   │           ├── repository/
│       │   │           │   ├── UserRepository.java
│       │   │           │   ├── ProjectRepository.java
│       │   │           │   └── TimesheetRepository.java
│       │   │           ├── security/
│       │   │           │   ├── JwtUtils.java
│       │   │           │   ├── UserPrincipal.java
│       │   │           │   ├── CustomUserDetailsService.java
│       │   │           │   ├── AuthTokenFilter.java
│       │   │           │   └── WebSecurityConfig.java
│       │   │           ├── controller/
│       │   │           │   ├── AuthController.java
│       │   │           │   ├── TimesheetController.java
│       │   │           │   └── ProjectController.java
│       │   │           └── dto/
│       │   │               ├── LoginRequest.java
│       │   │               ├── SignupRequest.java
│       │   │               ├── JwtResponse.java
│       │   │               ├── MessageResponse.java
│       │   │               ├── TimesheetRequest.java
│       │   │               ├── TimesheetResponse.java
│       │   │               ├── ProjectRequest.java
│       │   │               ├── ProjectResponse.java
│       │   │               └── TimesheetSummary.java
│       │   └── resources/
│               └── application.properties
│      
│           
│
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── App.js
        ├── components/
        │   ├── Login.js
        │   ├── Register.js
        │   ├── Navbar.js
        │   ├── Dashboard.js
        │   ├── TimesheetForm.js
        │   ├── TimesheetSummary.js
        │   └── AdminDashboard.js
        ├── context/
        │   └── AuthContext.js
        └── services/
            └── api.js
```
---

## How to Run the Project

### 1. Clone the Repository
```bash
git clone https://github.com/tabishmomin415/Timesheet-App.git
cd timesheet-app
```

### 2. Setup PostgreSQL Database

Make sure **PostgreSQL** is installed and running on your system.

- Create a database named `timesheet_db`
- Run the following command to create the tables and insert sample data:

```bash
psql -U postgres -d timesheet_db -f database/schema.sql
```

### 3. Run the Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

The backend will start on: http://localhost:8080

### 4. Run the Frontend (React)

```bash
cd frontend
npm install
npm start
```

The frontend will start on: http://localhost:3000 

## Results

| Feature(Employee) |            Link                  |
|-------------------|---------------------------------|
| Dashboard         | [View Image](Screenshots/EmplyeeDashboard_01.PNG)|
                    | [View Image](Screenshots/EmplyeeDashboard_02.PNG)|
| Login             | [View Image](Screenshots/Login.PNG)             |
| Timesheet Form    | [View Image](Screenshots/AddTimesheet.PNG)    |
| Timesheet Summary | [View Image](Screenshots/EmployeeSummary.PNG) |
| Register          | [View Image](Screenshots/Register.PNG)          |

| Feature(Admin)    |            Link                  |
|-------------------|---------------------------------|
| Dashboard         | [View Image](Screenshots/AdminDashboard_01.PNG)    |
                    | [View Image](Screenshots/AdminDashboard_02.PNG)    |
                    | [View Image](Screenshots/AdminDashboard_03.PNG)    |



