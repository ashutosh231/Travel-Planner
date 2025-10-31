# 🚀 Netlify Deployment Guide for Travel Planner

## Prerequisites Completed ✅

1. ✅ Netlify Functions setup (`netlify/functions/api.js`)
2. ✅ Netlify configuration (`netlify.toml`)
3. ✅ serverless-http installed
4. ✅ Frontend environment variables updated
5. ✅ Root package.json created

---

## 📋 Deployment Steps

### Step 1: Setup MongoDB Atlas (FREE 512MB)

1. **Go to:** https://www.mongodb.com/cloud/atlas
2. **Sign up** for free account
3. **Create Free Cluster (M0):**
   - Click "Build a Database"
   - Choose "FREE" shared cluster
   - Select region closest to you
   - Name: `TravelPlannerCluster`
   - Click "Create Cluster"

4. **Create Database User:**
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Username: `travelplanner`
   - Password: Generate a secure password (SAVE THIS!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

5. **Setup Network Access:**
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

6. **Get Connection String:**
   - Go back to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Driver: Node.js, Version: 5.5 or later
   - Copy the connection string:
   ```
   mongodb+srv://travelplanner:<password>@cluster.mongodb.net/tour_planner?retryWrites=true&w=majority
   ```
   - **Important:** Replace `<password>` with your actual password
   - **Important:** Change `test` to `tour_planner` in the connection string

**Example Connection String:**
```
mongodb+srv://travelplanner:YourSecurePassword123@cluster.mongodb.net/tour_planner?retryWrites=true&w=majority
```

---

### Step 2: Deploy to Netlify

#### Option A: Using Netlify CLI (Recommended)

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Login to Netlify:**
```bash
netlify login
```

3. **Initialize Netlify Site:**
```bash
cd /Users/ashutoshkumar/Desktop/Travel-Planner
netlify init
```

Follow the prompts:
- Create & configure a new site
- Choose your team
- Site name: `travel-planner-app` (or your preferred name)
- Build command: (auto-detected from netlify.toml)
- Deploy path: (auto-detected from netlify.toml)

4. **Set Environment Variables:**
```bash
# Replace with your actual MongoDB connection string
netlify env:set MONGODB_URI "mongodb+srv://travelplanner:YourPassword@cluster.mongodb.net/tour_planner"

# Generate a random secret key for JWT
netlify env:set JWT_SECRET "your-super-secret-jwt-key-min-32-characters-long"

# Email configuration
netlify env:set EMAIL_USER "adiashuto30@gmail.com"
netlify env:set EMAIL_PASSWORD "fiiq flty ifrz zmwn"
netlify env:set EMAIL_FROM "Travel Planner <adiashuto30@gmail.com>"

# Environment
netlify env:set NODE_ENV "production"
```

5. **Deploy:**
```bash
netlify deploy --prod
```

---

#### Option B: Using Netlify Dashboard (Easier for Beginners)

1. **Go to:** https://app.netlify.com/signup
2. **Sign up** with GitHub (recommended)
3. **Import Project:**
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub"
   - Authorize Netlify to access your GitHub
   - Select your repository: `AryanCodeWizard/Travel-Planner`

4. **Configure Build Settings:**
   - Site name: `travel-planner-app` (or your preferred name)
   - Build command: `cd Frontend && npm install && npm run build` (auto-detected)
   - Publish directory: `Frontend/dist` (auto-detected)
   - Functions directory: `netlify/functions` (auto-detected)
   - Click "Show advanced" → "New variable"

5. **Add Environment Variables:**
   
   Click "Add environment variable" for each:

   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | Your MongoDB connection string from Step 1 |
   | `JWT_SECRET` | Generate random 32+ character string |
   | `EMAIL_USER` | `adiashuto30@gmail.com` |
   | `EMAIL_PASSWORD` | `fiiq flty ifrz zmwn` |
   | `EMAIL_FROM` | `Travel Planner <adiashuto30@gmail.com>` |
   | `NODE_ENV` | `production` |

6. **Deploy Site:**
   - Click "Deploy site"
   - Wait 3-5 minutes for build to complete
   - Your site will be live at: `https://your-site-name.netlify.app`

---

### Step 3: Create Admin User in MongoDB

After deployment, you need an admin account:

1. **Go to MongoDB Atlas Dashboard**
2. **Browse Collections:**
   - Click "Database" → "Browse Collections"
   - Database: `tour_planner`
   - Collection: `users`
   - Click "Insert Document"

3. **Insert Admin Document:**

Switch to JSON view and paste:

```json
{
  "name": "Admin",
  "email": "admin@travelplanner.com",
  "hashed_password": "$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
  "phone": "+1234567890",
  "location": "Admin Office",
  "bio": "System Administrator",
  "gender": "male",
  "dob": "1990-01-01",
  "profile_photo": null,
  "is_admin": true,
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

**Note:** The hashed password above equals `admin123`. You should change this after first login!

4. **Click "Insert"**

---

### Step 4: Test Your Deployment

1. **Visit your site:** `https://your-site-name.netlify.app`

2. **Test User Features:**
   - ✅ Sign up new user
   - ✅ Login
   - ✅ Browse destinations
   - ✅ Create booking
   - ✅ Submit review
   - ✅ Contact form/query

3. **Test Admin Features:**
   - ✅ Login as admin (admin@travelplanner.com / admin123)
   - ✅ View dashboard
   - ✅ Manage users
   - ✅ Manage bookings
   - ✅ View analytics

4. **Test Email Notifications:**
   - ✅ Password reset
   - ✅ Booking confirmation
   - ✅ Booking status updates

---

## 🎯 Your Site is LIVE!

**Site URL:** `https://your-site-name.netlify.app`

**Admin Login:**
- Email: `admin@travelplanner.com`
- Password: `admin123`

**Features:**
- ✅ Auto-deploys on git push
- ✅ HTTPS enabled
- ✅ Global CDN
- ✅ Serverless functions
- ✅ MongoDB Atlas database

---

## 🔧 Troubleshooting

### Build Fails:
1. Check build logs in Netlify dashboard
2. Verify all environment variables are set
3. Try "Clear cache and deploy site"

### Database Connection Error:
1. Verify MONGODB_URI in environment variables
2. Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
3. Verify database user has correct permissions

### Functions Timeout:
Add to netlify.toml:
```toml
[functions]
  timeout = 30
```

### Email Not Sending:
1. Verify EMAIL_USER and EMAIL_PASSWORD in environment variables
2. Check Gmail app password is correct
3. Ensure "Less secure app access" is enabled (if using regular password)

---

## 📊 Free Tier Limits

**Netlify Free Tier:**
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ 125,000 function requests/month
- ✅ Unlimited sites
- ✅ Custom domain support
- ✅ HTTPS included

**MongoDB Atlas Free Tier:**
- ✅ 512MB storage
- ✅ Shared RAM
- ✅ 100 max connections
- ✅ No credit card required

---

## 🚀 Next Steps

1. **Custom Domain (Optional):**
   - Buy domain from Namecheap, GoDaddy, etc.
   - Add to Netlify: Site settings → Domain management

2. **Environment-Specific Config:**
   - Create staging environment
   - Use branch deploys for testing

3. **Monitoring:**
   - Enable Netlify Analytics
   - Setup error tracking (Sentry)
   - Monitor function logs

4. **Security:**
   - Change admin password
   - Rotate JWT secret periodically
   - Enable 2FA on MongoDB Atlas

---

## 📞 Support

If you encounter issues:
1. Check Netlify build logs
2. Check function logs in Netlify dashboard
3. Verify all environment variables
4. Test MongoDB connection

---

## 🎉 Congratulations!

Your Travel Planner app is now live on Netlify! 🚀

**Share your site:**
`https://your-site-name.netlify.app`
