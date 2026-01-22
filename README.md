# Express.js Clean Architecture Project

This project implements a RESTful API for User management using **Clean Architecture** principles. It demonstrates separation of concerns, server-side pagination, and full CRUD capabilities using **Express.js** and **Knex.js** (PostgreSQL).

## 🏗️ Architecture Overview

The project follows the "Clean Architecture" pattern (also known as Onion Architecture). The dependency rule is: **Dependencies only point inwards.**

### Layers

1.  **Domain (Core)** `src/domain/`
    *   Contains **Entities** (`User.js`) and **Business Objects** (`PaginatedResult.js`).
    *   Contains **Repository Interfaces** (`UserRepository.js`). This layer *defines* how data access should behave but *implements* nothing.
    *   **Dependencies**: None. Pure Javascript.

2.  **Use Cases (Application Business Rules)** `src/usecase/`
    *   Contains specific application actions (e.g., `CreateUser.js`, `GetPaginatedUsers.js`).
    *   Orchestrates the flow of data to and from the Domain entities.
    *   **Dependencies**: Domain.

3.  **Interface Adapters** `src/interface/`
    *   Contains **Controllers** (`UserController.js`).
    *   Converts data from the web format (HTTP Request) to the format convenient for the Use Cases and vice versa.
    *   **Dependencies**: Use Cases.

4.  **Infrastructure (Frameworks & Drivers)** `src/infrastructure/`
    *   Contains frameworks (Express), Database connections (`db.js`), and Repository Implementations (`KnexUserRepository.js`).
    *   This is where the "wiring" happens (`server.js`).
    *   **Dependencies**: Interface, Use Cases, library drivers (pg, knex, express).

### Diagram

```mermaid
graph LR
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

---

## 🚀 Getting Started

### Prerequisites

*   **Node.js** (v14+)
*   **PostgreSQL** Database

### Installation

1.  Clone the repo:
    ```bash
    git clone <repo_url>
    cd myapp
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment:
    Create a `.env` file in the root:
    ```env
    DATABASE_URL=postgresql://user:password@localhost:5432/myapp_db
    PORT=3000
    NODE_ENV=development
    ```
4.  Setup Database:
    *   Ensure your Postgres database exists (`myapp_db`).
    *   Run the schema script:
        ```bash
        psql -U <user> -d <db> -f src/infrastructure/schema.sql
        ```

### Running the App

*   **Development Mode** (with Hot Reload):
    ```bash
    npm run dev
    ```
*   **Production Mode**:
    ```bash
    npm start
    ```

API runs at `http://localhost:3000`.

---

## 🛠️ Development Guide

### How to Add a New Feature

1.  **Domain**: Define the new Entity or update existing ones in `src/domain`. Update the `Repository` interface if new data access methods are needed.
2.  **Infrastructure (Repo)**: Implement the new method in `src/infrastructure/KnexUserRepository.js`.
3.  **Use Case**: Create a new Use Case file in `src/usecase/` (e.g., `ChangePassword.js`).
    *   Inject the Repository in the constructor.
    *   Implement an `execute()` method.
4.  **Interface**: Update `UserController.js` to handle the HTTP request.
    *   Inject the new Use Case in the constructor.
    *   Create a method (e.g., `changePassword(req, res)`).
5.  **Infrastructure (Wiring)**: Update `src/infrastructure/server.js`.
    *   Instantiate the new Use Case.
    *   Inject it into the Controller.
    *   Define the new Route.

### Switching Database Implementations

This project currently supports:
*   **Knex.js** (Active): `src/infrastructure/KnexUserRepository.js`
*   **Raw Postgres** (Legacy): `src/infrastructure/PostgresUserRepository.js`
*   **In-Memory** (Testing): `src/infrastructure/InMemoryUserRepository.js`

To switch, edit `src/infrastructure/server.js`:

```javascript
// const userRepository = new InMemoryUserRepository();
// const userRepository = new PostgresUserRepository();
const userRepository = new KnexUserRepository(); // Current
```

### Database Migrations

We use **Knex.js** for query building. Configuration is in `knexfile.js`.
To modify the schema, it is recommended to create Knex migrations (not currently implemented, but config is ready).
Currently, schema changes are handled manually via `src/infrastructure/schema.sql`.

---

## 🧪 Testing

We use a simple `.http` file for verifying endpoints within VS Code.

1.  Install the **REST Client** extension for VS Code.
2.  Open `users.http`.
3.  Click "Send Request" above any URL.

This covers:
*   Pagination (`GET /users?page=1&limit=5`)
*   CRUD Operations
