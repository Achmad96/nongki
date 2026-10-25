# Nongki - Coworking Space & Meeting Room Reservation Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17%2B-orange.svg)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF.svg)](https://vitejs.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-00758F.svg)](https://www.mysql.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC.svg)](https://tailwindcss.com/)

**Nongki** is a modern full-stack web application designed for booking and managing coworking spaces, shared desks, and meeting rooms. Built with a responsive **React 19** frontend and a robust **Spring Boot 3** REST API backend, Nongki streamlines the process of discovering collaborative workspaces, checking seat availability, selecting booking slots, and simulating payment processing.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture & Structure](#project-architecture--structure)
- [System Requirements & Prerequisites](#system-requirements--prerequisites)
- [Tutorial: How to Run the Project](#tutorial-how-to-run-the-project)
  - [Step 1: Set Up the Database](#step-1-set-up-the-database)
  - [Step 2: Run the Backend Server (nongki-server)](#step-2-run-the-backend-server-nongki-server)
  - [Step 3: Run the Frontend Client (nongki-client)](#step-3-run-the-frontend-client-nongki-client)
- [Testing & Demo Credentials](#testing--demo-credentials)
- [API Reference](#api-reference)
- [Build & Deployment Commands](#build--deployment-commands)
- [Troubleshooting & FAQ](#troubleshooting--faq)

---

## Features

- **Interactive Landing Page**: Modern visual experience featuring animated hero headers (GSAP & SplitText), room previews, feature showcases, customer testimonials, and interactive FAQ accordions.
- **Space & Room Reservation**: Select date, start time, end time, space type (Desk, Group Desk, Meeting Room), and category (VIP, Standard).
- **Interactive Floor Map**: Visual layout map enabling users to explore room locations and spatial layout.
- **Simulated Payment Workflow**: Payment screen with real-time countdown timer, QRIS code, and GoPay payment simulation.
- **Secure Authentication**: User registration and login powered by Spring Security, BCrypt password hashing, and RSA/JWT asymmetric tokens.
- **RESTful API Backend**: Decoupled architecture using JPA/Hibernate for persistence, criteria-based space queries, and exception handling.

---

## Tech Stack

### Frontend (`nongki-client`)
- **Framework**: React 19 (Vite 6 build tool)
- **Routing**: React Router DOM v7
- **UI & Styling**: Tailwind CSS v4, Material UI (MUI 7) & Emotion
- **Animations & Sliders**: GSAP (GreenSock), Swiper
- **Icons**: React Icons (`react-icons/fa`)

### Backend (`nongki-server`)
- **Framework**: Spring Boot 3.5.0
- **Language**: Java 17+
- **Security**: Spring Security 6 with JWT (`jjwt 0.12.3`) & RSA key pairs (`private.pem` / `public.pem`)
- **Persistence**: Spring Data JPA, Hibernate, MySQL Connector/J
- **Build Tool**: Gradle 8.14.2 (Wrapper included)

### Database
- **Engine**: MySQL 8.0 (compatible with MariaDB 10.4+)
- **Schema**: Defined in `nongki-ddl.sql`

---

## Project Architecture & Structure

```
nongki/
├── nongki-client/                # Frontend application (React + Vite)
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── assets/               # Images, logos, and illustrations
│   │   ├── Components/           # Reusable UI components
│   │   │   └── Landing/          # Landing sections (Hero, About, Faq, etc.)
│   │   ├── pages/                # App views (Landing, Login, Register, Order, Map, Confirm)
│   │   ├── Styles/               # Component-level CSS stylesheets
│   │   ├── App.jsx
│   │   └── main.jsx              # Router configuration & app entry point
│   ├── package.json
│   └── vite.config.js
│
├── nongki-server/                # Backend API service (Spring Boot)
│   ├── src/main/java/me/app/nongki/
│   │   ├── config/               # Security & RSA key configurations
│   │   ├── controller/           # REST endpoints (Auth, Space, Order, User)
│   │   ├── criteria/             # JPA criteria specifications
│   │   ├── dto/                  # Data Transfer Objects
│   │   ├── entity/               # JPA entity models (User, Space, Order, etc.)
│   │   ├── exception/            # Global exception handlers
│   │   ├── repository/           # Spring Data JPA repositories
│   │   ├── security/             # JWT filters & auth handlers
│   │   └── service/              # Business logic services
│   ├── src/main/resources/
│   │   ├── certs/                # RSA private & public keys
│   │   └── application.properties # Server port, database connection, JWT secret
│   ├── compose.yaml              # Docker Compose configuration for MySQL
│   ├── Dockerfile
│   ├── build.gradle
│   └── gradlew / gradlew.bat     # Gradle wrapper scripts
│
├── nongki-ddl.sql                # Complete MySQL DDL schema
├── nongki.sql                    # Legacy / reference database dump
└── README.md                     # Project documentation
```

---

## System Requirements & Prerequisites

Before running the project, make sure the following software is installed on your machine:

1. **Java Development Kit (JDK)**: Version 17 or higher (JDK 17, 21, or 22 recommended).
   - Check with: `java -version`
2. **Node.js & npm**: Node.js v18.x or higher (Node v20+ recommended) and npm v9+.
   - Check with: `node -v` and `npm -v`
3. **MySQL Server**: MySQL 8.0 (or MariaDB 10.4+) or **Docker Desktop** if you prefer running MySQL in a container.
   - Check with: `mysql --version` or `docker --version`
4. **Git**: To clone and manage repositories.

---

## Tutorial: How to Run the Project

Follow these steps in order to get the entire project up and running locally.

### Step 1: Set Up the Database

The backend expects a MySQL database named `nongki` accessible on port `3306`. You can set this up using **Option A (Local MySQL / XAMPP)** or **Option B (Docker Compose)**.

#### Option A: Local MySQL / XAMPP / MariaDB (Recommended)

1. **Start MySQL**:
   - If using XAMPP, open the XAMPP Control Panel and start the **MySQL** service.
   - If using standalone MySQL, ensure the service is running (`net start MySQL80` on Windows or `sudo systemctl start mysql` on Linux).

2. **Create the Database and Import the Schema**:
   Make sure you are in the project root directory (`D:\projects\nongki`), then run:

   - **Windows PowerShell**:
     ```powershell
     # Create database
     mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS nongki;"

     # Import schema using Get-Content (PowerShell does not support `<` operator)
     Get-Content nongki-ddl.sql | mysql -u root -p nongki

     # (Optional but recommended) Import initial seed data (categories, spaces, desks)
     Get-Content nongki-seed.sql | mysql -u root -p nongki
     ```

   - **Command Prompt (CMD) / Linux / macOS (Bash)**:
     ```bash
     # Create database
     mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS nongki;"

     # Import schema
     mysql -u root -p nongki < nongki-ddl.sql

     # (Optional but recommended) Import initial seed data
     mysql -u root -p nongki < nongki-seed.sql
     ```

   - **Directly inside the MySQL Shell**:
     ```powershell
     mysql -u root -p nongki
     ```
     Once logged in:
     ```sql
     source nongki-ddl.sql;
     source nongki-seed.sql;
     exit;
     ```
   *(Note: If your local root user does not have a password, omit `-p`)*

   Alternatively, you can open **phpMyAdmin** (`http://localhost/phpmyadmin`) or **MySQL Workbench**:
   - Create a new database named `nongki`.
   - Open and execute the SQL file `nongki-ddl.sql`.

3. **Verify Database Configuration**:
   Inspect `nongki-server/src/main/resources/application.properties` and ensure the credentials match your local setup:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/nongki?useSSL=false&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=
   spring.jpa.hibernate.ddl-auto=none
   ```
   *If your MySQL `root` user has a password, update `spring.datasource.password=<your-password>`.*

---

#### Option B: Using Docker Compose

If you prefer using Docker:
```bash
cd nongki-server
docker compose up -d
```
This will start a MySQL 8.0 container on port `3306` with database `nongki` and persistent storage mounted from `nongki-server/db`.

---

### Step 2: Run the Backend Server (`nongki-server`)

The backend is built with Spring Boot and provides the REST API endpoints.

1. **Open a terminal** and navigate to the `nongki-server` folder:
   ```bash
   cd nongki-server
   ```

2. **Run the Spring Boot application using the Gradle wrapper**:
   - **On Windows (PowerShell / Command Prompt)**:
     ```powershell
     .\gradlew.bat bootRun
     ```
   - **On macOS / Linux**:
     ```bash
     chmod +x gradlew
     ./gradlew bootRun
     ```

3. **Verify the server is running**:
   - When the startup completes, you should see logs ending with:
     ```
     Started NongkiApplication in X.XXX seconds (process running for ...)
     ```
   - The server is live at: `http://localhost:8081` (configured via `server.port` in `application.properties`)

---

### Step 3: Run the Frontend Client (`nongki-client`)

The frontend is a single-page React app built with Vite.

1. **Open a new terminal window** (keep the backend server running) and navigate to `nongki-client`:
   ```bash
   cd nongki-client
   ```

2. **Install dependencies** (only required the first time):
   ```bash
   npm install
   ```

3. **Start the Vite development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Open your browser and navigate to: `http://localhost:5173`
   - You should see the Nongki landing page with animated hero titles and navigation.

---

## Testing & Demo Credentials

Once the application is running:

| Feature | Route | Notes |
|---|---|---|
| **Landing Page** | `http://localhost:5173/` | Explore services, spaces, testimonials, and FAQs. |
| **Login** | `http://localhost:5173/login` | For quick demo, use **Username**: `admin`, **Password**: `123`. |
| **Register** | `http://localhost:5173/register` | Create a new user account against the backend API. |
| **Booking / Order** | `http://localhost:5173/order` | Select date, time slot, space type, and category. |
| **Floor Map** | `http://localhost:5173/map` | View visual desk and room availability layout. |
| **Payment Confirmation** | `http://localhost:5173/confirm` | View order summary, 10-minute countdown timer, QRIS QR code, and simulated payment check. |

---

## API Reference

The backend exposes the following primary endpoints under `http://localhost:8081` (or whichever port is set in `application.properties`):

### 1. Authentication (`/api/auth`)
- `POST /api/auth/register`: Create a new user profile.
  - Body: `{ "name": "...", "email": "...", "password": "...", "phoneNumber": "..." }`
- `POST /api/auth/login`: Authenticate and receive a JWT token.
  - Body: `{ "email": "...", "password": "..." }`
  - Response: `{ "token": "...", "expireIn": "3600000" }`

### 2. Spaces (`/api/spaces`)
- `GET /api/spaces`: Fetch available spaces filtered by query parameters:
  - `?date=YYYY-MM-DD&start=HH&end=HH&categoryId=...&type=...`
- `GET /api/spaces/{id}`: Retrieve details of a specific space.
- `POST /api/spaces`: Create or register a space (Authorized).

### 3. Orders & Reservations (`/api/orders`)
- `POST /api/orders`: Submit a space reservation.
  - Body: `{ "userId": "...", "code": "...", "date": "...", "startTime": 9, "endTime": 12 }`

### 4. Users (`/api/users`)
- `GET /api/users`: List all users.
- `GET /api/users/{id}`: Get user details by UUID.
- `PUT /api/users/{id}`: Update user information.

---

## Build & Deployment Commands

### Backend (`nongki-server`)
- **Compile classes**:
  ```bash
  .\gradlew.bat compileJava
  ```
- **Run tests & generate REST Docs**:
  ```bash
  .\gradlew.bat test
  ```
- **Build production JAR**:
  ```bash
  .\gradlew.bat bootJar
  ```
  The packaged executable JAR will be located at `build/libs/nongki-0.0.1-SNAPSHOT.jar`. Run with:
  ```bash
  java -jar build/libs/nongki-0.0.1-SNAPSHOT.jar
  ```

### Frontend (`nongki-client`)
- **Lint code**:
  ```bash
  npm run lint
  ```
- **Build for production**:
  ```bash
  npm run build
  ```
  The optimized static bundle will be generated in `nongki-client/dist`.
- **Preview production build locally**:
  ```bash
  npm run preview
  ```

---

## Troubleshooting & FAQ

### 1. Database Connection Refused (`CommunicationsException` / `Access denied for user 'root'@'localhost'`)
- Ensure your MySQL service is active.
- Verify that the database `nongki` has been created.
- Check the credentials in `nongki-server/src/main/resources/application.properties`. If your MySQL root account has a password, specify it in `spring.datasource.password`.

### 2. Port Conflicts (`Port 8080 was already in use` or `Port 5173 is in use`)
- If port `8080` is occupied, change the port in `application.properties` (e.g. `server.port=8081`). Note that you should also adjust CORS configuration in `SecurityConfig.java` if you modify frontend or backend ports.
- Vite automatically selects another port (e.g., `5174`) if `5173` is busy.

### 3. `Java 17 or higher is required`
- Spring Boot 3 requires a minimum of Java 17. Verify your active Java version using `java -version`. Set your `JAVA_HOME` environment variable to a JDK 17+ directory if Gradle selects an older JDK.

### 4. CORS Errors between Frontend & Backend
- CORS configuration is managed in `me.app.nongki.config.SecurityConfig`. Make sure your frontend host and port match the permitted origins in `SecurityConfig.java` (`http://localhost:8080`, `http://localhost:5173`).
