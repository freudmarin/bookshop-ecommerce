# 📚 The Literary Haven - E-commerce Bookshop

A modern, full-featured e-commerce bookshop built with React, TypeScript, and Supabase. Features a beautiful book-themed design with pay-on-delivery ordering system.

![The Literary Haven](https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=400&fit=crop)

## ✨ Features

### Core E-commerce Features
- **Product Catalog**: Browse books with filtering by category, author, and price range
- **Search Functionality**: Find books by title, author, or description
- **Shopping Cart**: Add/remove items, update quantities with localStorage persistence
- **Guest Checkout**: No account required - just enter shipping details
- **Pay on Delivery**: No payment integration needed - customers pay when books arrive
- **Order Tracking**: Look up order status using order number

### User Authentication & Accounts
- **User Registration**: Create account with email and password
- **User Login**: Secure authentication with Supabase Auth
- **User Dashboard**: Personalized dashboard with quick access to orders, profile, and wishlist
- **Profile Management**: Update personal information and default shipping address
- **Order History**: View all past orders with detailed information
- **Wishlist**: Save books to read later (coming soon)
- **Product Reviews**: Rate and review purchased books (coming soon)

### Design & Performance
- **Responsive Design**: Beautiful UI that works on mobile, tablet, and desktop
- **Real-time Stock Management**: Automatic stock updates when orders are placed
- **Protected Routes**: Secure pages that require authentication
- **Auto-profile Creation**: User profiles automatically created on signup

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State Management**: React Context API

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Supabase CLI** - For local development
- **Docker** - Required for Supabase local development

### Installing Supabase CLI

```bash
# Using npm
npm install -g supabase

# Using Homebrew (macOS)
brew install supabase/tap/supabase

# Using Scoop (Windows)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/literary-haven-bookshop.git
cd literary-haven-bookshop
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase Locally

```bash
# Start Supabase local development stack
npm run supabase:start

# This will output your local Supabase credentials
# Copy the API URL and anon key
```

After running `supabase start`, you'll see output like:
```
API URL: http://127.0.0.1:54321
anon key: eyJhbGci...your-key-here
service_role key: eyJhbGci...
Studio URL: http://127.0.0.1:54323
```

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Update `.env` with your local Supabase credentials:

```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=your-anon-key-from-supabase-start
```

### 5. Seed the Database

The database will be automatically migrated and seeded when you start Supabase. To reset and reseed:

```bash
npm run supabase:reset
```

### 6. Start the Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app!

### 7. Test User Accounts

The app includes authentication features. For testing, you can either:

**Option A: Create a new account**
- Click "Sign In" → "Create Account"
- Fill in the registration form

**Option B: Use pre-seeded test accounts** (if available)
- Email: `test@bookhaven.com` | Password: `Test123!`
- Email: `jane@bookhaven.com` | Password: `Jane123!`

**Note**: Guest checkout is also available - no account required for placing orders!

## 🗄️ Database Schema

### Users Table (extends auth.users)
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (references auth.users) |
| full_name | VARCHAR(255) | User's full name |
| phone | VARCHAR(20) | Phone number |
| default_address | TEXT | Default shipping address |
| default_city | VARCHAR(100) | Default city |
| default_postal_code | VARCHAR(20) | Default postal code |
| created_at | TIMESTAMP | Profile creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### Products Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | VARCHAR(255) | Book title |
| author | VARCHAR(255) | Author name |
| isbn | VARCHAR(20) | ISBN number (unique) |
| description | TEXT | Book description |
| price | DECIMAL(10,2) | Price in USD |
| cover_image_url | TEXT | URL to cover image |
| stock_quantity | INTEGER | Available stock |
| category | VARCHAR(100) | Book category |
| publisher | VARCHAR(255) | Publisher name |
| publication_year | INTEGER | Year published |
| page_count | INTEGER | Number of pages |
| created_at | TIMESTAMP | Creation timestamp |

### Orders Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users (nullable for guest orders) |
| order_number | VARCHAR(20) | Unique order number (auto-generated) |
| customer_name | VARCHAR(255) | Customer full name |
| customer_email | VARCHAR(255) | Customer email |
| customer_phone | VARCHAR(20) | Customer phone |
| shipping_address | TEXT | Delivery address |
| city | VARCHAR(100) | City |
| postal_code | VARCHAR(20) | Postal/ZIP code |
| total_amount | DECIMAL(10,2) | Order total |
| status | ENUM | pending, confirmed, shipped, delivered, cancelled |
| payment_method | VARCHAR(50) | Default: 'cash_on_delivery' |
| notes | TEXT | Order notes (optional) |
| created_at | TIMESTAMP | Order timestamp |

### Order Items Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| order_id | UUID | Foreign key to orders |
| product_id | UUID | Foreign key to products |
| quantity | INTEGER | Quantity ordered |
| price_at_purchase | DECIMAL(10,2) | Price when ordered |
| created_at | TIMESTAMP | Creation timestamp |

### Wishlists Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| product_id | UUID | Foreign key to products |
| created_at | TIMESTAMP | Addition timestamp |

### Reviews Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| product_id | UUID | Foreign key to products |
| rating | INTEGER | Rating (1-5) |
| comment | TEXT | Review text (optional) |
| created_at | TIMESTAMP | Review timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

## 📁 Project Structure

```
bookshop-ecommerce/
├── public/
│   ├── book-icon.svg
│   └── _redirects
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── ProtectedRoute.tsx    # Route guard for authenticated pages
│   │   │   └── index.ts
│   │   ├── cart/
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   └── index.ts
│   │   ├── checkout/
│   │   │   ├── CheckoutForm.tsx
│   │   │   ├── OrderConfirmation.tsx
│   │   │   └── index.ts
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── index.ts
│   │   ├── layout/
│   │   │   ├── Header.tsx            # Navigation with user menu
│   │   │   ├── Footer.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── index.ts
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   ├── ProductFilters.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── context/
│   │   ├── AuthContext.tsx           # Authentication state management
│   │   ├── CartContext.tsx           # Shopping cart state
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useAuth.ts                # Auth hook
│   │   ├── useCart.ts                # Cart hook
│   │   ├── useSupabase.ts            # Supabase queries
│   │   └── index.ts
│   ├── lib/
│   │   └── supabaseClient.ts         # Supabase configuration
│   ├── pages/
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── Dashboard.tsx             # User dashboard
│   │   ├── Home.tsx
│   │   ├── Login.tsx                 # Login page
│   │   ├── OrderConfirmationPage.tsx
│   │   ├── OrderHistory.tsx          # User order history
│   │   ├── ProductDetailPage.tsx
│   │   ├── Products.tsx
│   │   ├── Profile.tsx               # User profile management
│   │   ├── Register.tsx              # Registration page
│   │   ├── TrackOrder.tsx
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   └── validators.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase/
│   ├── migrations/
│   │   └── 20240101000000_initial_schema.sql
│   ├── seed.sql
│   ├── test_users.sql                # Test user creation script
│   └── config.toml
├── .env.example
├── .gitignore
├── index.html
├── netlify.toml
├── package.json
├── postcss.config.js
├── README.md
├── SUPABASE_SETUP.md                 # Detailed Supabase setup guide
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── index.ts
│   │   └── product/
│   │       ├── ProductCard.tsx
│   │       ├── ProductList.tsx
│   │       ├── ProductFilter.tsx
│   │       ├── ProductDetail.tsx
│   │       └── index.ts
│   ├── context/
│   │   └── CartContext.tsx
│   ├── hooks/
│   │   ├── useCart.ts
│   │   ├── useSupabase.ts
│   │   └── index.ts
│   ├── lib/
│   │   └── supabaseClient.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── OrderConfirmationPage.tsx
│   │   ├── TrackOrder.tsx
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── formatters.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   │   └── 20240101000000_initial_schema.sql
│   └── seed.sql
├── .env.example
├── .gitignore
├── index.html
├── netlify.toml
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 5173 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run supabase:start` | Start local Supabase stack (Docker required) |
| `npm run supabase:stop` | Stop local Supabase stack |
| `npm run supabase:reset` | Reset database, re-apply migrations and reseed |
| `npm run supabase:migrate` | Apply database migrations |

For more details on Supabase local development, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).

## 🌐 Deploying to Netlify

### Option 1: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### Option 2: Deploy via GitHub Integration

1. Push your code to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. Click "New site from Git"
4. Connect your GitHub repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables in Netlify dashboard:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

### Setting Up Supabase for Production

1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migration script from `supabase/migrations/`
3. Run the seed script from `supabase/seed.sql`
4. Get your API URL and anon key from Project Settings > API
5. Add these to your Netlify environment variables

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase API URL | `http://127.0.0.1:54321` (local) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1...` |

## 🎨 Customization

### Colors

The app uses a warm, book-themed color palette defined in `tailwind.config.js`:

- **Literary Cream**: `#FDF8F3` - Background
- **Parchment**: `#F5EDE4` - Secondary background
- **Leather**: `#8B4513` - Primary brand color
- **Ink**: `#1a1a2e` - Dark text
- **Gold**: `#D4AF37` - Accents
- **Burgundy**: `#722F37` - Hover states

### Adding New Categories

Edit `supabase/seed.sql` to add new book categories and products, then run:

```bash
npm run supabase:reset
```

## 🔒 Security

- Row Level Security (RLS) is enabled on all tables
- Anonymous users can read products and create orders
- Stock validation prevents overselling
- Input validation on all forms

## 🐛 Troubleshooting

### Supabase won't start
- Ensure Docker is running
- Try `supabase stop --no-backup` then `supabase start`

### Environment variables not working
- Restart the dev server after changing `.env`
- Ensure variables start with `VITE_`

### Products not loading
- Check Supabase is running: `supabase status`
- Verify `.env` has correct credentials
- Check browser console for errors

## 🚀 Future Enhancements

- [ ] User authentication and order history
- [ ] Book reviews and ratings
- [ ] Wishlist functionality
- [ ] Email notifications for order updates
- [ ] Admin dashboard for order management
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Book recommendations based on browsing history
- [ ] Gift card support
- [ ] Multiple currency support
- [ ] Book preview/sample pages

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Built with ❤️ for book lovers everywhere.
