# Used Marketplace

A modern, high-performance marketplace for buying and selling used items. Built with Next.js 14, TypeScript, Tailwind CSS, Prisma ORM, NextAuth, and AWS S3.

## ✨ Features

### Core Functionality
- **Authentication**: Secure user registration and login with NextAuth
- **Role-Based Access**: User and Admin roles with different permissions
- **Browse Items**: View categorized items with images and ratings
- **Post Items**: Sell your items with AWS S3 image upload
- **Item Management**: Full CRUD operations (Create, Read, Update, Delete)
- **Rating System**: Rate items 1-5 stars with comments
- **Top Rated**: View all rated items sorted by rating
- **Search**: Search items by name and category
- **User Profile**: Manage profile and change password
- **Admin Panel**: Comprehensive admin dashboard for user and item management

### Design & UX
- **Modern UI**: Clean, minimal design inspired by Unsplash
- **Dark Mode**: Full dark mode support with theme toggle
- **Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Fast Navigation**: Prefetched links for instant page loads
- **Smooth Animations**: 150ms transitions with tactile button feedback
- **Beautiful Logout**: Animated signout page with success confirmation
- **Form Protection**: No browser restoration of cached form data

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Image Storage**: AWS S3
- **Validation**: Zod
- **Password Hashing**: bcryptjs
- **Currency**: Ethiopian Birr (ETB)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd used-marketplace
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/marketplace?schema=public"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# AWS S3 Configuration
AWS_REGION="your-region"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_S3_BUCKET_NAME="your-bucket-name"
```

See `.env.example` for reference and `AWS_S3_SETUP.md` for S3 configuration guide.

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. Create uploads directory:
```bash
mkdir public/uploads
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📊 Database Schema

### User
- id, username, password, fullName, address, phone, email, role (USER/ADMIN)
- Relations: items (one-to-many), ratings (one-to-many)

### Category
- id, name, slug
- Relations: items (one-to-many)
- Default categories: Used Vehicles, Used Electronics, Used Furniture, Other Used Items

### Item
- id, name, description, price, manufacturedDate, imageUrl, contactEmail
- Relations: category (many-to-one), owner (many-to-one), ratings (one-to-many)

### Rating
- id, rating (1-5), comment, createdAt
- Relations: item (many-to-one), user (many-to-one)

## Project Structure

```
used-marketplace/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── uploads/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── categories/
│   │   │   ├── items/
│   │   │   └── upload/
│   │   ├── category/[slug]/
│   │   ├── dashboard/
│   │   ├── item/[id]/
│   │   ├── post-item/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── navbar.tsx
│   │   └── providers.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── utils.ts
│   │   └── validations.ts
│   └── types/
│       └── next-auth.d.ts
├── .env
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## 📖 Usage

### For Buyers
1. **Sign Up/Login**: Create account or login
2. **Browse**: View items by category or search
3. **View Details**: Click "View Details" to see full item information
4. **Rate Items**: Leave ratings and comments on items
5. **Top Rated**: Check out the highest-rated items

### For Sellers
1. **Post Item**: Click "Post Item" and fill in details
2. **Upload Image**: Images stored securely on AWS S3
3. **Manage Items**: View, edit, or delete your items from "My Items"
4. **Track Ratings**: See ratings and comments on your items

### For Admins
1. **Admin Dashboard**: Access comprehensive statistics
2. **Manage Users**: View, edit, or delete users
3. **Manage Items**: Moderate all marketplace items
4. **View Analytics**: Track users, items, and activity

## 🔌 API Routes

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth authentication

### Items
- `GET /api/items` - Get all items (with optional filters)
- `POST /api/items` - Create new item
- `GET /api/items/[id]` - Get item by ID
- `PATCH /api/items/[id]` - Update item
- `DELETE /api/items/[id]` - Delete item
- `GET /api/items/top-rated` - Get top-rated items
- `GET /api/my-items` - Get current user's items

### Categories
- `GET /api/categories` - Get all categories

### Ratings
- `GET /api/ratings?itemId=[id]` - Get ratings for an item
- `POST /api/ratings` - Create or update rating

### User
- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/profile` - Update profile/password

### Admin
- `GET /api/admin/stats` - Get admin statistics
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user
- `GET /api/admin/items` - Get all items
- `DELETE /api/admin/items/[id]` - Delete item

### Upload
- `POST /api/upload` - Upload image to AWS S3

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **Session Authentication**: NextAuth with secure sessions
- **Protected Routes**: Middleware-based route protection
- **Role-Based Access**: User and Admin permissions
- **Input Validation**: Zod schema validation
- **CSRF Protection**: Built-in NextAuth protection
- **Secure File Upload**: AWS S3 with signed URLs
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **XSS Protection**: React's built-in escaping

## ⚡ Performance Optimizations

- **Prefetched Links**: Instant navigation with Next.js prefetch
- **Image Optimization**: Next.js Image component with lazy loading
- **Fast Transitions**: 150ms animations for snappy feel
- **Database Caching**: Strategic use of revalidation
- **Optimistic UI**: Immediate feedback on user actions
- **Code Splitting**: Automatic with Next.js App Router
- **Form Protection**: No browser restoration of cached data

## 📚 Documentation

- `README.md` - This file (project overview)
- `DISTRIBUTED_SYSTEMS_DOCUMENTATION.md` - Complete system architecture
- `PERFORMANCE_OPTIMIZATIONS.md` - Performance improvements guide
- `AWS_S3_SETUP.md` - AWS S3 configuration guide
- `S3_BUCKET_POLICY.md` - S3 bucket policy configuration
- `VERCEL_DEPLOYMENT_GUIDE.md` - Deployment instructions
- `FINAL_DEPLOYMENT_CHECKLIST.md` - Pre-deployment checklist

## 🎨 Design Philosophy

- **Minimal & Clean**: Inspired by Unsplash's aesthetic
- **User-Centric**: Intuitive navigation and clear feedback
- **Fast & Responsive**: Optimized for speed and all devices
- **Accessible**: Proper contrast, focus states, and semantic HTML
- **Professional**: Polished animations and transitions

## 🌟 Key Highlights

- ⚡ **Lightning Fast**: Prefetched navigation and optimized loading
- 🎨 **Beautiful UI**: Modern, clean design with dark mode
- 🔒 **Secure**: Industry-standard security practices
- 📱 **Responsive**: Perfect on all screen sizes
- ⭐ **Rating System**: Community-driven quality feedback
- 👑 **Admin Panel**: Comprehensive management tools
- 🌍 **Ethiopian Birr**: Localized currency support
- ☁️ **Cloud Storage**: Reliable AWS S3 image hosting

## License

MIT
