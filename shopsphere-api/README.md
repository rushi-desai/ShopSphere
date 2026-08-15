# ShopSphere API

ShopSphere API is the backend service for an e-commerce platform built with TypeScript, Express, Prisma, and PostgreSQL. It includes authentication, product catalog management, cart operations, order creation, payments, reviews, and address management with role-based access control.

## Features

- Product catalog and category management
- User registration and login with JWT authentication
- Role-based authorization for `ADMIN` and `CUSTOMER`
- Cart management with add/update/remove item flows
- Order creation and status tracking
- Payment creation and admin payment updates
- Address management per user
- Product reviews with admin moderation tools
- Prisma ORM with PostgreSQL and migration-based schema versioning
- Input validation with Zod

## Tech stack

- Node.js
- TypeScript
- Express 5
- Prisma ORM
- PostgreSQL
- JWT for authentication
- Zod for validation
- Docker support for containerized API deployment

## Project structure

```text
shopsphere-api/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   └── utils/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── generated/
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
├── prisma.config.ts
├── .env
├── README.md
└── ...
```

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL database
- Optional: Docker and Docker Compose

## Environment variables

Create a `.env` file in the project root with values similar to:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/shopsphere"
JWT_SECRET="your_super_secret_key"
PORT=3000
```

Notes:
- `DATABASE_URL` must point to a running PostgreSQL instance.
- `JWT_SECRET` is required for protected route authentication.
- `PORT` defaults to `3000` if omitted.

## Installation

```bash
npm install
```

## Database setup

Generate the Prisma client and apply migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

For local schema changes during development:

```bash
npx prisma migrate dev --name <migration_name>
```

## Running the app

### Development mode

```bash
npm run dev
```

### Production build

```bash
npm run build
npm start
```

The server starts on the port defined by `PORT` or defaults to `3000`.

## Docker

This project includes a basic Docker setup. The current container config starts the API container and reads environment variables from `.env`:

```bash
docker compose up --build
```

> The Docker setup here runs the API service; you still need a reachable PostgreSQL database configured through `DATABASE_URL`.

## API endpoints

Base URL:

```text
http://localhost:3000
```

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Products

```http
GET /api/products
GET /api/products/:id
POST /api/products          # ADMIN only
PATCH /api/products/:id     # ADMIN only
DELETE /api/products/:id    # ADMIN only
```

### Categories

```http
GET /api/categories
GET /api/categories/:id
POST /api/categories        # ADMIN only
PATCH /api/categories/:id   # ADMIN only
DELETE /api/categories/:id  # ADMIN only
```

### Cart

```http
GET /api/cart
POST /api/cart/items
PATCH /api/cart/items/:id
DELETE /api/cart/items/:id
```

### Orders

```http
POST /api/orders
GET /api/orders
GET /api/orders/:id
PATCH /api/orders/:id/status   # ADMIN only
```

### Addresses

```http
POST /api/addresses
GET /api/addresses
PATCH /api/addresses/:id
DELETE /api/addresses/:id
```

### Reviews

```http
GET /api/reviews/product/:productId
POST /api/reviews/product/:productId
PATCH /api/reviews/:id
DELETE /api/reviews/:id
DELETE /api/reviews/admin/:id          # ADMIN only
PATCH /api/reviews/admin/:id/hide     # ADMIN only
```

### Payments

```http
POST /api/payments
GET /api/payments/order/:id
PATCH /api/payments/:id   # ADMIN only
```

### Health checks

```http
GET /health
GET /test
```

## Authentication

Protected endpoints require a bearer token:

```http
Authorization: Bearer <jwt_token>
```

After login, use the returned JWT in the `Authorization` header for access to authenticated routes.

## Scripts

```json
{
  "dev": "tsx watch src/server.ts",
  "build": "tsc -b",
  "start": "node dist/server.js"
}
```

## Database model summary

The Prisma schema includes these main entities:

- `User`
- `Address`
- `Category`
- `Product`
- `Cart` / `CartItem`
- `Order` / `OrderItem`
- `Review`
- `Payment`

The schema is defined in [prisma/schema.prisma](prisma/schema.prisma).

## Notes

- Validation is centralized in `src/utils/validators`.
- Route handling follows the pattern: `routes -> controllers -> services`.
- The app uses Prisma with a PostgreSQL adapter (`@prisma/adapter-pg`).

## License

This project currently does not include a license file.
