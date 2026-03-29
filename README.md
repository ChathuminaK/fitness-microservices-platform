# 🏋️ Fitness Management System — Microservices Architecture

> **IT4020: Modern Topics in IT | Assignment 2**
> Sri Lanka Institute of Information Technology (SLIIT)
> Year 4, Semester 1/2 — 2026

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Running the Services](#running-the-services)
6. [API Endpoints](#api-endpoints)
7. [Swagger Documentation](#swagger-documentation)
8. [API Gateway Explanation](#api-gateway-explanation)
9. [Team Contributions](#team-contributions)
10. [Sample Requests](#sample-requests)

---

## 🏗️ Architecture Overview

This project implements a **Microservices Architecture** for a Fitness Management System. Instead of a single monolithic backend, the system is broken into four independent services — each responsible for a distinct business domain — connected through a central **API Gateway**.

```
                        ┌─────────────────────────────────┐
                        │         CLIENT / POSTMAN         │
                        │   (only knows port 8080)         │
                        └──────────────┬──────────────────┘
                                       │
                                       ▼
                        ┌─────────────────────────────────┐
                        │         API GATEWAY              │
                        │       localhost:8080             │
                        │  (routes requests to services)   │
                        └──┬─────────┬────────┬───────┬───┘
                           │         │        │       │
              /api/users   │  /api/  │ /api/  │ /api/ │
                           │ workouts│progress│nutri  │
                           ▼         ▼        ▼       ▼
                    ┌──────────┐ ┌────────┐ ┌──────┐ ┌──────────┐
                    │  User    │ │Workout │ │Prog- │ │Nutrition │
                    │ Service  │ │Service │ │ress  │ │ Service  │
                    │ :3001    │ │ :3002  │ │:3003 │ │  :3004   │
                    └──────────┘ └────────┘ └──────┘ └──────────┘
```

### Why Microservices?

| Aspect | Monolith | Microservices (This Project) |
|---|---|---|
| Deployment | All-or-nothing | Each service deploys independently |
| Scaling | Scale entire app | Scale only bottleneck service |
| Fault isolation | One bug crashes all | Failure stays in one service |
| Team structure | All devs share code | Each member owns a service |
| Technology | One stack | Each service chooses its stack |

---

## 📁 Project Structure

```
fitness-management-system/
│
├── api-gateway/                  # Central API Gateway (port 8080)
│   ├── config/
│   │   └── app.config.js         # Environment + service URLs
│   ├── middleware/
│   │   ├── logger.middleware.js  # Request/response logger
│   │   └── errorHandler.middleware.js
│   ├── .env                      # Gateway config
│   ├── package.json
│   └── server.js                 # Proxy router — the heart of the gateway
│
├── user-service/                 # User Service (port 3001)
│   ├── config/
│   │   ├── app.config.js
│   │   └── swagger.config.js
│   ├── controllers/
│   │   └── user.controller.js    # Register, Login, CRUD
│   ├── models/
│   │   └── user.model.js         # In-memory user store
│   ├── routes/
│   │   └── user.routes.js        # Routes + Swagger JSDoc
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── workout-service/              # Workout Service (port 3002)
│   ├── config/
│   ├── controllers/
│   │   └── workout.controller.js
│   ├── models/
│   │   └── workout.model.js
│   ├── routes/
│   │   └── workout.routes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── progress-service/             # Progress Service (port 3003)
│   ├── config/
│   ├── controllers/
│   │   └── progress.controller.js
│   ├── models/
│   │   └── progress.model.js     # Auto-calculates BMI
│   ├── routes/
│   │   └── progress.routes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── nutrition-service/            # Nutrition Service (port 3004)
│   ├── config/
│   ├── controllers/
│   │   └── nutrition.controller.js
│   ├── models/
│   │   └── meal.model.js         # Auto-calculates total macros
│   ├── routes/
│   │   └── nutrition.routes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── FitnessMS_Postman_Collection.json   # Import into Postman
├── start-all.bat                       # Windows: start all services
├── start-all.sh                        # Mac/Linux: start all services
├── package.json                        # Root scripts
└── README.md
```

---

## ⚙️ Prerequisites

- **Node.js** v16 or higher — [Download](https://nodejs.org)
- **npm** v8 or higher (comes with Node.js)
- **Postman** (optional, for testing) — [Download](https://postman.com)

Verify your installation:
```bash
node --version   # should print v16.x.x or higher
npm --version    # should print 8.x.x or higher
```

---

## 📦 Installation

### Step 1 — Clone / Extract the project

```bash
cd fitness-management-system
```

### Step 2 — Install dependencies for ALL services

Run this single command from the root folder:

```bash
npm run install:all
```

Or install manually, one service at a time:

```bash
cd user-service      && npm install && cd ..
cd workout-service   && npm install && cd ..
cd progress-service  && npm install && cd ..
cd nutrition-service && npm install && cd ..
cd api-gateway       && npm install && cd ..
```

---

## 🚀 Running the Services

> **Important:** Start the 4 microservices BEFORE starting the API Gateway.

### Option A — Automated (Recommended)

**Windows:**
```
Double-click start-all.bat
```

**Mac / Linux:**
```bash
chmod +x start-all.sh
./start-all.sh
```

### Option B — Manual (5 separate terminals)

Open **5 terminal windows** and run one command in each:

| Terminal | Command | Port |
|---|---|---|
| Terminal 1 | `cd user-service && npm start`      | 3001 |
| Terminal 2 | `cd workout-service && npm start`   | 3002 |
| Terminal 3 | `cd progress-service && npm start`  | 3003 |
| Terminal 4 | `cd nutrition-service && npm start` | 3004 |
| Terminal 5 | `cd api-gateway && npm start`       | 8080 |

### Verify everything is running

Open your browser and visit:
```
http://localhost:8080/gateway/status
```

You should see all 4 services reporting `"status": "UP"`.

---

## 📡 API Endpoints

All endpoints can be accessed **two ways**:
1. **Via API Gateway** → `http://localhost:8080/api/...` *(recommended)*
2. **Direct access** → `http://localhost:300X/api/...`

### 👤 User Service

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users/register` | Register a new user |
| POST | `/api/users/login` | Login and receive JWT |
| GET  | `/api/users` | Get all users |
| GET  | `/api/users/:id` | Get user by ID |
| PUT  | `/api/users/:id` | Update user profile |
| DELETE | `/api/users/:id` | Delete user |

### 💪 Workout Service

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/workouts` | Create workout plan |
| GET  | `/api/workouts` | Get all workouts |
| GET  | `/api/workouts/:id` | Get workout by ID |
| PUT  | `/api/workouts/:id` | Update workout |
| DELETE | `/api/workouts/:id` | Delete workout |

### 📈 Progress Service

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/progress` | Add progress entry (auto-calculates BMI) |
| GET  | `/api/progress` | Get all progress entries |
| GET  | `/api/progress/:id` | Get entry by ID |
| PUT  | `/api/progress/:id` | Update entry |
| DELETE | `/api/progress/:id` | Delete entry |

### 🥗 Nutrition Service

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/nutrition` | Add meal plan (auto-calculates macros) |
| GET  | `/api/nutrition` | Get all meals |
| GET  | `/api/nutrition/:id` | Get meal by ID |
| PUT  | `/api/nutrition/:id` | Update meal |
| DELETE | `/api/nutrition/:id` | Delete meal |

---

## 📖 Swagger Documentation

Each service exposes full OpenAPI (Swagger) documentation:

| Service | Direct Swagger URL | Via Gateway |
|---|---|---|
| API Gateway | http://localhost:8080/api-docs | — |
| User Service | http://localhost:3001/api-docs | — |
| Workout Service | http://localhost:3002/api-docs | — |
| Progress Service | http://localhost:3003/api-docs | — |
| Nutrition Service | http://localhost:3004/api-docs | — |

> **For the assignment:** Screenshot both the **native Swagger URL** (e.g., `http://localhost:3001/api-docs`) AND after accessing via gateway (`http://localhost:8080/api-docs`) to demonstrate that both work.

---

## 🚪 API Gateway Explanation

### Problem: Multiple Ports

Without a gateway, a client must know and call **4 different ports**:
- Users → `:3001`
- Workouts → `:3002`
- Progress → `:3003`
- Nutrition → `:3004`

This creates tight coupling, exposes internal topology, and makes the frontend complex.

### Solution: API Gateway on Port 8080

The API Gateway acts as the **single entry point**. The client only ever calls `localhost:8080`, and the gateway routes internally:

```
POST http://localhost:8080/api/users/register
  → Proxied to → http://localhost:3001/api/users/register

GET  http://localhost:8080/api/workouts
  → Proxied to → http://localhost:3002/api/workouts

POST http://localhost:8080/api/progress
  → Proxied to → http://localhost:3003/api/progress

POST http://localhost:8080/api/nutrition
  → Proxied to → http://localhost:3004/api/nutrition
```

### How it works (code)

The gateway uses `http-proxy-middleware` to transparently forward requests:

```javascript
app.use('/api/users',
  createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true })
);
```

The gateway also adds headers (`X-Gateway`, `X-Forwarded-From`) so downstream services know the request came through the gateway.

---

## 🧪 Testing with Postman

1. Open Postman
2. Click **Import** → select `FitnessMS_Postman_Collection.json`
3. The collection includes all 25+ requests organised by service
4. Run requests in order: Register → Login → Create → Get → Update → Delete
5. Collection variables (`user_id`, `workout_id`, etc.) are automatically saved from responses

---

## 👥 Team Contributions

| Member | Microservice | Port | Responsibilities |
|---|---|---|---|
| Member 1 | User Service | 3001 | User registration, authentication (JWT), profile CRUD |
| Member 2 | Workout Service | 3002 | Workout plan creation, exercise tracking, status management |
| Member 3 | Progress Service | 3003 | Progress tracking, BMI calculation, history management |
| Member 4 | Nutrition Service | 3004 | Meal planning, macro calculation, dietary tracking |

> **Note:** API Gateway was a shared responsibility. Each member also contributed to documentation and Swagger specs for their service.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | HTTP framework |
| http-proxy-middleware | API Gateway proxying |
| swagger-jsdoc | OpenAPI spec generation from JSDoc |
| swagger-ui-express | Swagger UI rendering |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| uuid | Unique ID generation |
| dotenv | Environment configuration |
| cors | Cross-Origin Resource Sharing |
| body-parser | Request body parsing |

---

## 📝 Notes

- **In-memory storage:** Data resets when services restart (no database required per assignment spec).
- **JWT:** Generated on login; can be used as `Authorization: Bearer <token>` header.
- **BMI:** Auto-calculated in Progress Service from `weightKg` and `heightCm`.
- **Macros:** Auto-summed in Nutrition Service from `items[].calories/proteinG/carbsG/fatG`.
