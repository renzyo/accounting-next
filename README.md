# Warehouse Management Website

Store Product and Sales Management Website built using Next JS (app directory) and Typescript.

Try the demo [here](https://warehouse.merza.dev/).
With the following credentials:

- Email: admin@merza.dev
- Password: admin123

## Getting Started

1. Clone this repo.
1. Duplicate ```.env.example``` and rename it to ```.env```.
1. Fill in all the environment variables.
1. Run ```npm install``` to install all dependencies.
1. Run ```npm run dev``` to start the development server.
1. Register new admin account by sending a POST request to ```http://localhost:3000/api/auth/register``` with the following body (can only be done once):

    ```json
    {
        "name": "John Doe",
        "email": "johndoe@email.com",
        "password": "johndoe123",
        "passwordConfirmation": "johndoe123"
    }
    ```

1. Open ```http://localhost:3000``` in your browser.
1. Login with the admin account.

## Tech Stack

- Next.js (React Framework)
- Typescript
- React
- Zustand (State Management)
- TailwindCSS (Styling)
- React Hook Form & Zod (Form Validation)
- Shadcn UI (UI Components)
- MongoDB / MySQL (Database)
- Firebase Storage (Image Storage)
- Prisma (ORM)
- Rest API (Backend)

## Features

- [x] Dashboard
- [x] Product Management
- [x] Sales Management
- [x] User Management
- [x] Role Management
- [x] Authentication
- [x] Authorization
- [x] Search
- [x] Sort
- [x] Filter
- [x] Pagination
- [x] Toast Notification
- [x] Form Validation

## Setup Firebase

1. Create a new project in Firebase.
1. Create a new web app.
1. Copy the config to environment variable.
1. Enable Storage.

## Setup MongoDB (Atlas)

1. Create a new project in MongoDB Atlas.
1. Create a new cluster.
1. Create a new database.
1. Create a new user.
1. Whitelist your IP address.
1. Connect to your cluster by copying the connection string to environment variable.
1. In terminal, run ```npm run prisma:generate``` to generate prisma client.

## Setup MySQL (Self Hosted)

1. Install MySQL.
1. Create a new database.
1. Create a new user.
1. Connect to your database by copying the connection string to environment variable.
1. In terminal, run ```npm run prisma:generate``` to generate prisma client.
