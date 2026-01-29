# Running BookHaven Locally with Supabase

This guide explains how to run the BookHaven e-commerce application with Supabase locally for development.

## Prerequisites

Before you begin, ensure you have installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (required for Supabase local development)
- npm or yarn package manager

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Supabase Local Stack

First time setup requires Docker to be running. Start Supabase:

```bash
npm run supabase:start
```

This command will:
- Pull required Docker images
- Start PostgreSQL database
- Start Supabase services (Auth, Storage, Realtime, etc.)
- Apply database migrations from `supabase/migrations`
- Seed the database with sample data

**Note**: The first run may take several minutes to download Docker images.

### 3. Get Supabase Connection Details

After starting Supabase, get your local connection credentials:

```bash
npx supabase status
```

This will display:
```
API URL: http://localhost:54321
Anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DB URL: postgresql://postgres:postgres@localhost:54322/postgres
```

### 4. Update Environment Variables

Create a `.env` file in the project root (if not exists):

```bash
# .env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your_anon_key_from_supabase_status
```

**Important**: Replace `your_anon_key_from_supabase_status` with the actual `Anon key` from `npx supabase status` output.

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Database Management

### View Database Schema

Access the local Supabase Studio:

```bash
npx supabase studio
```

This opens a web interface at `http://localhost:54323` where you can:
- Browse tables and data
- Run SQL queries
- Manage authentication users
- View logs

### Reset Database

To reset the database to a clean state:

```bash
npm run supabase:reset
```

This will:
- Drop all existing data
- Re-apply all migrations
- Re-seed with sample data

### Create New Migration

If you need to modify the database schema:

```bash
npx supabase migration new your_migration_name
```

Edit the generated file in `supabase/migrations/` and apply it:

```bash
npm run supabase:reset
```

## Test User Accounts

The seed data includes two test user accounts:

### Account 1
- **Email**: test@bookhaven.com
- **Password**: Test123!
- **Name**: Test User

### Account 2
- **Email**: jane@bookhaven.com
- **Password**: Jane123!
- **Name**: Jane Smith

## Common Commands

```bash
# Start Supabase
npm run supabase:start

# Stop Supabase
npm run supabase:stop

# Reset database (drop + migrate + seed)
npm run supabase:reset

# Apply new migrations
npm run supabase:migrate

# View Supabase status
npx supabase status

# Open Supabase Studio
npx supabase studio

# View logs
npx supabase logs
```

## Troubleshooting

### Docker Not Running

**Error**: `Cannot connect to the Docker daemon`

**Solution**: Start Docker Desktop and wait for it to fully initialize.

### Port Already in Use

**Error**: `Port 54321 is already allocated`

**Solution**: Stop other Supabase instances or services using those ports:

```bash
npm run supabase:stop
docker ps  # Check for other running containers
```

### Migration Errors

**Error**: `Migration failed`

**Solution**: Check migration syntax and reset database:

```bash
npm run supabase:reset
```

### Auth Issues

**Error**: `Invalid API key` or `JWT expired`

**Solution**: Ensure `.env` has correct `VITE_SUPABASE_ANON_KEY` from `npx supabase status`.

### Cannot Create Users

**Error**: `User already exists` or `Email not confirmed`

**Solution**: In local development, email confirmation is disabled by default. Check Supabase Studio > Authentication to manage users manually.

## Database Structure

### Core Tables

- **products**: Book inventory with details (title, author, price, stock)
- **users**: Extended user profiles (linked to `auth.users`)
- **orders**: Customer orders (supports both authenticated and guest checkout)
- **order_items**: Individual items in each order
- **reviews**: Book reviews by authenticated users
- **wishlists**: Saved books for authenticated users

### Row Level Security (RLS)

All tables have RLS enabled:
- **products**: Public read access
- **users**: Users can only view/edit their own profile
- **orders**: Users see only their orders, guests can create orders
- **order_items**: Access based on order ownership
- **reviews/wishlists**: Only accessible to authenticated users

## Next Steps

1. ✅ Start Supabase local stack
2. ✅ Update `.env` with local credentials
3. ✅ Start development server
4. ✅ Test authentication with provided test accounts
5. ✅ Browse products and test checkout (both guest and authenticated)
6. Explore Supabase Studio to understand the database structure

## Production Deployment

For production deployment to Supabase Cloud:

1. Create a project at [supabase.com](https://supabase.com)
2. Link your project: `npx supabase link --project-ref your-project-ref`
3. Push migrations: `npx supabase db push`
4. Update `.env` with production credentials
5. Deploy frontend (Netlify, Vercel, etc.)

---

For more information:
- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Supabase Local Development](https://supabase.com/docs/guides/cli/local-development)
