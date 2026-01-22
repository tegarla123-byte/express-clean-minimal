# Express.js Clean Architecture with Modular Features

This project implements a RESTful API using **Clean Architecture** principles, refactored into a **Feature-Based (Modular)** structure. It includes comprehensive features like User Management, Book Inventory, and a Borrowing System.

## 🌟 Features

*   **Clean Architecture**: Separation of concerns into Domain, Use Cases, Interfaces, and Infrastructure.
*   **Modular Structure**: Code organized by feature (`users`, `books`, `borrowing`) in `src/modules`.
*   **Database**: PostgreSQL integration using **Knex.js** query builder.
*   **Logging**:
    *   Example: `application-YYYY-MM-DD.log`
    *   Detailed request logging (Method, URL, Status, Speed).
    *   Error logging with stack traces.
    *   Database query logging.
    *   Daily Log Rotation via `winston-daily-rotate-file`.
*   **CRUD Operations**: Full Create, Read, Update, Delete for Users and Books.
*   **Complex Business Logic**: Borrowing system with atomic stock management.
*   **Server-Side Pagination**: Efficient data retrieval.
*   **Hot Reload**: `nodemon` for development.

## 🏗️ Architecture Overview

The project adheres to Clean Architecture but organizes files by **Feature** rather than **Layer** to minimize "fat" layers and improve cohesion.

### Architecture Diagram

```mermaid
graph TD
    %% Node Definitions dengan Ikon Karakter
    Client("fa:fa-user Client / Browser")
    
    subgraph Layer4 [Layer 4: Infrastructure]
        Server["fa:fa-server Express.js Server"]
        RepoImpl["fa:fa-database KnexUserRepository"]
        DB[("(PostgreSQL)")]
    end

    subgraph Layer3 [Layer 3: Interface Adapters]
        Controller["fa:fa-code UserController"]
    end

    subgraph Layer2 [Layer 2: Use Cases]
        UC["fa:fa-gear CreateUser / GetUsers"]
    end

    subgraph Layer1 [Layer 1: Domain]
        RepoInt{{"fa:fa-interchange UserRepository Interface"}}
        Entity["fa:fa-box User Entity"]
    end

    %% Flow Alur Kerja (Atas ke Bawah)
    Client -->|1. Request| Server
    Server -->|2. Route| Controller
    Controller -->|3. Execute| UC
    
    %% Alur Dependency Inversion (Logika Inti)
    UC -->|4. Calls| RepoInt
    RepoImpl -.->|5. Implements| RepoInt
    RepoImpl --- DB
    
    UC -.->|6. Returns| Entity

    %% Styling yang Lebih Clean & Kontras
    classDef infra fill:#f5f5f5,stroke:#d2d2d2,stroke-width:2px,color:#333;
    classDef adapter fill:#e1f5fe,stroke:#01579b,stroke-width:2px,color:#01579b;
    classDef usecase fill:#fff9c4,stroke:#fbc02d,stroke-width:2px,color:#7f6000;
    classDef domain fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#7b1fa2;

    class Server,RepoImpl,DB infra;
    class Controller adapter;
    class UC usecase;
    class RepoInt,Entity domain;
```

### Directory Structure
```
src/
├── shared/                 # Shared utilities and infrastructure
│   ├── domain/             # Shared entities (e.g., PaginatedResult)
│   └── infrastructure/     # Server, DB Config, Logger
├── modules/
│   ├── users/              # User Management Feature
│   │   ├── domain/         # User Entity, Repository Interface
│   │   ├── usecase/        # CreateUser, GetUsers, etc.
│   │   ├── interface/      # UserController
│   │   └── infrastructure/ # KnexUserRepository
│   ├── books/              # Book Inventory Feature
│   └── borrowing/          # Borrowing System Feature
```

### Dependency Rule
**Dependencies only point inwards.**
`Infrastructure` -> `Interface` -> `Use Cases` -> `Domain`

## 🚀 Getting Started

### Prerequisites

*   **Node.js** (v14+)
*   **PostgreSQL** Database

### Installation

1.  **Clone the repo**:
    ```bash
    git clone <repo_url>
    cd myapp
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment**:
    Copy `.env.example` to `.env` and fill in your credentials:
    ```bash
    cp .env.example .env
    ```
    **Key Variables**:
    *   `DATABASE_URL`: `postgres://user:password@localhost:5432/myapp_db`
    *   `PORT`: `3000`

4.  **Setup Database**:
    *   Ensure your Postgres database exists.
    *   Run the setup script to create tables (`users`, `books`, `borrows`):
        ```bash
        node src/shared/infrastructure/setup_db.js
        ```

### Running the App

*   **Development Mode** (Hot Reload):
    ```bash
    npm run dev
    ```
*   **Production Mode**:
    ```bash
    npm start
    ```

API runs at `http://localhost:3000`.

## 🧪 Testing

We use **.http** files for easy testing with the VS Code REST Client extension.

*   **`users.http`**: Test User CRUD operations.
*   **`books.http`**: Test Book CRUD, Borrowing, Returning, and Stock updates.

## 📝 Logging

Logs are stored in the `/logs` directory at the project root.
*   **`application-%DATE%.log`**: General info and requests.
*   **`error-%DATE%.log`**: Error stacks and critical issues.
*   **Console**: Logs are also output to the console in development mode.

## 🛠️ Development Guide

### Adding a New Feature
1.  Create a new folder in `src/modules/` (e.g., `reviews`).
2.  Implement `domain`, `usecase`, `interface`, and `infrastructure` folders inside it.
3.  Wire up the new module in `src/shared/infrastructure/server.js`.
