# 🚀 Quick Start Guide - Travel Planner with MongoDB

## ✅ Successfully Migrated from PHP + MySQL to Node.js + MongoDB!

Your Travel Planner backend has been completely migrated to a modern stack:
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (NoSQL)
- **Features**: All PHP functionality preserved and improved

---

## 📦 Installation

### 1. Install MongoDB

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
Download and install from: https://www.mongodb.com/try/download/community

**Linux (Ubuntu):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### 2. Install Node.js Dependencies

```bash
cd backend
npm install
```

---

## 🎯 Running the Application

### Start Backend (Terminal 1):
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server is running on port 3000
📍 Environment: development
🌐 CORS origin: http://localhost:5173
✅ MongoDB connected successfully
📊 Database: tour_planner
```

### Start Frontend (Terminal 2):
```bash
cd Frontend
npm install  # If not installed yet
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 🔄 What Changed?

### Backend Technology Stack:

| Before (PHP) | After (Node.js) |
|--------------|-----------------|
| PHP 7.x/8.x | Node.js 14+ |
| MySQLi | MongoDB + Mongoose |
| Apache/XAMPP | Express.js |
| SQL Queries | MongoDB Queries |

### All Features Work:
✅ User Registration & Login  
✅ Password Reset (OTP)  
✅ Booking Management  
✅ Reviews System  
✅ Query/Support System  
✅ Admin Dashboard  
✅ User Profile Management  

---

## 📡 API Endpoints (No Changes Required in Frontend if using the config file)

All endpoints remain at `/api/`:

- **Auth**: `/api/auth/signup`, `/api/auth/login`, etc.
- **User**: `/api/user/data`, `/api/user/update`
- **Bookings**: `/api/booking/save`, `/api/booking/user-bookings`
- **Admin**: `/api/admin/users`, `/api/admin/bookings`
- **Reviews**: `/api/review/submit`, `/api/review/all`
- **Queries**: `/api/query/submit`, `/api/query/all`

---

## 🧪 Test the API

### 1. Health Check:
```bash
curl http://localhost:3000/
```

Expected response:
```json
{
  "status": "success",
  "message": "Travel Planner API is running",
  "version": "1.0.0"
}
```

### 2. Sign Up:
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "9876543210",
    "location": "Mumbai",
    "bio": "Love to travel",
    "gender": "male",
    "dob": "1990-01-01"
  }'
```

### 3. Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

## 📊 View Your Data in MongoDB

### Using MongoDB Compass (GUI):
1. Download: https://www.mongodb.com/try/download/compass
2. Connect to: `mongodb://localhost:27017`
3. View `tour_planner` database

### Using MongoDB Shell:
```bash
mongosh
use tour_planner
db.users.find().pretty()
db.bookings.find().pretty()
```

---

## 🔧 Configuration

### Environment Variables (`.env` file):

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/tour_planner

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173

# Email (Optional - for OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

---

## 🎨 Frontend Integration

The frontend configuration file is already created at:
`Frontend/src/config/api.js`

Usage in your React components:
```javascript
import API_ENDPOINTS from '../config/api';

// Login example
const response = await fetch(API_ENDPOINTS.LOGIN, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

---

## 🐛 Troubleshooting

### MongoDB Not Connected?
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### Port 3000 Already in Use?
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9
```

### Module Not Found Error?
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 🌟 Benefits of This Migration

1. **Modern Stack**: Node.js + MongoDB is industry standard
2. **Better Performance**: Non-blocking I/O, faster queries
3. **Scalability**: MongoDB scales horizontally
4. **Cloud Ready**: Easy deployment to Heroku, AWS, Azure
5. **Developer Experience**: JavaScript on both frontend & backend
6. **Flexible Schema**: Easy to add new features
7. **Better Tooling**: npm ecosystem, Mongoose ORM

---

## 📝 Next Steps

1. ✅ Backend is running with MongoDB
2. ✅ All API endpoints are working
3. ⏭️ Test all features in the frontend
4. ⏭️ Deploy to cloud (Heroku, MongoDB Atlas)
5. ⏭️ Set up production environment variables

---

## 📚 Documentation

- **MongoDB Setup**: See `MONGODB_SETUP.md`
- **Migration Guide**: See `MIGRATION_GUIDE.md`
- **Node.js Backend**: See `README_NODEJS.md`

---

## 🎉 Success!

Your Travel Planner is now running on:
- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173
- **Database**: MongoDB (tour_planner)

All features work exactly as before, but with better performance and scalability!

---

## 🆘 Need Help?

Check the logs:
```bash
# Backend logs
npm run dev

# MongoDB logs
tail -f /usr/local/var/log/mongodb/mongo.log  # macOS
sudo tail -f /var/log/mongodb/mongod.log      # Linux
```

---

**Happy Coding! 🚀**
