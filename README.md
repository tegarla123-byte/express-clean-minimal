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
graph TD
    %% Nodes
    Client((Client))
    
    subgraph Infrastructure ["Infrastructure (Frameworks & Drivers)"]
        Server[Express Server]
        DB[(PostgreSQL)]
        RepoImpl[KnexUserRepository]
    end
    
    subgraph Interface ["Interface Adapters"]
        Controller[UserController]
    end
    
    subgraph UseCases ["Use Cases (Business Rules)"]
        UC[Use Cases\n(CreateUser, GetPaginatedUsers...)]
    end
    
    subgraph Domain ["Domain (Entities)"]
        Entity[User Entity]
        RepoInt[UserRepository Interface]
    end

    %% Flow
    Client -- HTTP Request --> Server
    Server -- Route --> Controller
    Controller -- Calls --> UC
    UC -- Uses --> RepoInt
    RepoImpl -. Implements .-> RepoInt
    UC -- Returns --> Entity
    RepoImpl -- Query --> DB
    
    %% Styling for "Dependencies Point Inwards" visualization
    classDef domain fill:#f9f,stroke:#333,stroke-width:2px;
    classDef usecase fill:#bbf,stroke:#333,stroke-width:2px;
    classDef interface fill:#dfd,stroke:#333,stroke-width:2px;
    classDef infra fill:#fdd,stroke:#333,stroke-width:2px;
    
    class Entity,RepoInt domain;
    class UC usecase;
    class Controller interface;
    class Server,DB,RepoImpl infra;
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
