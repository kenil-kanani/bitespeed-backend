# Bitespeed Backend Task

## Production URL
The production URL for the Bitespeed Backend Task is: [https://bitespeed-backend-aui4.onrender.com/identify](https://bitespeed-backend-aui4.onrender.com/identify)

### How to Use
To identify and manage customer identity information, you can make a POST request to the production URL with the following body parameters:

- `email` (optional): The email address of the customer.
- `phoneNumber` (optional): The phone number of the customer.


## Overview
This is a Node.js backend service built with Express and TypeScript. The service helps identify and manage customer identity information by linking related contact entries based on email and phone number matches.

## Architecture
The application follows the MVC (Model-View-Controller) architecture pattern:
- **Models**: Database schemas and data models
- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic layer
- **Repositories**: Data access layer
- **Config**: Configuration files

## Tech Stack
- Node.js with Express
- TypeScript
- MySQL with Sequelize ORM
- Clean code principles and best practices

## Installation
1. Clone the repository.
2. Install dependencies.
3. Add env variables as mentioned in ```example.env```
4. Create a database named `bitespeedBackend`.
5. Create a table with the following SQL command:
   ```sql
   CREATE TABLE contacts (
       id INT AUTO_INCREMENT PRIMARY KEY,
       phoneNumber VARCHAR(15) NULL,
       email VARCHAR(255) NULL,
       linkedId INT NULL,
       linkPrecedence ENUM('primary', 'secondary') NOT NULL DEFAULT 'primary',
       createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
       updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
       deletedAt DATETIME NULL,
       FOREIGN KEY (linkedId) REFERENCES contacts(id) ON DELETE SET NULL
   );
   ```