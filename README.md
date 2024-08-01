# Bulk Action Platform - CRM

## Overview
The Bulk Action Platform is designed to handle bulk operations such as create, update, and delete on CRM entities like Contacts and Companies. It utilizes MongoDB for data storage and Redis for managing asynchronous job queues.

## Prerequisites
Before you begin, ensure you have the following installed on your local machine:
- Node.js (version 18.x or higher)
- MongoDB (version 6.x or higher)
- Redis (version 6.x or higher)


## Running dependent services

### MongoDB
- Run mongoDBCompass in local
- Or start mongoDB-community service via terminal

### Redis
- Run redis-server in WSL
- If using Docker: $ docker run -d --name redis-stack -p 6379:6379 redis/redis-stack:latest 
- Or to run in remote: https://redis.io/try-free/


## Installation

### Clone the Repository
1. To get started, clone the repository to your local machine:

    ```
    git clone https://github.com/vijay7755/bulk-action-platform.git
    cd bulk-action-platform
    ```

2. Install the packages

   ```
   npm install
   ```

3. Configure the environment
    - navigate to ./config/db.js
    - Replace with your mongoDB conncetion url: "mongodb://localhost:27017/bulk-action-platform"

    - navigate to queue/queueManager.js
    - Repalce with your Redis connection host and port. By default "redis: { host: "127.0.0.1", port: 6379 }"


To start the application
   ```
   npm run dev
   ```
   - by default application is configured to run on PORT 3000
   - You can access the application routes using a tool like Postman or via cURL: http://localhost:3000/bulk-actions

## API collection documents
   - You can find the Postman API  collection documents on ./APICollectionDoc dicrectory


   
