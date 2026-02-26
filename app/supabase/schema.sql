-- Solar Systems - Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    capacity_kw NUMERIC(10, 2) NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    images TEXT[] DEFAULT '{}',
    installation_date DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'pending')),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    reviewer_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    admin_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INQUIRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'archived')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SETTINGS TABLE (Single row configuration)
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    org_name TEXT DEFAULT 'Solar Systems',
    contact_email TEXT DEFAULT 'contact@solarsystems.com',
    contact_phone TEXT DEFAULT '+91 98765 43210',
    org_address TEXT DEFAULT '123 Green Energy Road, Mumbai, Maharashtra 400001',
    -- Calculator settings
    kwh_per_kw_per_month NUMERIC(5, 2) DEFAULT 130.00,
    tariff_per_kwh NUMERIC(6, 2) DEFAULT 8.50,
    system_cost_per_kw NUMERIC(10, 2) DEFAULT 45000.00,
    subsidy_percentage NUMERIC(5, 2) DEFAULT 30.00,
    maintenance_cost_per_kw_year NUMERIC(6, 2) DEFAULT 500.00,
    -- Carousel settings
    carousel_speed INTEGER DEFAULT 30,
    -- Map settings
    map_center_lat NUMERIC(10, 6) DEFAULT 21.000000,
    map_center_lng NUMERIC(10, 6) DEFAULT 78.000000,
    map_zoom INTEGER DEFAULT 5,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- PROFILES TABLE (Extends Supabase Auth)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    is_admin BOOLEAN DEFAULT FALSE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROJECTS POLICIES
-- ============================================
-- Anyone can read active projects
CREATE POLICY "Projects are viewable by everyone" 
    ON projects FOR SELECT 
    USING (status = 'active' OR status = 'completed');

-- Only admins can insert/update/delete
CREATE POLICY "Projects can be created by admins" 
    ON projects FOR INSERT 
    TO authenticated 
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Projects can be updated by admins" 
    ON projects FOR UPDATE 
    TO authenticated 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Projects can be deleted by admins" 
    ON projects FOR DELETE 
    TO authenticated 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- ============================================
-- REVIEWS POLICIES
-- ============================================
-- Anyone can read approved reviews
CREATE POLICY "Approved reviews are viewable by everyone" 
    ON reviews FOR SELECT 
    USING (is_approved = TRUE);

-- Anyone can submit a review (will be pending approval)
CREATE POLICY "Reviews can be submitted by anyone" 
    ON reviews FOR INSERT 
    TO anon, authenticated 
    WITH CHECK (is_approved = FALSE);

-- Only admins can update/delete reviews
CREATE POLICY "Reviews can be updated by admins" 
    ON reviews FOR UPDATE 
    TO authenticated 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Reviews can be deleted by admins" 
    ON reviews FOR DELETE 
    TO authenticated 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- Admins can see all reviews (including unapproved)
CREATE POLICY "Admins can view all reviews" 
    ON reviews FOR SELECT 
    TO authenticated 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- ============================================
-- INQUIRIES POLICIES
-- ============================================
-- Anyone can submit inquiries
CREATE POLICY "Inquiries can be submitted by anyone" 
    ON inquiries FOR INSERT 
    TO anon, authenticated 
    WITH CHECK (TRUE);

-- Only admins can view/update inquiries
CREATE POLICY "Inquiries are viewable by admins" 
    ON inquiries FOR SELECT 
    TO authenticated 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Inquiries can be updated by admins" 
    ON inquiries FOR UPDATE 
    TO authenticated 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Inquiries can be deleted by admins" 
    ON inquiries FOR DELETE 
    TO authenticated 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- ============================================
-- SETTINGS POLICIES
-- ============================================
-- Anyone can read settings
CREATE POLICY "Settings are viewable by everyone" 
    ON settings FOR SELECT 
    TO anon, authenticated 
    USING (TRUE);

-- Only admins can update settings
CREATE POLICY "Settings can be updated by admins" 
    ON settings FOR UPDATE 
    TO authenticated 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- ============================================
-- PROFILES POLICIES
-- ============================================
-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
    ON profiles FOR SELECT 
    TO authenticated 
    USING (id = auth.uid());

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" 
    ON profiles FOR SELECT 
    TO authenticated 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
    ON profiles FOR UPDATE 
    TO authenticated 
    USING (id = auth.uid());

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, is_admin, full_name)
    VALUES (
        NEW.id,
        -- First user becomes admin
        NOT EXISTS (SELECT 1 FROM public.profiles WHERE is_admin = TRUE),
        NEW.raw_user_meta_data->>'full_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- STORAGE BUCKET SETUP
-- ============================================

-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Project images are publicly viewable"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'project-images');

CREATE POLICY "Admins can upload project images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'project-images' 
        AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Admins can delete project images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'project-images' 
        AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );
