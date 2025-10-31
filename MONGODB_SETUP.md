# MongoDB Atlas Connection String

## Your Connection Details:

**Connection String:**
```
mongodb+srv://ashutoshkumar231_db_user:tE6Far909Usr6esJ@cluster0.bvyimii.mongodb.net/tour_planner?retryWrites=true&w=majority&appName=Cluster0
```

**Important:** I added `/tour_planner` to specify the database name.

---

## 🚀 Next Steps for Netlify Deployment:

### Option 1: Deploy via Netlify Dashboard (Recommended)

1. **Go to:** https://app.netlify.com
2. **Sign up/Login** with GitHub
3. **Import Project:**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select repository: `AryanCodeWizard/Travel-Planner`

4. **Add Environment Variables** (Site settings → Environment variables):

| Variable Name | Value |
|---------------|-------|
| MONGODB_URI | `mongodb+srv://ashutoshkumar231_db_user:tE6Far909Usr6esJ@cluster0.bvyimii.mongodb.net/tour_planner?retryWrites=true&w=majority&appName=Cluster0` |
| JWT_SECRET | `travel-planner-secret-key-2024-super-secure-random-string` |
| EMAIL_USER | `adiashuto30@gmail.com` |
| EMAIL_PASSWORD | `fiiq flty ifrz zmwn` |
| EMAIL_FROM | `Travel Planner <adiashuto30@gmail.com>` |
| NODE_ENV | `production` |

5. **Deploy Site** - Click "Deploy site" button

---

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize site
netlify init

# Set environment variables
netlify env:set MONGODB_URI "mongodb+srv://ashutoshkumar231_db_user:tE6Far909Usr6esJ@cluster0.bvyimii.mongodb.net/tour_planner?retryWrites=true&w=majority&appName=Cluster0"

netlify env:set JWT_SECRET "travel-planner-secret-key-2024-super-secure-random-string"

netlify env:set EMAIL_USER "adiashuto30@gmail.com"

netlify env:set EMAIL_PASSWORD "fiiq flty ifrz zmwn"

netlify env:set EMAIL_FROM "Travel Planner <adiashuto30@gmail.com>"

netlify env:set NODE_ENV "production"

# Deploy
netlify deploy --prod
```

---

## 📋 After Deployment - Create Admin User

Once your site is deployed, create an admin user in MongoDB Atlas:

1. **Go to MongoDB Atlas:** https://cloud.mongodb.com
2. **Browse Collections:**
   - Click "Database" → "Browse Collections"
   - Database: `tour_planner`
   - Collection: `users`
   - Click "INSERT DOCUMENT"

3. **Insert this JSON:**

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

**Admin Login Credentials:**
- Email: `admin@travelplanner.com`
- Password: `admin123`

---

## ✅ Verification Checklist:

After deployment, test these:
- [ ] Site loads correctly
- [ ] User can sign up
- [ ] User can login
- [ ] Admin can login
- [ ] Bookings work
- [ ] Reviews work
- [ ] Email notifications work
- [ ] Profile photos work

---

## 🎉 Your App Will Be Live At:

`https://your-site-name.netlify.app`

(Netlify will give you a URL after deployment)

---

## 🐛 Troubleshooting:

**If deployment fails:**
1. Check build logs in Netlify dashboard
2. Verify all environment variables are set
3. Make sure MongoDB Atlas IP whitelist includes `0.0.0.0/0`

**If database connection fails:**
1. Go to MongoDB Atlas → Network Access
2. Ensure `0.0.0.0/0` is in the IP Access List
3. Verify database user has "Read and write to any database" permission

---

## 🚀 Ready to Deploy!

Choose Option 1 (Dashboard) or Option 2 (CLI) above and follow the steps!

**Estimated time:** 5-10 minutes
**Cost:** $0.00 (100% FREE)

Good luck! 🎉
