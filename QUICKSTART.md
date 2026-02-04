# 🚀 Quick Start Guide - Hardware Inventory Backend

## Prerequisites

- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account
- Git

## 1️⃣ Install Dependencies

```bash
npm install
```

This will install all required packages including:
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication

## 2️⃣ Set Up Environment Variables

The `.env.local` file has been created for you with default values.

**For Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/hardware-inventory
```

**For MongoDB Atlas (Cloud):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Replace in `.env.local`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hardware-inventory?retryWrites=true&w=majority
```

**⚠️ IMPORTANT - Change JWT Secrets:**

Generate secure secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Update in `.env.local`:
```env
JWT_SECRET=your-generated-secret-here
JWT_REFRESH_SECRET=your-generated-refresh-secret-here
```

## 3️⃣ Start MongoDB (if using local)

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Windows:**
Start MongoDB service from Services panel

## 4️⃣ Run Development Server

```bash
npm run dev
```

Server will start at: http://localhost:3000

## 5️⃣ Test the API

### Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the `token` from the response!

### Get Current User

```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Add Inventory Item

```bash
curl -X POST http://localhost:3000/api/inventory/items \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "LAP001",
    "name": "Dell Laptop",
    "category": "Computers",
    "quantity": 10,
    "price": 1200
  }'
```

### Get All Stock

```bash
curl -X GET http://localhost:3000/api/inventory/stock \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Flow Records

```bash
curl -X GET http://localhost:3000/api/inventory/flow \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📚 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/users/me` - Get current user

### Inventory
- `GET /api/inventory/stock` - Get all stock
- `GET /api/inventory/flow` - Get flow records (IN/OUT)
- `GET /api/inventory/items` - Search/filter items
- `POST /api/inventory/items` - Add new item
- `PUT /api/inventory/items` - Update item
- `DELETE /api/inventory/items` - Remove item

## 🔐 Authentication

All inventory endpoints require authentication:

```javascript
headers: {
  'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
  'Content-Type': 'application/json'
}
```

Tokens expire after 1 hour. Use refresh token to get a new access token.

## 📖 Full Documentation

See `BACKEND_IMPLEMENTATION.md` for complete API documentation.

## 🐛 Troubleshooting

### MongoDB Connection Error

```
MongooseServerSelectionError: connect ECONNREFUSED
```

**Fix:**
- Make sure MongoDB is running
- Check `MONGODB_URI` in `.env.local`

### Module Not Found

```
Cannot find module 'mongoose'
```

**Fix:**
```bash
npm install
```

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Fix:**
Kill the process using port 3000:
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## 🎉 Success!

Your Hardware Inventory backend is now running!

Visit: http://localhost:3000

## Next Steps

1. ✅ Backend is ready
2. ✅ Frontend is ready
3. Test the application in browser
4. Add more features as needed

## 📞 Support

Check `BACKEND_IMPLEMENTATION.md` for detailed documentation and API reference.
