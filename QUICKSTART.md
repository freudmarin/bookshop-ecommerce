# Quick Start Guide - BookHaven with Authentication

## Prerequisites
- ✅ Node.js 18+ installed
- ✅ Docker Desktop installed and running
- ✅ Git (optional)

## Setup Steps (5 minutes)

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Start Supabase
```bash
npm run supabase:start
```
⏳ **Wait 2-3 minutes** for Docker images to download (first time only)

### 3️⃣ Get Your API Credentials
```bash
npx supabase status
```
Copy the output - you'll need:
- `API URL` (usually: http://localhost:54321)
- `anon key` (long JWT token)

### 4️⃣ Create .env File
Create a file named `.env` in the project root:
```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=paste_your_anon_key_here
```

### 5️⃣ Start Development Server
```bash
npm run dev
```

### 6️⃣ Open Browser
Visit: **http://localhost:5173**

## Test the App

### Browse as Guest
- ✅ Browse books
- ✅ Add to cart
- ✅ Checkout without account
- ✅ Track order by order number

### Test Authentication
Click **"Sign In"** → **"Create Account"**

Or use test account:
```
Email: test@bookhaven.com
Password: Test123!
```

### Test User Features
When logged in, you can:
- ✅ View Dashboard
- ✅ Update Profile
- ✅ See Order History
- ✅ Pre-filled checkout

## Common Commands

```bash
# Start Supabase
npm run supabase:start

# Stop Supabase
npm run supabase:stop

# Reset database (if needed)
npm run supabase:reset

# Start app
npm run dev

# View database
npx supabase studio
# Opens http://localhost:54323
```

## Troubleshooting

### Docker Not Running
**Error**: Cannot connect to Docker daemon  
**Fix**: Start Docker Desktop, wait for it to fully start

### Port 54321 Already in Use
**Error**: Port already allocated  
**Fix**: 
```bash
npm run supabase:stop
# Then start again
```

### Wrong API Key
**Error**: Invalid API key  
**Fix**: Re-run `npx supabase status` and update `.env` with correct `anon key`

### Database Empty
**Error**: No products showing  
**Fix**:
```bash
npm run supabase:reset
```

## What's Next?

📖 **Detailed Setup**: See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)  
🔐 **Authentication Details**: See [AUTHENTICATION.md](./AUTHENTICATION.md)  
📚 **Full Documentation**: See [README.md](./README.md)

## Quick Feature Overview

### ✅ Implemented
- [x] Product browsing with search/filters
- [x] Shopping cart with localStorage
- [x] Guest checkout (no account needed)
- [x] User authentication (login/register)
- [x] User dashboard
- [x] Profile management
- [x] Order history for authenticated users
- [x] Order tracking (guest + auth)
- [x] Real-time stock management

### 🚧 Ready to Build (Database Ready)
- [ ] Wishlist (database + RLS ready)
- [ ] Product reviews (database + RLS ready)
- [ ] Pre-filled checkout from profile

### 🎯 Future Enhancements
- [ ] Email notifications
- [ ] OAuth (Google/GitHub login)
- [ ] Admin dashboard
- [ ] Order cancellation

---

**Need Help?** Check the detailed guides:
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Supabase configuration
- [AUTHENTICATION.md](./AUTHENTICATION.md) - Auth implementation details
- [README.md](./README.md) - Full project documentation
