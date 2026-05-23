# Zuba House Stock Management — Backend API

Node.js + Express + PostgreSQL REST API for the React frontend.

## Architecture (MVC + Services)

```
Request → Route → Controller → Service → Model → PostgreSQL
                ↓
         Middleware (auth, validation, errors)
```

| Layer | Responsibility |
|--------|----------------|
| **routes** | URL mapping, attaches middleware |
| **controllers** | HTTP: read `req`, call service, send JSON |
| **services** | Business rules (stock checks, profit, Excel) |
| **models** | Parameterized SQL only |
| **middleware** | JWT auth, validation, global errors |
| **validations** | `express-validator` rules |

## Prerequisites

- Node.js 18+
- PostgreSQL 14+

## Installation

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials and JWT_SECRET
```

Create the database:

```sql
CREATE DATABASE zuba_stock_db;
```

Apply schema and seed admin user:

```bash
npm run db:schema
npm run db:seed
```

Default login (after seed):

- **Email:** `honorine@zubahouse.com`
- **Password:** `Password123!`

## Run the server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

API base URL: `http://localhost:5000/api`

Health check: `GET http://localhost:5000/health`

## Environment variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default `5000`) |
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port |
| `DB_NAME` | Database name |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | Secret for signing tokens |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `CLIENT_URL` | React app URL for CORS (e.g. `http://localhost:5173`) |

## Stock calculation (important)

Stock is **not** stored on `products`. It is computed as:

```
Current Stock = SUM(purchases.quantity) − SUM(sales.quantity)
```

## Profit formulas

- **Revenue** = `quantity sold × selling_price` (from product)
- **Cost (COGS)** = `quantity sold × purchase_price`
- **Gross profit** = Revenue − COGS
- **Net profit** = Gross profit − operating expenses

---

## API reference

All protected routes require header:

```
Authorization: Bearer <jwt_token>
```

Responses use shape: `{ success: true, data: { ... } }` or `{ success: false, message: "..." }`.

### Auth — `/api/auth`

| Method | Endpoint | Auth | Body |
|--------|----------|------|------|
| POST | `/login` | No | `{ email, password }` |
| POST | `/register` | No | `{ email, password, fullName }` |
| GET | `/me` | Yes | — |

### Products — `/api/products`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List products (query: `search`, `category`) — includes computed `stock` |
| GET | `/:id` | Single product |
| POST | `/` | Create product |
| PUT | `/:id` | Update product |
| DELETE | `/:id` | Delete product |

**Create body (camelCase):**

```json
{
  "name": "Premium Basmati Rice (25kg)",
  "sku": "ZHS-RIC-212",
  "category": "Grains",
  "purchasePrice": 28.75,
  "sellingPrice": 36.0
}
```

### Inventory — `/api/inventory`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Inventory list with `stock`, `status` (`in_stock`, `low_stock`, `out_of_stock`) |
| GET | `/low-stock` | Low stock products (query: `threshold`, default 75) |
| GET | `/overview` | Totals: units, value, low/out counts |

### Purchases — `/api/purchases`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List purchases with product info |
| GET | `/summary` | Totals (query: `from`, `to`) |
| GET | `/:id` | Single purchase |
| POST | `/` | Create purchase (increases stock) |
| DELETE | `/:id` | Delete purchase |

**Create body:**

```json
{
  "productId": "uuid",
  "quantity": 100,
  "pricePerUnit": 18.4,
  "purchaseDate": "2026-05-10"
}
```

### Sales — `/api/sales`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List sales with revenue |
| GET | `/summary` | Revenue, COGS, gross profit |
| GET | `/:id` | Single sale |
| POST | `/` | Create sale (validates stock) |
| DELETE | `/:id` | Delete sale |

**Create body:**

```json
{
  "productId": "uuid",
  "quantity": 42,
  "saleDate": "2026-05-12"
}
```

### Expenses — `/api/expenses`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List expenses |
| GET | `/summary` | Totals and top category |
| GET | `/:id` | Single expense |
| POST | `/` | Create expense |
| PUT | `/:id` | Update expense |
| DELETE | `/:id` | Delete expense |

**Create body:**

```json
{
  "category": "Logistics & freight",
  "amount": 4200,
  "expenseDate": "2026-05-03",
  "notes": "Optional note"
}
```

### Dashboard — `/api/dashboard`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | KPIs + monthly chart + top products (query: `from`, `to`, `months`) |

### Reports — `/api/reports`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/monthly` | Full monthly JSON report (query: `year`, `month` or `from`, `to`) |
| GET | `/monthly/export` | Download `.xlsx` (ExcelJS) |

---

## Postman testing

1. **Login** — `POST {{baseUrl}}/api/auth/login`  
   Save `data.token` from the response.

2. Set collection variable `token` and add header on other requests:  
   `Authorization: Bearer {{token}}`

3. Test flow:
   - Create products → record purchases → record sales → add expenses
   - `GET /api/inventory` to verify stock
   - `GET /api/dashboard` for KPIs
   - `GET /api/reports/monthly/export` for Excel file

`baseUrl` = `http://localhost:5000`

---

## React + Axios integration example

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Login
const { data } = await api.post('/auth/login', { email, password })
localStorage.setItem('token', data.data.token)

// Products
const products = await api.get('/products')
```

---

## Project structure

```
backend/
├── database/
│   ├── schema.sql
│   └── seed.sql
├── scripts/
│   ├── runSchema.js
│   └── seedAdmin.js
├── src/
│   ├── config/       # DB pool, env
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validations/
│   └── server.js
├── package.json
├── .env.example
└── README.md
```
