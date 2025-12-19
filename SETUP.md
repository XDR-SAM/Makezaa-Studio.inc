# Makezaa Project Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following content:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://makezaa:S4igYg9C4bMbSAH2@cluster1.amczncu.mongodb.net/makezaa?retryWrites=true&w=majority&appName=Cluster1

# JWT Secret (change this to a secure random string in production)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# ImgBB API Key
IMGBB_API_KEY=d0b62592b03efee759a8c3f5b2320518

# Base URL (for sitemap and SEO)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create the `.env.local` file with the variables above.

3. Seed the admin user (run this once):
```bash
# Option 1: Using curl
curl -X POST http://localhost:3000/api/seed -H "Content-Type: application/json" -d '{}'

# Option 2: Using the browser
# Visit: http://localhost:3000/api/seed
# Or use Postman/Thunder Client to POST to /api/seed
```

4. Start the development server:
```bash
npm run dev
```

## Admin Login Credentials

- **Email:** admin1@gmail.com
- **Password:** sami123

## Admin Dashboard

Access the admin dashboard at: `http://localhost:3000/xd`

## Project Structure

- `/src/app` - Next.js App Router pages
- `/src/components` - React components
- `/src/lib` - Utility functions (database, auth, image upload)
- `/src/models` - Database models
- `/src/middleware.js` - Route protection middleware

## Features

- ✅ Public pages (Home, Services, Projects, Blog, About, Contact)
- ✅ Admin dashboard with CRUD operations
- ✅ JWT authentication
- ✅ Image upload via ImgBB
- ✅ SEO optimization (sitemap, robots.txt)
- ✅ Search, sorting, and pagination
- ✅ Responsive design
- ✅ Error handling and loading states

## Deployment to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Make sure to update `NEXT_PUBLIC_BASE_URL` to your production domain.

