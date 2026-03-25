# Saraha App (saraha-app)

## Description

Backend Node.js API built with Express and MongoDB (via Mongoose). It provides user authentication using:

- Email/password signup + login (bcrypt hashing)
- Google ID token signup + login (via `google-auth-library`)

It issues JWT access and refresh tokens and supports role-based authorization for protected user routes. User phone numbers are encrypted at rest.

## Features

- JWT authentication with **access** and **refresh** tokens
- Role support: `user` and `admin` (Mongoose field)
- Email/password signup + login
- Google “gmail” signup + login using an `idToken`
- Protected routes:
    - `GET /users/` (access token)
    - `POST /users/renew-token` (refresh token)
- Centralized error handling with custom error classes
- CORS + JSON request bodies

## Tech Stack

- Node.js (ES modules: `"type": "module"`)
- Express
- MongoDB + Mongoose
- JSON Web Tokens (`jsonwebtoken`)
- Password hashing (`bcrypt`)
- Google authentication (`google-auth-library`)
- `dotenv` for loading environment variables
- `cors`

``` bash
src/
├── main.js                         # App entrypoint (bootstraps the server)
├── app.bootstrap.js               # Express setup, middleware, routes

├── DB/
│   ├── Connection.js              # MongoDB connection
│   └── Models/
│       └── user.model.js          # User schema + encryption logic

├── Modules/
│   ├── Auth/
│   │   ├── auth.controller.js     # /auth endpoints
│   │   └── auth.service.js        # Auth business logic
│   │
│   └── User/
│       ├── user.controller.js     # /users endpoints
│       └── user.service.js        # User/token logic

├── util/
│   ├── Middleware/
│   │   ├── authMiddleware.js      # Auth & authorization
│   │   ├── ErrorMiddleware.js     # Error handler
│   │   └── NotFoundRoute.js       # 404 handler
│   │
│   ├── Security/
│   │   ├── hashing.js             # bcrypt utilities
│   │   ├── encryption.js          # AES-256-GCM encryption
│   │   ├── googleOAuth.js         # Google ID token verification
│   │   └── token.js               # Token generation/validation
│   │
│   ├── Enums/                    # Token & user enums
│   └── Res/                      # Response helpers & custom errors

config/
└── app.config.js                 # Loads environment variables (.env.dev)
```

## Prerequisites

- Node.js with ES module support
- A running MongoDB instance accessible via `DB_URI`
- A Google OAuth Client ID for verifying Google `idToken`s

## Installation

```bash
npm install
npm run dev
```

## Environment Variables

Environment variables are loaded by `config/app.config.js` from `config/.env.dev` (by default). A `config/.env.prod` file exists in the repo, but it is not loaded automatically unless you change the code.

Required variables:

- `SEVER_PORT`: Port the Express server listens on
- `DB_URI`: MongoDB connection string used by Mongoose
- `ENCRYPTION_SECRET_KEY`: Hex key for AES-256-GCM encryption (must be **32 bytes**, i.e. **64 hex characters**)
- `TOKEN_SIGNATURE_ADMIN_ACCESS`: JWT secret (hex) for **admin access tokens**
- `TOKEN_SIGNATURE_USER_ACCESS`: JWT secret (hex) for **user access tokens**
- `TOKEN_SIGNATURE_ADMIN_REFRESH`: JWT secret (hex) for **admin refresh tokens**
- `TOKEN_SIGNATURE_USER_REFRESH`: JWT secret (hex) for **user refresh tokens**
- `GOOGLE_CLIENT_ID`: Google OAuth Client ID used to verify `idToken`

## How to Run / How to Try

1. Start MongoDB and ensure `DB_URI` works.
2. Update `config/.env.dev` with your values.
3. Run the server:
   - `npm run dev`

The server attempts a DB connection on startup, then listens on `SEVER_PORT`.

## API Endpoints

All routes accept JSON bodies (`express.json()`) and live under these prefixes:

- `/auth`
- `/users`

### Auth (email/password)

#### `POST /auth/signup`

Create a user account (stores password as bcrypt hash and encrypts `phone`).

**Request body (JSON)** (minimum fields required by the Mongoose schema and service usage):

- `email` (string, required)
- `password` (string, required for `provider=system`)
- `phone` (string, encrypted before saving)
- `userName` (string, required)

Optional fields supported by the model:

- `role` (`user` or `admin`, default: `user`)
- `gender` (`male` or `female`, default: `male`)
- `DOB` (Date)
- `confirmEmail` (boolean, default: `false`)
- `profilePic` (string)
- `coverPics` (array of strings)
- `provider` (defaults to `system` if omitted)

**Response:** success object with the created user data (password is not returned).

#### `POST /auth/login`

Login with email/password and receive tokens.

**Request body (JSON):**

- `email`
- `password`

**Response includes:**

- `accessToken` (JWT, expires in `10m`)
- `refreshToken` (JWT, expires in `1y`)
- other user fields (password is excluded)

### Auth (Google / Gmail)

Both routes require verifying a Google `idToken`.

#### `POST /auth/signup/gmail`

Signup via Google `idToken`. If the email already exists:

- if the existing user uses `provider=system`, it throws a conflict error
- otherwise it logs in through the Google flow

**Request body (JSON):**

- `idToken`

#### `POST /auth/login/gmail`

Login via Google `idToken`. If the user doesn’t exist yet, it will create it via the Google signup flow.

**Request body (JSON):**

- `idToken`

**Important:** if `email_verified` is false in the verified Google payload, the API throws an unauthorized error.

### Protected User Routes

All protected endpoints require the `Authorization` header in the form:

- `Authorization: Bearer <token>`

#### `GET /users/`

Requires:

- `Authorization: Bearer <accessToken>`

Returns the authenticated user.

#### `POST /users/renew-token`

Requires:

- `Authorization: Bearer <refreshToken>`

Returns a new `accessToken` (along with the authenticated user data). The refresh token itself is not returned.

## Scripts

- `dev`: `node --watch ./src/main.js`

## Notes / Architecture Details

- **JWT verification depends on role-specific secrets.** The token’s `role` is decoded and used to select the correct JWT signature for verification (admin vs user, access vs refresh).
- **Phone encryption at rest:** `phone` is encrypted before saving, and decrypted automatically via the Mongoose schema getter when reading.
- **Password storage:** `password` is hashed with bcrypt and stored with `select: false` in the schema, so it is only selected explicitly during login.
- **Error format:** custom `ResponseError` instances are returned with:
    - `error`, `statusCode`, and optional `info`
