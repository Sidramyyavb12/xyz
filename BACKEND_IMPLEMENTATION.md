# Hardware Inventory - Backend Implementation Guide

## 🎉 Overview

This project now includes a complete **backend** implementation using:
- **Next.js App Router API Routes**
- **MongoDB** with **Mongoose ODM**
- **JWT Authentication** with access and refresh tokens
- **Full CRUD operations** for inventory management
- **Material flow tracking** (IN/OUT operations)

---

## 📦 Dependencies Added

The following packages have been added to support the backend:

### Production Dependencies
- `mongoose` - MongoDB ODM for data modeling
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation and verification

### Dev Dependencies
- `@types/bcryptjs` - TypeScript types for bcryptjs
- `@types/jsonwebtoken` - TypeScript types for jsonwebtoken

---

## 🗂️ Backend Structure

```
/home/user/webapp/
├── app/
│   └── api/
│       ├── auth/
│       │   ├── register/
│       │   │   └── route.ts          # POST /api/auth/register
│       │   ├── login/
│       │   │   └── route.ts          # POST /api/auth/login
│       │   └── refresh/
│       │       └── route.ts          # POST /api/auth/refresh
│       ├── users/
│       │   └── me/
│       │       └── route.ts          # GET /api/users/me
│       └── inventory/
│           ├── stock/
│           │   └── route.ts          # GET /api/inventory/stock
│           ├── flow/
│           │   └── route.ts          # GET /api/inventory/flow
│           └── items/
│               └── route.ts          # GET, POST, PUT, DELETE /api/inventory/items
├── lib/
│   ├── mongodb/
│   │   └── connection.ts             # MongoDB connection utility
│   ├── jwt.ts                        # JWT utilities
│   └── fetcher.ts                    # Updated with auth headers
├── models/
│   ├── User.ts                       # User model
│   ├── Inventory.ts                  # Inventory model
│   └── Flow.ts                       # Flow tracking model
├── middleware/
│   └── auth.ts                       # Authentication middleware
└── .env.local.example                # Environment variables template
```

---

## 🗄️ Database Models

### 1. User Model
```typescript
{
  name: string;
  email: string (unique, lowercase);
  password: string (hashed with bcrypt);
  role: 'LEARNER' | 'INSTRUCTOR' | 'CANDIDATE' | 'RECRUITER' | 'ADMIN';
  roles: string[];
  primaryRole: string;
  instructorRating?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. Inventory Model
```typescript
{
  code: string (unique, uppercase);
  name: string;
  category: string;
  size?: string;
  quantity: number (min: 0);
  price?: number;
  createdBy: ObjectId (User);
  updatedBy: ObjectId (User);
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. Flow Model
```typescript
{
  date: Date;
  code: string (uppercase);
  name: string;
  action: 'IN' | 'OUT';
  qty: number;
  note?: string;
  inventoryId: ObjectId (Inventory);
  userId: ObjectId (User);
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔌 API Endpoints

### Authentication Endpoints

#### 1. **Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "LEARNER" // Optional: LEARNER, INSTRUCTOR, CANDIDATE, RECRUITER
}
```

**Response (201)**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "LEARNER",
    "primaryRole": "LEARNER",
    "roles": ["LEARNER"]
  }
}
```

#### 2. **Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200)**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { /* same as register */ }
}
```

#### 3. **Refresh Token**
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200)**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 4. **Get Current User**
```http
GET /api/users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "LEARNER",
    "primaryRole": "LEARNER",
    "roles": ["LEARNER"],
    "createdAt": "2024-02-04T12:00:00.000Z"
  }
}
```

---

### Inventory Endpoints

#### 5. **Get All Stock**
```http
GET /api/inventory/stock
Authorization: Bearer {token}
```

**Response (200)**
```json
{
  "success": true,
  "data": [
    {
      "code": "HW001",
      "name": "Laptop Dell XPS 15",
      "category": "Computers",
      "size": "15 inch",
      "quantity": 10,
      "price": 1500
    }
  ]
}
```

#### 6. **Get Flow Records**
```http
GET /api/inventory/flow?limit=50&skip=0&action=IN
Authorization: Bearer {token}
```

**Query Parameters:**
- `limit` (optional, default: 100) - Number of records to return
- `skip` (optional, default: 0) - Number of records to skip
- `action` (optional) - Filter by 'IN' or 'OUT'

**Response (200)**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "date": "2024-02-04T12:00:00.000Z",
      "code": "HW001",
      "name": "Laptop Dell XPS 15",
      "action": "IN",
      "qty": 5,
      "note": "New material added"
    }
  ],
  "total": 25,
  "limit": 50,
  "skip": 0
}
```

#### 7. **Get/Search Items**
```http
GET /api/inventory/items?search=laptop&category=Computers
Authorization: Bearer {token}
```

**Query Parameters:**
- `search` (optional) - Search by name, code, or category
- `category` (optional) - Filter by category
- `code` (optional) - Get specific item by code

**Response (200)**
```json
{
  "success": true,
  "data": [/* inventory items */]
}
```

#### 8. **Add New Item**
```http
POST /api/inventory/items
Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "HW002",
  "name": "Monitor LG 27 inch",
  "category": "Displays",
  "size": "27 inch",
  "quantity": 15,
  "price": 350
}
```

**Response (201)**
```json
{
  "success": true,
  "message": "Item created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "code": "HW002",
    "name": "Monitor LG 27 inch",
    "category": "Displays",
    "quantity": 15,
    "price": 350
  }
}
```

**Note:** If item with same code exists, it updates the quantity and creates a flow record.

#### 9. **Update Item**
```http
PUT /api/inventory/items
Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "HW002",
  "name": "Monitor LG 27 inch 4K",
  "quantity": 20,
  "price": 450
}
```

**Response (200)**
```json
{
  "success": true,
  "message": "Item updated successfully",
  "data": {/* updated item */}
}
```

#### 10. **Remove/Delete Item**
```http
DELETE /api/inventory/items?code=HW002&quantity=5&note=Sold to customer
Authorization: Bearer {token}
```

**Query Parameters:**
- `code` (required) - Item code to remove
- `quantity` (optional) - Amount to remove (removes all if not specified)
- `note` (optional) - Note for the flow record

**Response (200)**
```json
{
  "success": true,
  "message": "Item quantity reduced successfully",
  "data": {/* updated item */}
}
```

---

## 🔐 Authentication Flow

### Token Management

1. **Access Token**: Expires in 1 hour
2. **Refresh Token**: Expires in 7 days

### Authentication Workflow

1. User logs in/registers → Receives access token + refresh token
2. Frontend stores tokens in localStorage
3. All API requests include: `Authorization: Bearer {accessToken}`
4. If access token expires (401), use refresh token to get new access token
5. If refresh token expires, user must log in again

### Middleware Protection

All inventory endpoints are protected with JWT authentication. The middleware:
- Extracts token from Authorization header
- Verifies token validity
- Attaches user info to request
- Returns 401 if unauthorized

---

## ⚙️ Environment Setup

### Step 1: Copy Environment Template

```bash
cp .env.local.example .env.local
```

### Step 2: Configure Environment Variables

Edit `.env.local`:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/hardware-inventory
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hardware-inventory?retryWrites=true&w=majority

# JWT Secrets (CHANGE THESE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-change-this

# API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### Step 3: Install Dependencies

```bash
npm install
```

This will install:
- `mongoose`
- `bcryptjs`
- `jsonwebtoken`
- Type definitions

---

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

---

## 🗃️ MongoDB Setup

### Option 1: Local MongoDB

1. Install MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   # Start MongoDB service from Services panel
   ```
3. Use connection string in `.env.local`:
   ```
   MONGODB_URI=mongodb://localhost:27017/hardware-inventory
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (Free tier available)
3. Get connection string from "Connect" button
4. Add connection string to `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hardware-inventory?retryWrites=true&w=majority
   ```

---

## 🧪 Testing the API

### Using cURL

```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get stock (with token)
curl -X GET http://localhost:3000/api/inventory/stock \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Add item
curl -X POST http://localhost:3000/api/inventory/items \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "TEST001",
    "name": "Test Item",
    "category": "Test",
    "quantity": 10,
    "price": 100
  }'
```

### Using Postman

1. Import the API endpoints
2. Create an environment variable for `baseUrl`: `http://localhost:3000`
3. Add `accessToken` variable after login
4. Use `{{baseUrl}}` and `{{accessToken}}` in requests

---

## 🔄 Flow Tracking

Every inventory operation automatically creates a flow record:

- **Adding items** → Creates "IN" flow
- **Removing/deleting items** → Creates "OUT" flow
- Each flow includes: date, code, name, action, quantity, note, user

This provides complete audit trail of all inventory movements.

---

## 🛡️ Security Features

1. **Password Hashing**: Passwords are hashed using bcrypt (10 salt rounds)
2. **JWT Authentication**: Secure token-based authentication
3. **Token Expiration**: Access tokens expire in 1 hour
4. **Protected Routes**: All inventory endpoints require authentication
5. **Input Validation**: Request validation on all endpoints
6. **Error Handling**: Comprehensive error handling with appropriate status codes

---

## 📊 Data Validation

### User Registration
- Name: Required
- Email: Required, valid email format, unique
- Password: Required, minimum 6 characters

### Inventory Items
- Code: Required, unique, converted to uppercase
- Name: Required
- Category: Required
- Quantity: Default 0, cannot be negative
- Price: Optional, cannot be negative

### Flow Records
- Date: Required, defaults to now
- Code: Required
- Name: Required
- Action: Required, must be 'IN' or 'OUT'
- Quantity: Required, minimum 1

---

## 🎯 Next Steps

1. ✅ Backend API fully implemented
2. ✅ Authentication system with JWT
3. ✅ MongoDB models and connection
4. ✅ Inventory CRUD operations
5. ✅ Flow tracking system

### Recommended Enhancements

- [ ] Add pagination to stock endpoint
- [ ] Add filtering and sorting options
- [ ] Implement rate limiting
- [ ] Add email verification
- [ ] Add password reset functionality
- [ ] Implement role-based access control (RBAC)
- [ ] Add API documentation with Swagger
- [ ] Add unit and integration tests
- [ ] Implement real-time updates with WebSockets
- [ ] Add file upload for bulk import
- [ ] Export functionality (CSV, Excel)

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

```
Error: MongooseServerSelectionError: connect ECONNREFUSED
```

**Solution:**
- Ensure MongoDB is running
- Check connection string in `.env.local`
- For Atlas: Check IP whitelist and credentials

### JWT Token Issues

```
Error: Invalid or expired token
```

**Solution:**
- Check JWT_SECRET in `.env.local`
- Ensure token is being sent in Authorization header
- Token may have expired, use refresh token

### Module Not Found

```
Error: Cannot find module 'mongoose'
```

**Solution:**
```bash
npm install
```

---

## 📚 Resources

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [JWT Documentation](https://jwt.io/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## 🤝 Contributing

Feel free to enhance the backend with additional features!

---

## 📝 License

MIT License - Feel free to use this in your projects!
