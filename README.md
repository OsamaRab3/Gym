# GYM E-commerce API

A production-ready e-commerce API for a gym equipment store, built with Node.js, Express, and Prisma (MySQL).

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (ADMIN/USER)
- **Products**
  - CRUD, multiple images per product, primary image selection
  - Ranking system and search endpoint
- **Categories**
  - CRUD with image upload
- **Orders**
  - Create orders with delivery fee accumulation by province and weight
  - Status management (admin)
- **Provinces & Delivery Fees**
  - Province CRUD and per-product delivery fees
- **Coupons & Promotions**
  - Create, use coupon, track usage, discounted products listing
  - Product-based ads (offers)
- **Customer Support**
  - Contact form email
- **Localization**
  - Arabic and English via query `?lang=ar|en` (default `ar`)

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Database**: MySQL via Prisma
- **Auth**: JWT
- **Uploads**: Multer (stores under `src/uploads`)

## 📦 Scripts

- `npm run dev` → start server (node server.js)
- `npm start` → start with nodemon (development auto-reload)

## 🗄️ Database

Prisma is configured for MySQL. Ensure your `.env` contains a valid `DATABASE_URL`.

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DBNAME?schema=public"
```

Key models: `User`, `Product` (with `ProductImage` and `ProductTranslation`), `Category`, `Order`, `OrderItem`, `Province`, `DeliveryFee`, `Coupon`, `DiscountedProduct`, `CouponUsage`, `Ad`.

![Database Schema](./image.png)

## 🔧 Setup

1. Clone repo and install dependencies:
   - `npm install`
2. Create `.env` in project root (see below) and ensure MySQL is running.
3. Generate Prisma client and run migrations:
   - `npx prisma generate`
   - `npx prisma migrate dev`
4. Start server:
   - `npm run dev` (or `npm start` for nodemon)

Server base URL: `http://localhost:9000`. Health check: `GET /` returns a localized welcome message. Add `?lang=en` or `?lang=ar` to localize responses.

## 🔐 Authentication

- Use `Authorization: Bearer <token>` header.
- Role enforcement via `ADMIN`/`USER`. Admin-only endpoints are noted below.

## 🖼️ File Uploads

- Use `multipart/form-data` with field name `images`.
- Max 5 files per request by default; 5MB per file; only image types (jpg, png, gif, webp, svg, bmp).
- Files are stored under `src/uploads/`.

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | /api/auth/login | User login | No | - |

### Categories
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | /api/categories | List categories | No | - |
| GET | /api/categories/:id | Get category by ID | No | - |
| POST | /api/categories | Create category (with `images`) | Yes | ADMIN |
| PUT | /api/categories/:id | Update category (with `images`) | Yes | ADMIN |
| DELETE | /api/categories/:id | Delete category | Yes | ADMIN |

### Products
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | /api/products | List products | No | - |
| GET | /api/products/:id | Get product by ID | No | - |
| GET | /api/products/search | Search products | No | - |
| POST | /api/products | Create product (with `images`) | Yes | ADMIN |
| PUT | /api/products/:id | Update product (with `images`) | Yes | ADMIN |
| DELETE | /api/products/:id | Delete product | Yes | ADMIN |
| PATCH | /api/products/:id/rank | Update product rank | Yes | ADMIN |
| PATCH | /api/products/:productId/images/:imageId/set-primary | Set primary image | Yes | ADMIN |

### Orders
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | /api/orders/provinces/:provinceId | Create order | No | - |
| GET | /api/orders | List all orders | Yes | ADMIN |
| GET | /api/orders/:id | Get order by ID | No | - |
| PATCH | /api/orders/:id/status | Update order status | Yes | ADMIN |

### Coupons
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | /api/coupons | List coupons | Yes | ADMIN |
| POST | /api/coupons/products | Create coupon for product | Yes | ADMIN |
| POST | /api/coupons/use | Apply/use coupon | No | - |
| GET | /api/coupons/discounted-products | List discounted products | No | - |
| GET | /api/coupons/:id | Get coupon by ID | Yes | ADMIN |
| DELETE | /api/coupons/:id | Delete coupon | Yes | ADMIN |

### Provinces
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | /api/provinces | List provinces | No | - |
| GET | /api/provinces/:id | Get province by ID | No | - |
| POST | /api/provinces | Create province | Yes | ADMIN |
| PUT | /api/provinces/:id | Update province | Yes | ADMIN |
| DELETE | /api/provinces/:id | Delete province | Yes | ADMIN |
| POST | /api/provinces/:provinceId/products/:productId/delivery-fee | Upsert delivery fee | Yes | ADMIN |
| DELETE | /api/provinces/:provinceId/products/:productId/delivery-fee | Remove delivery fee | Yes | ADMIN |

### Ads (Promotions)
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | /api/ad/:productId/products | Create product ad | Yes | ADMIN |
| GET | /api/ad/:id | Get ad by ID | No | - |
| DELETE | /api/ad/:id | Delete ad | Yes | ADMIN |

### Contact Us
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | /api/contact | Submit contact form | No | - |

## 📝 Environment Variables

Create `.env` in the project root:

```env
# Server
PORT=3000
NODE_ENV=development

# Database (Prisma uses this)
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DBNAME"

# Optional legacy (used by src/config/environment.js)
MYSQL_URL="mysql://USER:PASSWORD@HOST:PORT/DBNAME"

# Auth
JWT_SECRET=your_jwt_secret
EXPIRESIN=7d

# Email (contact form)
GMAIL_Admin=your_email@gmail.com
PASS_EMAIL=your_app_password
```

## 🌍 Localization

- Pass `?lang=en` or `?lang=ar` on any request to localize messages. Default is `ar`.


