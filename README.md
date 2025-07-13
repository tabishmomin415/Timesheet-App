# Timesheet-App

This is a simple **Timesheet Management System**, designed to help employees log their daily work hours against specific projects.

---

## Tech Stack

| Layer     | Technology       |
|-----------|------------------|
| Frontend  | React            |
| Backend   | Spring Boot REST |
| Database  | PostgreSQL       |

---

## Features

- Employee registration and login  
- Submit timesheets per project and date  
- View previous timesheets  

---

## Project Structure

### Frontend (React)

```bash
frontend/
├── src/
│ ├── components/
│ │ ├── Dashboard.js
| │ ├── Login.js
| │ ├── Navbar.js
│ │ ├── Register.js
│ │ ├── TimesheetForm.js
│ │ └── TimesheetSummary.js
| ├── contexts/
│ │ └── AuthContext.js
| ├── services/
│ │ └── api.js
│ ├── App.js
│ └── index.js
└── package.json
```

### Backend (Spring Boot)
```bash
backend/
├── src/
│ └── main/java/com/timesheet/
│ ├── config/
│ ├── controller/
│ ├── dto/
│ ├── model/
│ ├── repository/
│ ├── service/
│ └── TimesheetApplication.java
├── src/main/resources/
│ └── application.properties
└── pom.xml
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


