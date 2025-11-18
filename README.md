Kindler Backend Service (API)

Overview

The Kindler Backend Service is the core engine that powers the Kindler matching platform. It is responsible for handling all project data persistence, user authentication, and critical business logic, including filtering, matching algorithms, and data integrity checks.

This API ensures a seamless, reliable, and secure data flow for the frontend application.

Tech Stack & Architecture

We utilize a modern, scalable, and real-time capable stack:

Language: Node.js (High-performance, event-driven runtime environment).

Web Framework: Express.js (Minimalist and flexible web application framework for API routing).

Database: Firebase Firestore (Primary NoSQL data store, offering real-time synchronization and scalability).

Authentication: Firebase Admin SDK (Securely verifies and manages user identities and authorization tokens).

Logic: Custom Matching Algorithms (Implements the core logic for suggesting projects based on user preferences and history).

Core Responsibilities

The backend API is designed to handle the following primary functions:

Data Management: Provides secure CRUD (Create, Read, Update, Delete) operations for Project and User data.

User Actions: Records and manages sensitive user interactions (matches, skips, etc.).

Authentication & Authorization: Protects all sensitive endpoints, ensuring only authenticated and authorized users can access or modify data.

Business Logic: Executes the proprietary matching logic to determine which projects a specific user sees next in their feed.

Security Notes

The system leverages Firebase Security Rules extensively to enforce collection-level read/write permissions. All client-facing data requests must pass through the secured /api/v1/ endpoints for proper validation and business logic execution, protecting the integrity of the data store.
