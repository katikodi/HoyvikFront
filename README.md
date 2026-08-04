# API Documentation

## Overview

This document describes the API endpoints available for the frontend application.

The API uses **cookie-based authentication**. After a successful login, the backend will set an authentication cookie. The browser will automatically include this cookie in future requests.

When making authenticated requests from JavaScript, include credentials:

```javascript
fetch("/api/example", {
    credentials: "include"
});
```

---

# Authentication

## Available Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/auth/register` | Create a new account | Not required |
| POST | `/api/auth/login` | Login a user | Not required |
| POST | `/api/auth/logout` | Logout current user | Required |
| GET | `/api/auth/auth/me` | Get current user information | Optional |

---

# POST `/api/register`

Creates a new user account.

## Request Body

```json
{
    "email": "user@example.com",
    "password": "password123",
    "confirmPassword": "password123"
}
```

## Response

Success:

```http
200 OK
```

## Errors

```http
400 Bad Request
```

Returned when the registration data is invalid.

---

# POST `/api/login`

Logs in a user and creates an authentication session.

## Request Body

```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

## Response

Success:

```http
200 OK
```

The response sets an authentication cookie that will be used for future authenticated requests.

## Errors

```http
401 Unauthorized
```

Returned when the email or password is incorrect.

---

# POST `/api/logout`

Logs out the current user and removes the authentication session.

## Authentication

Requires a valid authentication cookie.

## Response

Success:

```http
200 OK
```

---

# GET `/api/auth/me`

Returns information about the currently logged-in user.

Authentication is optional.

## Response: Logged In User

```json
{
    "id": "12345",
    "email": "user@example.com",
    "roles": [
        "User"
    ]
}
```

## Response: Guest User

```json
null
```

---

# Admin Endpoints

Admin endpoints require the user to be authenticated and have the `Admin` role.

The frontend should hide admin-only UI elements for non-admin users, but the backend is responsible for enforcing permissions.

## Authorization Responses

User is not logged in:

```http
401 Unauthorized
```

User is logged in but does not have the required role:

```http
403 Forbidden
```

---


# Frontend Authentication Flow

## Guest

```
Open website
      |
      v
GET /api/auth/me
      |
      v
Response: null
      |
      v
Display public pages
```

---

## Logging in

```
Login form submitted
      |
      v
POST /api/auth/login
      |
      v
Authentication cookie created
      |
      v
GET /api/auth/me
      |
      v
User information returned
```

---

# Example Fetch Requests

## Login

```javascript
await fetch("/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        email,
        password
    })
});
```

---

## Get Current User

```javascript
const response = await fetch("/api/auth/me", {
    credentials: "include"
});

const user = await response.json();
```

---

## Logout

```javascript
await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include"
});
```

---

# Future Endpoints

When adding new API areas, keep endpoints grouped by feature:

```
/api/auth/*
/api/events/*
/api/bookings/*
/api/admin/*
```

This keeps the API documentation organized as the application grows.