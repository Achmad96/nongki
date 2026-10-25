# Nongki - Modern Coworking Space & Meeting Room Reservation Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.0-brightgreen.svg?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot) [![Java](https://img.shields.io/badge/Java-17%2B-orange.svg?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg?logo=react&logoColor=white)](https://react.dev/) [![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-38B2AC.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/) [![MySQL](https://img.shields.io/badge/MySQL-8.0-00758F.svg?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Nongki** is a production-grade full-stack web application for discovering, reserving, and managing coworking spaces, shared hot desks, private pods, and meeting rooms. Built with a responsive **React 19** single-page application and a secure **Spring Boot 3** REST API backend, Nongki provides an
intuitive booking experience complete with real-time floor availability maps, concurrency conflict prevention, distributed idempotency checks, and simulated multi-channel payment processing.

---

## Table of Contents

- [Key Capabilities & Features](#key-capabilities--features)
- [System Architecture & Tech Stack](#system-architecture--tech-stack)
- [Project Directory Structure](#project-directory-structure)
- [System Requirements & Prerequisites](#system-requirements--prerequisites)
- [Quick Start Guide: Step-by-Step Setup](#quick-start-guide-step-by-step-setup)
  - [Step 1: Database Setup (MySQL)](#step-1-database-setup-mysql)
  - [Step 2: Start the Backend Service (`nongki-server`)](#step-2-start-the-backend-service-nongki-server)
  - [Step 3: Start the Frontend Application (`nongki-client`)](#step-3-start-the-frontend-application-nongki-client)
- [Demo Credentials & Route Guide](#demo-credentials--route-guide)
- [REST API Reference](#rest-api-reference)
- [Engineering Highlights & Design Patterns](#engineering-highlights--design-patterns)
  - [1. Pessimistic Locking & Deadlock Prevention](#1-pessimistic-locking--deadlock-prevention)
  - [2. Idempotent Order Creation](#2-idempotent-order-creation)
  - [3. Asymmetric RSA JWT Authentication](#3-asymmetric-rsa-jwt-authentication)
  - [4. Route Guards & Client Session Lifecycle](#4-route-guards--client-session-lifecycle)
- [Build, Test & Deployment Commands](#build-test--deployment-commands)
- [Troubleshooting & FAQ](#troubleshooting--faq)

---

## Key Capabilities & Features

### User Experience & Booking Flow

- **Interactive Landing Page**: Modern visual identity with animated hero typography (GSAP & SplitText), room previews, space showcases via Swiper, customer testimonials, and an interactive FAQ accordion.
- **Dynamic Space Filtering**: Filter available workspaces by date, time window (08:00 to 22:00), space tier (**Standard** / **VIP**), and format (**Desk**, **Group Desk**, **Meeting Room**).
- **Interactive Coordinate Floor Map**: Visual floor plan mapping desks (A1-L3) and meeting rooms (M1-M2). Shows real-time occupied vs. available desks for any selected time window with zoom and pan controls.
- **Simulated Payment Gateway**: Real-time payment simulation supporting **QRIS** (with active 10-minute countdown timer and QR display) and **GoPay**, along with instantaneous confirmation and receipt generation.
- **Reservation History & Receipts**: In-app modal dialog enabling authenticated users to view past reservations, inspect timestamps, desk codes, and generated invoice details.

### Security & Reliability Engineering

- **Stateless RSA JWT Authentication**: Public-key cryptography (`RS256`) with key pairs (`private.pem` & `public.pem`) and automatic token expiration tracking.
- **Deadlock-Free Pessimistic Locking**: `PESSIMISTIC_WRITE` row-level locks on space details acquired in deterministic alphabetical order to prevent database deadlocks under high concurrency.
- **Zero Double-Booking Guarantee**: Transactional overlap detection (`countConflictingOrders`) ensures no two users can book identical space-time slots.
- **Distributed Idempotency Protection**: Dedicated `Idempotency-Key` header verification with database status caching (`IN_PROGRESS` / `COMPLETED`) to prevent duplicate bookings or double charges on flaky networks.
- **Automatic Seed Bootstrapping**: `DataInitializer` seeds a default administrator profile (`admin@nongki.id` / `123`) on initial server boot if not already present.

---

## System Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────┐
│                   Nongki Client                        │
│  React 19 + Vite 6 + Tailwind CSS v4 + Radix + Lucide  │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / JSON (Proxy /api)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Nongki Server                        │
│   Spring Boot 3.5.0 + Spring Security 6 + JJWT RSA     │
│   JPA / Hibernate + Pessimistic Lock Concurrency       │
└───────────────────────────┬────────────────────────────┘
                            │ JDBC (Port 3306)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   MySQL 8.0 Database                   │
│   Relational Schema (DDL) + Preset Spatial Seed Data   │
└────────────────────────────────────────────────────────┘
```

### Frontend (`nongki-client`)

| Component                  | Technology                                | Description                                                                   |
| -------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------- |
| **Core Framework**         | React 19.1.0                              | Component architecture with modern hooks (`useMemo`, `useState`, `useEffect`) |
| **Tooling & Bundler**      | Vite 6.3.5                                | Fast HMR dev server with chunk-splitting rollup optimizations                 |
| **Client Routing**         | React Router DOM 7.6.2                    | Declarative routing with `ProtectedRoute` and `GuestRoute` guards             |
| **Styling & Theme**        | Tailwind CSS 4.1.10 (`@tailwindcss/vite`) | Modern zero-runtime styling engine                                            |
| **UI Components**          | Radix UI + Lucide React + Emotion / MUI 7 | Accessible dialogs, separators, badges, cards, and icons                      |
| **Animations & Carousels** | GSAP 3.13.0 & Swiper 11.2.10              | Fluid micro-interactions and smooth touch-enabled galleries                   |

### Backend (`nongki-server`)

| Component             | Technology                      | Description                                                                |
| --------------------- | ------------------------------- | -------------------------------------------------------------------------- |
| **Core Framework**    | Spring Boot 3.5.0               | RESTful microservice architecture on Java 17                               |
| **Security & Auth**   | Spring Security 6 & JJWT 0.12.3 | Stateless Bearer token verification with 2048-bit RSA keys                 |
| **Data Persistence**  | Spring Data JPA / Hibernate     | Object-relational mapping, custom JPA specifications, and criteria queries |
| **Database Driver**   | MySQL Connector/J 8.0.33        | Native JDBC connectivity                                                   |
| **API Documentation** | Spring REST Docs & Asciidoctor  | Integration-tested API documentation pipeline                              |
| **Build System**      | Gradle 8.14.2                   | Gradle wrapper with multi-task pipelines                                   |

### Database

- **Engine**: MySQL 8.0 (compatible with MariaDB 10.4+)
- **Schema & Seeding**:
  - `nongki-ddl.sql`: Relational DDL (users, spaces, categories, facilities, orders, payments, idempotency records)
  - `nongki-seed.sql`: Spatial coordinates, desk configurations, categories, and amenity links

---

## Project Directory Structure

```text
nongki/
├── nongki-client/                      # Frontend Application (React 19 + Vite)
│   ├── public/                         # Static web assets
│   ├── src/
│   │   ├── assets/                     # Floor maps, brand logos, QR samples
│   │   ├── Components/
│   │   │   ├── Landing/                # Landing sections (Hero, About, Products, Testimonials, FAQ)
│   │   │   ├── ui/                     # Reusable UI primitives (Button, Card, Dialog, Badge, Input)
│   │   │   ├── AppHeader.jsx           # Global sticky navigation with user status & quick logout
│   │   │   ├── ProtectedRoute.jsx      # Route guard requiring valid authenticated session
│   │   │   ├── GuestRoute.jsx          # Route guard redirecting logged-in users away from auth forms
│   │   │   └── SplitText.jsx           # GSAP animated typography component
│   │   ├── pages/
│   │   │   ├── Landing.jsx             # Public marketing & service overview
│   │   │   ├── Login.jsx               # User authentication with session expiration handling
│   │   │   ├── Register.jsx            # User registration with field validation
│   │   │   ├── Order.jsx               # Workspace reservation & filter selector
│   │   │   ├── Map.jsx                 # Interactive floor map & desk selector
│   │   │   └── Confirm.jsx             # Payment simulation & order confirmation
│   │   ├── services/
│   │   │   └── api.js                  # Centralized fetch client, token management & endpoints
│   │   ├── App.jsx                     # Root application route table
│   │   └── main.jsx                    # React entry point
│   ├── package.json                    # Frontend dependencies & scripts
│   └── vite.config.js                  # Vite configuration & backend proxy (/api -> :8081)
│
├── nongki-server/                      # Backend REST API Service (Spring Boot 3)
│   ├── src/main/java/me/app/nongki/
│   │   ├── config/                     # SecurityConfig, RsaKeyProperties, DataInitializer
│   │   ├── controller/                 # AuthController, SpaceController, OrderController, UserController
│   │   ├── criteria/                   # Dynamic JPA Criteria specifications
│   │   ├── dto/                        # Request / Response Data Transfer Objects
│   │   ├── entity/                     # JPA Entities (User, Space, SpaceDetail, Order, OrderDetail, Payment)
│   │   ├── exception/                  # GlobalExceptionHandler, BookingConflictException, ResourceNotFoundException
│   │   ├── repository/                 # Spring Data JPA repositories with custom query locks
│   │   ├── security/                   # JwtAuthenticationFilter & UserDetailsService
│   │   ├── service/                    # AuthService, SpaceService, OrderService, JWTService, UserService
│   │   └── NongkiApplication.java      # Application main entry point
│   ├── src/main/resources/
│   │   ├── certs/                      # Asymmetric RSA keys (private.pem / public.pem)
│   │   └── application.properties      # Port 8081, datasource credentials, JWT expiry configuration
│   ├── compose.yaml                    # Optional Docker Compose configuration for MySQL
│   ├── build.gradle                    # Gradle dependencies and Asciidoctor doc tasks
│   └── gradlew / gradlew.bat           # Gradle build wrapper scripts
│
├── nongki-ddl.sql                      # Complete MySQL database DDL schema
├── nongki-seed.sql                     # Initial seed dataset (spaces, desk codes, facilities)
├── nongki.sql                          # Legacy database dump
└── README.md                           # Documentation root
```

---

## System Requirements & Prerequisites

Ensure the following tools are installed before running Nongki:

1. **Java Development Kit (JDK)**: Version 17 or higher (tested with JDK 17 & JDK 21).
   - Verify: `java -version`
2. **Node.js & npm**: Node.js v18.x or higher (Node.js v20+ LTS recommended) and npm v9+.
   - Verify: `node -v` and `npm -v`
3. **MySQL Server**: MySQL 8.0 (or MariaDB 10.4+) or **Docker Desktop**.
   - Verify: `mysql --version` or `docker --version`
4. **Git**: Version control CLI.
   - Verify: `git --version`

---

## Quick Start Guide: Step-by-Step Setup

Follow these steps in order to launch the full application stack locally.

### Step 1: Database Setup (MySQL)

Nongki requires a MySQL database named `nongki`.

#### Option A: Local MySQL / XAMPP / MariaDB (Recommended)

1. **Start MySQL service**:
   - Via XAMPP: Open the XAMPP Control Panel and start the **MySQL** module.
   - Via Native Service: Start MySQL (`net start MySQL80` on Windows, or `sudo systemctl start mysql` on Linux).

2. **Create Database & Import Schema and Seed Data**: From the repository root (`d:\projects\nongki`):
   - **Windows PowerShell**:

     ```powershell
     # 1. Create database
     mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS nongki;"

     # 2. Import schema (DDL)
     Get-Content nongki-ddl.sql | mysql -u root -p nongki

     # 3. Import seed records (categories, spaces, and desk codes)
     Get-Content nongki-seed.sql | mysql -u root -p nongki
     ```

   - **Command Prompt (CMD) / Linux / macOS (Bash)**:

     ```bash
     # 1. Create database
     mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS nongki;"

     # 2. Import schema (DDL)
     mysql -u root -p nongki < nongki-ddl.sql

     # 3. Import seed records
     mysql -u root -p nongki < nongki-seed.sql
     ```

   _(Note: If your local MySQL `root` account has no password, omit the `-p` flag)._

3. **Verify Database Configuration**: Open `nongki-server/src/main/resources/application.properties` and verify your credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/nongki?useSSL=false&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   spring.jpa.hibernate.ddl-auto=none
   ```
   > [!NOTE] The default password in `application.properties` is configured for local development. Update `spring.datasource.password` if your local MySQL instance uses a different password or an empty password.

---

#### Option B: Using Docker Compose

If you prefer running MySQL within a Docker container:

```bash
cd nongki-server
docker compose up -d
```

Once the container starts, connect to MySQL on port `3306` and execute `nongki-ddl.sql` and `nongki-seed.sql`.

---

### Step 2: Start the Backend Service (`nongki-server`)

1. Open a terminal and navigate to `nongki-server`:

   ```bash
   cd nongki-server
   ```

2. Launch the Spring Boot application using the Gradle wrapper:
   - **Windows (PowerShell / Command Prompt)**:
     ```powershell
     .\gradlew.bat bootRun
     ```
   - **macOS / Linux**:
     ```bash
     chmod +x gradlew
     ./gradlew bootRun
     ```

3. **Verification**: Startup logs will display:
   ```text
   Started NongkiApplication in X.XXX seconds (process running for ...)
   Initialized default admin user: admin@nongki.id
   ```
   The backend API is now running at **`http://localhost:8081`**.

---

### Step 3: Start the Frontend Application (`nongki-client`)

1. Open a **new** terminal window and navigate to `nongki-client`:

   ```bash
   cd nongki-client
   ```

2. Install dependencies (first run only):

   ```bash
   npm install
   ```

3. Start the Vite development server:

   ```bash
   npm run dev
   ```

4. **Access the application**: Open your browser and navigate to: **`http://localhost:5173`**

Vite automatically proxies all `/api/*` network requests to `http://localhost:8081`, eliminating CORS issues during development.

---

## Demo Credentials & Route Guide

On startup, the backend automatically seeds a default administrator account through `DataInitializer`.

### Pre-configured Demo Accounts

| Role              | Identifier / Email                      | Password | Status                      |
| ----------------- | --------------------------------------- | -------- | --------------------------- |
| **Administrator** | `admin@nongki.id` _(or simply `admin`)_ | `123`    | Pre-seeded on first run     |
| **New Users**     | Any valid email via `/register`         | Custom   | Created dynamically via API |

### Application Navigation Matrix

| View                        | Route       | Access     | Purpose                                                     |
| --------------------------- | ----------- | ---------- | ----------------------------------------------------------- |
| **Landing Page**            | `/`         | Public     | Hero showcase, space catalog, testimonials, and FAQs        |
| **User Login**              | `/login`    | Guest Only | Authenticates users; redirects to destination or `/order`   |
| **Registration**            | `/register` | Guest Only | Registers new user profiles with name, email, and phone     |
| **Space Reservation**       | `/order`    | Protected  | Select date, time slots, space category, and space type     |
| **Interactive Floor Map**   | `/map`      | Protected  | Visual grid showing occupied vs. available desks            |
| **Checkout & Confirmation** | `/confirm`  | Protected  | Payment breakdown, countdown timer, QRIS / GoPay simulation |

> [!TIP] The client automatically redirects unauthenticated users trying to access `/order`, `/map`, or `/confirm` back to `/login`, preserving their intended route in history.

---

## REST API Reference

The backend exposes RESTful endpoints under `/api`. All endpoints except public authentication and read-only space queries require an `Authorization: Bearer <token>` header.

### 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint             | Access | Request Body                                                                  | Description                       |
| ------ | -------------------- | ------ | ----------------------------------------------------------------------------- | --------------------------------- |
| `POST` | `/api/auth/register` | Public | `{ "name": "...", "email": "...", "password": "...", "phoneNumber": "..." }`  | Register a new user               |
| `POST` | `/api/auth/login`    | Public | `{ "email": "admin@nongki.id", "password": "123" }` _(or identifier `admin`)_ | Authenticate and obtain JWT token |

**Sample Login Response (`200 OK`)**:

```json
{
  "token": "eyJhbGciOiJSUzI1NiJ9...",
  "expireIn": "1730000000000"
}
```

---

### 2. Space & Desk Endpoints (`/api/spaces`)

| Method | Endpoint                   | Access        | Parameters                                              | Description                             |
| ------ | -------------------------- | ------------- | ------------------------------------------------------- | --------------------------------------- |
| `GET`  | `/api/spaces`              | Public        | `categoryId`, `type`, `date`, `start`, `end`            | Retrieve workspaces matching criteria   |
| `GET`  | `/api/spaces/{id}`         | Public        | Path variable: `id`                                     | Retrieve single workspace details       |
| `GET`  | `/api/spaces/booked-desks` | Public        | `date` (YYYY-MM-DD), `start` (HH), `end` (HH)           | List desk codes already booked for slot |
| `POST` | `/api/spaces`              | Authenticated | `{ "category": {...}, "type": "Desk", "price": 15000 }` | Register a new workspace                |

---

### 3. Orders & Booking Endpoints (`/api/orders`)

| Method | Endpoint                   | Access        | Headers & Body                                                                                                           | Description                    |
| ------ | -------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------ |
| `POST` | `/api/orders`              | Authenticated | Header: `Idempotency-Key` (Optional)<br>Body: `{ "date": "2026-10-26", "startTime": 9, "endTime": 12, "code": "A1,A2" }` | Book one or more desks         |
| `GET`  | `/api/orders`              | Authenticated | Query: `?user=admin@nongki.id` (Optional)                                                                                | Fetch booking history for user |
| `GET`  | `/api/orders/{id}`         | Authenticated | Path variable: `id`                                                                                                      | Fetch specific order details   |
| `GET`  | `/api/orders/booked-desks` | Public        | `date`, `start`, `end`                                                                                                   | Query occupied desk codes      |

**Sample Order Request**:

```json
{
  "date": "2026-10-26",
  "startTime": 9,
  "endTime": 12,
  "code": "A1",
  "totalPrice": 45000,
  "idempotencyKey": "order_uuid_random_key"
}
```

---

### 4. User Profile Endpoints (`/api/users`)

| Method | Endpoint          | Access        | Description                              |
| ------ | ----------------- | ------------- | ---------------------------------------- |
| `GET`  | `/api/users/me`   | Authenticated | Get current authenticated user's profile |
| `GET`  | `/api/users`      | Authenticated | List all registered users                |
| `GET`  | `/api/users/{id}` | Authenticated | Get user profile by UUID                 |
| `PUT`  | `/api/users/{id}` | Authenticated | Update user profile data                 |

---

## Engineering Highlights & Design Patterns

### 1. Pessimistic Locking & Deadlock Prevention

Coworking platforms frequently experience race conditions when multiple users attempt to reserve the same desk at the same time. Nongki implements a multi-layer strategy:

1. **Sorted Lock Acquisition**: In `OrderService`, desk codes are deduplicated and sorted lexicographically (e.g., `['A1', 'B2']`) before requesting database locks. This guarantees that concurrent transactions always acquire row locks in the exact same sequence, eliminating lock-order deadlocks.
2. **Pessimistic Write Locks**: `spaceDetailRepository.findAllByCodeInWithLock()` applies `LockModeType.PESSIMISTIC_WRITE` (`SELECT ... FOR UPDATE`), blocking competing transactions from checking out the same desk concurrently.
3. **Overlapping Slot Validation**:
   ```sql
   SELECT COUNT(od) FROM OrderDetail od
   WHERE od.spaceDetail.code = :code
     AND od.date = :date
     AND NOT (od.endTime <= :startTime OR od.startTime >= :endTime)
   ```
   If any overlap exists, a `BookingConflictException` is thrown, returning an explicit `409 Conflict` error to the client.

---

### 2. Idempotent Order Creation

To prevent duplicate reservations and charges caused by network timeouts or repeated button clicks:

- Each reservation request can pass an `Idempotency-Key` (in the HTTP header or JSON payload).
- `OrderService` verifies the key in the `idempotency_record` table inside a `READ_COMMITTED` transaction.
- If a request is `IN_PROGRESS`, concurrent duplicates are rejected immediately.
- If `COMPLETED`, the previously cached response is returned directly without re-executing booking logic.

---

### 3. Asymmetric RSA JWT Authentication

Authentication utilizes 2048-bit RSA asymmetric key pairs:

- The private key (`certs/private.pem`) signs tokens upon successful credentials verification in `JWTService`.
- The public key (`certs/public.pem`) verifies incoming requests statelessly in `JwtAuthenticationFilter`.
- If an authorization token expires or becomes invalid, the server rejects the request with `401 Unauthorized` without querying user tables repeatedly.

---

### 4. Route Guards & Client Session Lifecycle

The React frontend handles authentication state dynamically:

- `ProtectedRoute`: Checks token existence and expiration. If the token is expired or absent, it automatically redirects the user to `/login` while storing the attempted route in navigation state.
- `GuestRoute`: Prevents already logged-in users from accessing `/login` or `/register`, redirecting them directly to `/order`.
- `api.js`: Inspects HTTP response statuses. If a `401 Unauthorized` occurs, it purges credentials from local storage and redirects to `/login?expired=1` with an informative banner.

---

## Build, Test & Deployment Commands

### Backend (`nongki-server`)

- **Run all unit & integration tests**:
  ```bash
  .\gradlew.bat test
  ```
- **Compile Java classes**:
  ```bash
  .\gradlew.bat compileJava
  ```
- **Package executable JAR**:
  ```bash
  .\gradlew.bat bootJar
  ```
  The packaged fat JAR will be located at `build/libs/nongki-0.0.1-SNAPSHOT.jar`. Launch it with:
  ```bash
  java -jar build/libs/nongki-0.0.1-SNAPSHOT.jar
  ```

---

### Frontend (`nongki-client`)

- **Run ESLint static analysis**:
  ```bash
  npm run lint
  ```
- **Build optimized production bundle**:
  ```bash
  npm run build
  ```
  Generates production-ready distribution assets inside `nongki-client/dist`.
- **Preview production build locally**:
  ```bash
  npm run preview
  ```

---

## Troubleshooting & FAQ

### 1. Database Connection Fails (`Access denied for user 'root'@'localhost'`)

- Ensure MySQL is active (`net start MySQL80` or via XAMPP Control Panel).
- Check `nongki-server/src/main/resources/application.properties`.
- Update `spring.datasource.password=` to match your MySQL password. If your MySQL root user has no password, leave it empty.

### 2. `Table 'nongki.space' doesn't exist` or Missing Desks on Map

- Make sure both `nongki-ddl.sql` and `nongki-seed.sql` have been imported into the `nongki` database.
- Verify with:
  ```sql
  USE nongki;
  SHOW TABLES;
  SELECT COUNT(*) FROM space;
  SELECT COUNT(*) FROM detail_space;
  ```

### 3. Java Version Conflict (`Unsupported class file major version` or Java 17 Required)

- Spring Boot 3 requires Java 17 or newer.
- Check your active version: `java -version`.
- Verify your `JAVA_HOME` environment variable points to a JDK 17+ installation directory.

### 4. Port Conflicts (Port 8081 or 5173 Already in Use)

- **Backend Port 8081**: Change `server.port=8082` in `application.properties`, and update the target port in `nongki-client/vite.config.js`.
- **Frontend Port 5173**: Vite will automatically fallback to port `5174` or higher if `5173` is occupied.

### 5. CORS Errors in Browser Console

- When running frontend through Vite, all API requests should use relative paths (e.g., `/api/spaces`), which are automatically forwarded by Vite's development proxy to `http://localhost:8081`.
- Direct cross-origin calls are permitted for `http://localhost:5173`, `http://localhost:8080`, and `http://127.0.0.1:5173` in `SecurityConfig.java`.

---

## License

This project is open-source software licensed under the [MIT License](LICENSE).
