# LUXE Shopping Agent

AI-powered full-stack ecommerce application with:
- Customer storefront
- Admin dashboard
- JWT cookie-based authentication
- Stripe checkout
- Redis-backed sessions/caching
- Vector search + LLM shopping assistant

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Overview](#api-overview)
- [AI Embedding Seeding Script](#ai-embedding-seeding-script)
- [Deployment Notes](#deployment-notes)
- [Contributing](#contributing)
- [License](#license)

## Overview

LUXE Shopping Agent is a monorepo with an Express backend and a React + Vite frontend.  
It supports product discovery, cart and coupon flows, admin product management, analytics, Stripe checkout, and an AI assistant that recommends products using Pinecone vector search plus Groq LLM responses.

## Key Features

- User signup/login/logout with access + refresh tokens in HTTP-only cookies
- Role-based access control (`user` / `admin`)
- Product catalog with featured items, recommendations, and category filtering
- Cart with size-aware line items and quantity management
- Coupon validation and automatic reward coupon creation
- Stripe Checkout integration with order creation on payment success
- Admin dashboard:
  - Product CRUD
  - Featured toggle
  - Sales analytics and revenue charts
- AI shopping assistant:
  - Intent analysis
  - Query embedding generation (NVIDIA embeddings API)
  - Vector retrieval from Pinecone
  - Streaming conversational response (SSE) from Groq
  - Structured extraction of recommended/cart/compare product IDs

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Redis (`ioredis`)
- JWT (`jsonwebtoken`)
- Stripe SDK
- Cloudinary SDK
- Pinecone SDK + REST
- Groq SDK

### Frontend
- React 19 + Vite
- MUI + Emotion
- Zustand (state)
- React Router
- Axios
- Recharts

### AI + Data Tools
- NVIDIA Embeddings API (`nvidia/nv-embedqa-e5-v5`)
- Pinecone vector index
- Python utility script for bulk vector seeding

## Project Structure

```text
shopping-agent/
├── backend/
│   ├── controllers/
│   ├── lib/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   └── store/
│   └── vite.config.js
├── scripts/
│   ├── requirements.txt
│   └── seed-embeddings.py
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB instance
- Redis instance
- Stripe account + API key
- Cloudinary account
- Groq API key
- NVIDIA API key (for embeddings)
- Pinecone account + index

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd shopping-agent

npm install
cd frontend && npm install
cd ..
```

### 2. Configure environment variables

Create a `.env` file in the repository root and set all required keys listed below.

### 3. Run locally (2 terminals)

Terminal 1 (backend):

```bash
npm run dev
```

Terminal 2 (frontend):

```bash
cd frontend
npm run dev
```

Default local URLs:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5001`

## Environment Variables

Define these in `.env` at the repo root unless noted otherwise.

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Backend port (default `5001`) |
| `MONGO_DB_URI` | Yes | MongoDB connection string |
| `REDIS_URL` | Yes | Redis connection URL |
| `ACCESS_TOKEN_SECRET` | Yes | JWT secret for access token |
| `REFRESH_TOKEN_SECRET` | Yes | JWT secret for refresh token |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key |
| `CLIENT_URL` | Yes | Frontend base URL for Stripe success/cancel redirects |
| `GROQ_API_KEY` | Yes | Groq API key for chat and intent services |
| `NVIDIA_API_KEY` | Yes | NVIDIA embeddings API key |
| `PINECONE_API_KEY` | Yes | Pinecone API key |
| `PINECONE_INDEX` | Yes | Pinecone index name |
| `VITE_API_PROXY_TARGET` | No | Frontend dev proxy target (default `http://localhost:5001`) |

## Available Scripts

### Root (`package.json`)

- `npm run dev` - Start backend server
- `npm run start` - Start backend server
- `npm run build` - Install deps and build frontend bundle

### Frontend (`frontend/package.json`)

- `npm run dev` - Start Vite dev server
- `npm run build` - Build frontend for production
- `npm run preview` - Preview built frontend
- `npm run lint` - Run ESLint

## API Overview

Base path: `/api`

### Auth
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh-token`
- `GET /auth/profile` (protected)

### Products
- `GET /products/all` (public)
- `GET /products/featured` (public)
- `GET /products/category/:category` (public)
- `GET /products/recommendations` (public)
- `GET /products/:id` (public)
- `GET /products` (admin)
- `POST /products` (admin)
- `PUT /products/:id` (admin)
- `PATCH /products/:id` (admin feature toggle)
- `DELETE /products/:id` (admin)

### Cart, Coupons, Payments
- `GET /cart` (protected)
- `POST /cart` (protected)
- `PUT /cart/:id` (protected)
- `DELETE /cart` (protected)
- `GET /coupons` (protected)
- `POST /coupons/validate` (protected)
- `POST /payments/create-checkout-session` (protected)
- `POST /payments/checkout-success` (protected)

### Analytics + AI Chat
- `GET /analytics` (admin)
- `POST /chat` (SSE streaming response)

## AI Embedding Seeding Script

The script `scripts/seed-embeddings.py` can bulk-index existing products from MongoDB into Pinecone.

### Setup

```bash
cd scripts
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python seed-embeddings.py
```

The script expects:
- `MONGO_DB_URI`
- `NVIDIA_API_KEY`
- `PINECONE_API_KEY`
- `PINECONE_INDEX` (optional fallback default exists in script)

## Deployment Notes

- Configure all environment variables in your deployment platform.
- Ensure MongoDB, Redis, Cloudinary, Stripe, Groq, NVIDIA, and Pinecone credentials are valid in production.
- If deploying frontend and backend together from this repo, verify backend static asset serving paths in `backend/server.js` match your built frontend output location.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with clear commit messages
4. Run lint/build checks
5. Open a pull request

## License

No license file is currently included.  
Add a `LICENSE` file if you intend to distribute this project publicly.
