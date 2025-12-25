```mermaid
flowchart TB
    %% Người dùng
    User[Người dùng<br/>Trình duyệt Web]
    Admin[Quản trị viên<br/>Admin Panel]

    %% Frontend
    FE[Frontend Website<br/>(UI/UX + Chatbox)]
    AdminFE[Admin Frontend]

    %% Backend
    BE[Backend API Server<br/>(Business Logic)]
    Auth[Auth & Validation]
    AI[AI Chatbot Service<br/>(LLM / NLP)]
    
    %% Database
    DB[(Database<br/>MySQL / PostgreSQL)]
    VectorDB[(Vector DB<br/>FAQ / Docs)]

    %% Luồng người dùng
    User --> FE
    FE -->|HTTP/REST| BE
    BE --> Auth
    Auth --> BE

    %% Chatbox AI
    FE -->|Query Chat| BE
    BE --> AI
    AI --> BE

    %% Database
    BE --> DB
    BE --> VectorDB

    %% Admin
    Admin --> AdminFE
    AdminFE -->|CRUD| BE
    BE --> DB
```
