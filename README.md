# Solar Systems - Solar Installation Portfolio Platform

A complete production-ready single-tenant web application for solar installation companies to showcase their projects, collect inquiries, and manage customer reviews.

## Features

### Public Features (No Login Required)
- **Homepage** with hero section, animated background, and key statistics
- **Search functionality** to find projects by name, city, or capacity
- **Project cards** with images, details, and status badges
- **Infinite continuous carousel** showcasing featured projects
- **Interactive map** of India with project markers using Leaflet.js
- **Customer reviews** section (approved reviews only)
- **Inquiry form** to collect leads
- **Solar savings calculator** with customizable parameters

### Admin Dashboard (JWT Protected)
- **Secure login** with Supabase Auth
- **Projects management**: Add, edit, delete projects with image uploads
- **Reviews management**: Approve, respond to, or delete reviews
- **Inquiries management**: View, update status, add notes
- **Settings**: Configure calculator parameters, carousel speed, map settings

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (JWT)
- **Storage**: Supabase Storage for images
- **Maps**: Leaflet.js with OpenStreetMap tiles
- **UI Components**: shadcn/ui

## Project Structure

```
src/
├── components/ui/        # shadcn/ui components
├── contexts/
│   ├── AuthContext.tsx   # Authentication state
│   └── DataContext.tsx   # Data fetching and management
├── lib/
│   └── supabase.ts       # Supabase client configuration
├── pages/
│   ├── HomePage.tsx
│   ├── ProjectsPage.tsx
│   ├── ProjectDetailPage.tsx
│   ├── CalculatorPage.tsx
│   ├── ContactPage.tsx
│   └── admin/
│       ├── LoginPage.tsx
│       ├── DashboardPage.tsx
│       ├── ProjectsPage.tsx
│       ├── ReviewsPage.tsx
│       ├── InquiriesPage.tsx
│       └── SettingsPage.tsx
├── sections/public/      # Public page sections
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── SearchSection.tsx
│   ├── ProjectsCarousel.tsx
│   ├── MapSection.tsx
│   ├── ReviewsSection.tsx
│   ├── InquirySection.tsx
│   └── Footer.tsx
├── types/
│   ├── index.ts          # Application types
│   └── database.ts       # Supabase database types
└── App.tsx
```

## Database Schema

### Tables

1. **projects**
   - id, title, description, capacity_kw
   - address, city, state, latitude, longitude
   - images[], installation_date, status, tags[]

2. **reviews**
   - id, project_id, reviewer_name, rating, comment
   - is_approved, admin_response

3. **inquiries**
   - id, project_id, name, email, phone, message
   - status, notes

4. **settings**
   - org details, calculator parameters, carousel/map settings

5. **profiles**
   - id, is_admin, full_name, avatar_url

## Setup Instructions

### 1. Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Go to the SQL Editor and run the schema file:
   ```bash
   # Run supabase/schema.sql
   ```
3. Run the seed data:
   ```bash
   # Run supabase/seed.sql
   ```
4. Create a storage bucket named `project-images` (public)
5. Get your project URL and anon key from Settings > API

### 2. Environment Variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
```

## Demo Credentials

- **Email**: admin@solarsystems.in
- **Password**: admin123

(First user to sign up automatically becomes admin)

## Key Features Implementation

### Infinite Carousel
- Smooth continuous animation using requestAnimationFrame
- Pause on hover/focus
- Responsive: 5 cards desktop, 3 tablet, 1 mobile
- Cloned items for seamless loop

### Interactive Map
- Leaflet.js with CartoDB Dark Matter tiles
- Custom markers with project info popups
- Centered on India (21°N, 78°E)

### Solar Calculator
- Input: Monthly bill OR kWh usage
- Calculates: System size, cost, savings, payback period
- Configurable parameters via admin settings
- Includes subsidy and maintenance costs

### Security
- Row Level Security (RLS) enabled on all tables
- JWT-based authentication
- Admin-only access to modify data

## Deployment

### Vercel/Netlify

1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Add environment variables
4. Deploy

### Custom Server

```bash
npm run build
# Serve the dist/ folder
```

## License

MIT License
