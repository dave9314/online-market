# Used Marketplace

A modern, responsive web-based marketplace for buying and selling used items built with Next.js 14, TypeScript, Tailwind CSS, Prisma ORM, and NextAuth.

## Features

- **Authentication**: Secure user registration and login with NextAuth
- **Browse Items**: View categorized used items with images
- **Post Items**: Sell your used items with image upload
- **Item Management**: Edit and delete your posted items
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Category System**: Organized into vehicles, electronics, furniture, and more

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Validation**: Zod
- **Password Hashing**: bcryptjs

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
```

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

## Database Schema

### User
- id, username, password, fullName, address, phone, email
- Relations: items (one-to-many)

### Category
- id, name, slug
- Relations: items (one-to-many)

### Item
- id, name, description, price, manufacturedDate, imageUrl, contactEmail
- Relations: category (many-to-one), owner (many-to-one)

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

## Usage

### Sign Up
1. Click "Sign Up" on the home page
2. Fill in your details (username, password, full name, address, phone)
3. Submit to create your account

### Login
1. Enter your username and password
2. Click "Login" to access the marketplace

### Browse Items
- View all categories on the dashboard
- Click a category to see all items in that category
- Hover over items to see quick details
- Click an item to view full details

### Post an Item
1. Click "Post Used Item" button
2. Fill in item details (name, category, price, manufactured date, contact email)
3. Upload an image
4. Submit to post your item

### Manage Items
- View your posted items
- Delete items you no longer want to sell
- Edit item details (optional feature)

## API Routes

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth authentication
- `GET /api/categories` - Get all categories
- `GET /api/items` - Get all items (with optional category filter)
- `POST /api/items` - Create new item
- `GET /api/items/[id]` - Get item by ID
- `PATCH /api/items/[id]` - Update item
- `DELETE /api/items/[id]` - Delete item
- `POST /api/upload` - Upload image

## Security Features

- Password hashing with bcryptjs
- Session-based authentication with NextAuth
- Protected API routes
- Input validation with Zod
- CSRF protection
- Secure file uploads

## License

MIT
