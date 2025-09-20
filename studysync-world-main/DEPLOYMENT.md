# U-Fresher ❤ - Deployment Guide

This guide will help you deploy the U-Fresher application to Vercel with Supabase authentication.

## Prerequisites

1. A Supabase account and project
2. A Vercel account
3. Node.js installed locally (for testing)

## Step 1: Supabase Setup

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)

2. **Run the database schema**:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase-schema.sql`
   - Execute the SQL to create tables and policies

3. **Get your Supabase credentials**:
   - Go to Settings > API
   - Copy your Project URL and anon/public key

4. **Configure Authentication**:
   - Go to Authentication > Settings
   - Enable Google OAuth (optional)
   - Add your Vercel domain to allowed origins

## Step 2: Environment Variables

Create a `.env.local` file in your project root with:

```env
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_APP_URL=https://U-fresher.vercel.app
```

## Step 3: Vercel Deployment

1. **Connect your repository to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the project

2. **Configure environment variables in Vercel**:
   - Go to Project Settings > Environment Variables
   - Add the same variables from your `.env.local`:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_APP_URL`

3. **Deploy**:
   - Vercel will automatically build and deploy your project
   - The build command is: `npm run build`
   - The output directory is: `dist`

## Step 4: Post-Deployment Configuration

1. **Update Supabase settings**:
   - Add your Vercel domain to allowed origins in Supabase Auth settings
   - Update redirect URLs to include your Vercel domain

2. **Test the application**:
   - Visit your Vercel URL
   - Test user registration and login
   - Test admin access with code "Createrkkrishavya"

## Features Implemented

### Authentication
- ✅ Supabase authentication integration
- ✅ Email/password sign up and sign in
- ✅ Google OAuth integration
- ✅ Admin code validation ("Createrkkrishavya")
- ✅ Protected routes
- ✅ Auth callback handling

### Routing
- ✅ React Router integration
- ✅ Protected routes for authenticated users
- ✅ Public routes with redirect for authenticated users
- ✅ Proper navigation flow

### Admin Panel
- ✅ Admin-only access
- ✅ Community management
- ✅ Club management
- ✅ Content moderation tools
- ✅ User statistics

### User Interface
- ✅ Modern, responsive design
- ✅ Dark theme support
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications

## Troubleshooting

### Build Issues
- Ensure all environment variables are set
- Check that Supabase credentials are correct
- Verify all dependencies are installed

### Authentication Issues
- Check Supabase project settings
- Verify redirect URLs are configured
- Ensure RLS policies are set up correctly

### Database Issues
- Run the provided SQL schema
- Check table permissions
- Verify foreign key relationships

## File Structure

```
src/
├── components/ui/          # UI components
├── hooks/
│   └── useAuth.ts         # Authentication hook
├── lib/
│   ├── config.ts          # App configuration
│   ├── supabase.ts        # Supabase client
│   └── types.ts           # TypeScript types
├── pages/
│   ├── Auth.tsx           # Login/signup page
│   ├── AuthCallback.tsx   # OAuth callback handler
│   ├── Dashboard.tsx      # User dashboard
│   └── AdminPanel.tsx     # Admin panel
└── App.tsx                # Main app with routing
```

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify environment variables are set correctly
3. Ensure Supabase project is properly configured
4. Check Vercel deployment logs

The application is now ready for production use at https://U-fresher.vercel.app!
