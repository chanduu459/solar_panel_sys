import React, { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { 
  Project, ProjectInsert, ProjectUpdate,
  Review, ReviewInsert, ReviewUpdate,
  Inquiry, InquiryInsert, InquiryUpdate,
  Settings, SettingsUpdate,
  SearchFilters,
  DashboardStats
} from '../types';

interface DataContextType {
  // Projects
  projects: Project[];
  fetchProjects: (filters?: SearchFilters) => Promise<void>;
  getProjectById: (id: string) => Promise<Project | null>;
  createProject: (project: ProjectInsert) => Promise<Project | null>;
  updateProject: (id: string, project: ProjectUpdate) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<boolean>;
  
  // Reviews
  reviews: Review[];
  approvedReviews: Review[];
  fetchReviews: (includeUnapproved?: boolean) => Promise<void>;
  fetchApprovedReviews: () => Promise<void>;
  createReview: (review: ReviewInsert) => Promise<Review | null>;
  updateReview: (id: string, review: ReviewUpdate) => Promise<Review | null>;
  deleteReview: (id: string) => Promise<boolean>;
  approveReview: (id: string, adminResponse?: string) => Promise<Review | null>;
  
  // Inquiries
  inquiries: Inquiry[];
  fetchInquiries: () => Promise<void>;
  createInquiry: (inquiry: InquiryInsert) => Promise<Inquiry | null>;
  updateInquiry: (id: string, inquiry: InquiryUpdate) => Promise<Inquiry | null>;
  deleteInquiry: (id: string) => Promise<boolean>;
  
  // Settings
  settings: Settings | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: SettingsUpdate) => Promise<Settings | null>;
  
  // Stats
  stats: DashboardStats | null;
  fetchStats: () => Promise<void>;
  
  // Loading states
  isLoading: {
    projects: boolean;
    reviews: boolean;
    inquiries: boolean;
    settings: boolean;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data for development without Supabase
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Mumbai Commercial Complex',
    description: 'A 500kW rooftop solar installation for a major commercial complex.',
    capacity_kw: 500,
    address: '123 Business Park, Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    latitude: 19.0760,
    longitude: 72.8777,
    images: ['https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800'],
    installation_date: '2023-06-15',
    status: 'active',
    tags: ['commercial', 'rooftop'],
    created_at: '2023-06-15',
    updated_at: '2023-06-15',
  },
  {
    id: '2',
    title: 'Bangalore Tech Park',
    description: '750kW solar installation powering a major IT park.',
    capacity_kw: 750,
    address: 'Electronic City Phase 1',
    city: 'Bangalore',
    state: 'Karnataka',
    latitude: 12.9716,
    longitude: 77.5946,
    images: ['https://images.unsplash.com/photo-1545208942-e0c45d2d07c7?w=800'],
    installation_date: '2023-09-20',
    status: 'active',
    tags: ['commercial', 'tech-park'],
    created_at: '2023-09-20',
    updated_at: '2023-09-20',
  },
  {
    id: '3',
    title: 'Chennai Manufacturing Plant',
    description: 'Industrial-scale 1MW solar installation.',
    capacity_kw: 1000,
    address: 'SIPCOT Industrial Park',
    city: 'Chennai',
    state: 'Tamil Nadu',
    latitude: 13.0827,
    longitude: 80.2707,
    images: ['https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800'],
    installation_date: '2023-11-10',
    status: 'active',
    tags: ['industrial', 'ground-mount'],
    created_at: '2023-11-10',
    updated_at: '2023-11-10',
  },
];

const mockReviews: Review[] = [
  {
    id: '1',
    project_id: '1',
    reviewer_name: 'Rajesh Sharma',
    rating: 5,
    comment: 'Excellent work! Our electricity bills reduced by 60%.',
    is_approved: true,
    admin_response: 'Thank you Rajesh!',
    created_at: '2023-08-15',
    updated_at: '2023-08-15',
    project: { title: 'Mumbai Commercial Complex', city: 'Mumbai' },
  },
  {
    id: '2',
    project_id: '2',
    reviewer_name: 'Priya Venkatesh',
    rating: 5,
    comment: 'Great investment! The monitoring dashboard is fantastic.',
    is_approved: true,
    admin_response: null,
    created_at: '2023-11-05',
    updated_at: '2023-11-05',
    project: { title: 'Bangalore Tech Park', city: 'Bangalore' },
  },
];

const mockSettings: Settings = {
  id: 1,
  org_name: 'Solar Systems India',
  contact_email: 'info@solarsystems.in',
  contact_phone: '+91 1800 123 4567',
  org_address: 'Solar Tower, 101 Green Energy Road, Mumbai, Maharashtra 400001',
  kwh_per_kw_per_month: 130,
  tariff_per_kwh: 8.5,
  system_cost_per_kw: 45000,
  subsidy_percentage: 30,
  maintenance_cost_per_kw_year: 500,
  carousel_speed: 30,
  map_center_lat: 21.0,
  map_center_lng: 78.0,
  map_zoom: 5,
  updated_at: '2024-01-01',
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [approvedReviews, setApprovedReviews] = useState<Review[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState({
    projects: false,
    reviews: false,
    inquiries: false,
    settings: false,
  });

  const hasDbClient = typeof (supabase as any)?.from === 'function';
  const isMockMode = !import.meta.env.VITE_SUPABASE_URL || !hasDbClient;

  // Projects
  const fetchProjects = useCallback(async (filters?: SearchFilters) => {
    setIsLoading(prev => ({ ...prev, projects: true }));
    try {
      if (isMockMode) {
        let filtered = [...mockProjects];
        if (filters?.query) {
          const q = filters.query.toLowerCase();
          filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(q) ||
            p.city.toLowerCase().includes(q) ||
            p.capacity_kw.toString().includes(q)
          );
        }
        if (filters?.city) {
          filtered = filtered.filter(p => p.city === filters.city);
        }
        setProjects(filtered);
        return;
      }

      let query = supabase!
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.query) {
        query = query.or(`title.ilike.%${filters.query}%,city.ilike.%${filters.query}%,capacity_kw.eq.${filters.query}`);
      }
      if (filters?.city) {
        query = query.eq('city', filters.city);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.minCapacity) {
        query = query.gte('capacity_kw', filters.minCapacity);
      }
      if (filters?.maxCapacity) {
        query = query.lte('capacity_kw', filters.maxCapacity);
      }

      const { data, error } = await query;
      if (error) throw error;
      setProjects((data as Project[]) || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, projects: false }));
    }
  }, [isMockMode]);

  const getProjectById = async (id: string): Promise<Project | null> => {
    try {
      if (isMockMode) {
        return mockProjects.find(p => p.id === id) || null;
      }

      const { data, error } = await supabase!
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Project;
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  };

  const createProject = async (project: ProjectInsert): Promise<Project | null> => {
    try {
      if (isMockMode) {
        const newProject: Project = {
          ...project,
          id: Math.random().toString(36),
          images: project.images || [],
          installation_date: project.installation_date || null,
          status: project.status || 'active',
          tags: project.tags || [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockProjects.push(newProject);
        setProjects([...mockProjects]);
        return newProject;
      }

      const { data, error } = await (supabase!
        .from('projects') as any)
        .insert(project)
        .select()
        .single();

      if (error) throw error;
      await fetchProjects();
      return data as Project;
    } catch (error) {
      console.error('Error creating project:', error);
      return null;
    }
  };

  const updateProject = async (id: string, project: ProjectUpdate): Promise<Project | null> => {
    try {
      if (isMockMode) {
        const index = mockProjects.findIndex(p => p.id === id);
        if (index !== -1) {
          mockProjects[index] = { ...mockProjects[index], ...project, updated_at: new Date().toISOString() };
          setProjects([...mockProjects]);
          return mockProjects[index];
        }
        return null;
      }

      const { data, error } = await (supabase!
        .from('projects') as any)
        .update(project)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchProjects();
      return data as Project;
    } catch (error) {
      console.error('Error updating project:', error);
      return null;
    }
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      if (isMockMode) {
        const index = mockProjects.findIndex(p => p.id === id);
        if (index !== -1) {
          mockProjects.splice(index, 1);
          setProjects([...mockProjects]);
          return true;
        }
        return false;
      }

      const { error } = await supabase!
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchProjects();
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  };

  // Reviews
  const fetchReviews = useCallback(async (includeUnapproved = false) => {
    setIsLoading(prev => ({ ...prev, reviews: true }));
    try {
      if (isMockMode) {
        setReviews(mockReviews);
        return;
      }

      let query = supabase!
        .from('reviews')
        .select('*, project:projects(title, city)')
        .order('created_at', { ascending: false });

      if (!includeUnapproved) {
        query = query.eq('is_approved', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      setReviews((data as Review[]) || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, reviews: false }));
    }
  }, [isMockMode]);

  const fetchApprovedReviews = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, reviews: true }));
    try {
      if (isMockMode) {
        setApprovedReviews(mockReviews.filter(r => r.is_approved));
        return;
      }

      const { data, error } = await supabase!
        .from('reviews')
        .select('*, project:projects(title, city)')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApprovedReviews((data as Review[]) || []);
    } catch (error) {
      console.error('Error fetching approved reviews:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, reviews: false }));
    }
  }, [isMockMode]);

  const createReview = async (review: ReviewInsert): Promise<Review | null> => {
    try {
      if (isMockMode) {
        const newReview: Review = {
          id: Math.random().toString(36),
          project_id: review.project_id || null,
          reviewer_name: review.reviewer_name,
          rating: review.rating,
          comment: review.comment,
          is_approved: false,
          admin_response: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockReviews.push(newReview);
        setReviews([...mockReviews]);
        return newReview;
      }

      const { data, error } = await (supabase!
        .from('reviews') as any)
        .insert(review)
        .select()
        .single();

      if (error) throw error;
      return data as Review;
    } catch (error) {
      console.error('Error creating review:', error);
      return null;
    }
  };

  const updateReview = async (id: string, review: ReviewUpdate): Promise<Review | null> => {
    try {
      if (isMockMode) {
        const index = mockReviews.findIndex(r => r.id === id);
        if (index === -1) return null;

        mockReviews[index] = {
          ...mockReviews[index],
          ...review,
          updated_at: new Date().toISOString(),
        };
        setReviews([...mockReviews]);
        setApprovedReviews(mockReviews.filter(r => r.is_approved));
        return mockReviews[index];
      }

      const { data, error } = await (supabase!
        .from('reviews') as any)
        .update(review)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchReviews(true);
      return data as Review;
    } catch (error) {
      console.error('Error updating review:', error);
      return null;
    }
  };

  const deleteReview = async (id: string): Promise<boolean> => {
    try {
      if (isMockMode) {
        const index = mockReviews.findIndex(r => r.id === id);
        if (index === -1) return false;

        mockReviews.splice(index, 1);
        setReviews([...mockReviews]);
        setApprovedReviews(mockReviews.filter(r => r.is_approved));
        return true;
      }

      const { error } = await supabase!
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchReviews(true);
      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      return false;
    }
  };

  const approveReview = async (id: string, adminResponse?: string): Promise<Review | null> => {
    try {
      if (isMockMode) {
        const index = mockReviews.findIndex(r => r.id === id);
        if (index === -1) return null;

        mockReviews[index] = {
          ...mockReviews[index],
          is_approved: true,
          admin_response: adminResponse || null,
          updated_at: new Date().toISOString(),
        };
        setReviews([...mockReviews]);
        setApprovedReviews(mockReviews.filter(r => r.is_approved));
        return mockReviews[index];
      }

      const { data, error } = await (supabase!
        .from('reviews') as any)
        .update({
          is_approved: true,
          admin_response: adminResponse || null,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchReviews(true);
      return data as Review;
    } catch (error) {
      console.error('Error approving review:', error);
      return null;
    }
  };

  // Inquiries
  const fetchInquiries = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, inquiries: true }));
    try {
      if (isMockMode) {
        setInquiries([]);
        return;
      }

      const { data, error } = await supabase!
        .from('inquiries')
        .select('*, project:projects(title)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries((data as Inquiry[]) || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, inquiries: false }));
    }
  }, [isMockMode]);

  const createInquiry = async (inquiry: InquiryInsert): Promise<Inquiry | null> => {
    try {
      if (isMockMode) {
        const newInquiry: Inquiry = {
          id: Math.random().toString(36),
          project_id: inquiry.project_id || null,
          name: inquiry.name,
          email: inquiry.email,
          phone: inquiry.phone,
          message: inquiry.message,
          status: 'new',
          notes: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setInquiries(prev => [newInquiry, ...prev]);
        return newInquiry;
      }

      const { data, error } = await (supabase!
        .from('inquiries') as any)
        .insert(inquiry)
        .select()
        .single();

      if (error) throw error;
      return data as Inquiry;
    } catch (error) {
      console.error('Error creating inquiry:', error);
      return null;
    }
  };

  const updateInquiry = async (id: string, inquiry: InquiryUpdate): Promise<Inquiry | null> => {
    try {
      if (isMockMode) {
        let updatedInquiry: Inquiry | null = null;
        setInquiries(prev => prev.map(item => {
          if (item.id !== id) return item;
          updatedInquiry = { ...item, ...inquiry, updated_at: new Date().toISOString() };
          return updatedInquiry;
        }));
        return updatedInquiry;
      }

      const { data, error } = await (supabase!
        .from('inquiries') as any)
        .update(inquiry)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchInquiries();
      return data as Inquiry;
    } catch (error) {
      console.error('Error updating inquiry:', error);
      return null;
    }
  };

  const deleteInquiry = async (id: string): Promise<boolean> => {
    try {
      if (isMockMode) {
        const hasItem = inquiries.some(item => item.id === id);
        if (!hasItem) return false;
        setInquiries(prev => prev.filter(item => item.id !== id));
        return true;
      }

      const { error } = await supabase!
        .from('inquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchInquiries();
      return true;
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      return false;
    }
  };

  // Settings
  const fetchSettings = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, settings: true }));
    try {
      if (isMockMode) {
        setSettings(mockSettings);
        return;
      }

      const { data, error } = await supabase!
        .from('settings')
        .select('*')
        .single();

      if (error) throw error;
      setSettings(data as Settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, settings: false }));
    }
  }, [isMockMode]);

  const updateSettings = async (newSettings: SettingsUpdate): Promise<Settings | null> => {
    try {
      if (isMockMode) {
        const updated = { ...mockSettings, ...newSettings, updated_at: new Date().toISOString() };
        setSettings(updated);
        return updated;
      }

      const { data, error } = await (supabase!
        .from('settings') as any)
        .update(newSettings)
        .eq('id', 1)
        .select()
        .single();

      if (error) throw error;
      setSettings(data as Settings);
      return data as Settings;
    } catch (error) {
      console.error('Error updating settings:', error);
      return null;
    }
  };

  // Stats
  const fetchStats = useCallback(async () => {
    try {
      if (isMockMode) {
        setStats({
          totalProjects: mockProjects.length,
          totalCapacity: mockProjects.reduce((sum, p) => sum + p.capacity_kw, 0),
          pendingInquiries: 2,
          pendingReviews: 1,
          totalInquiries: 5,
          approvedReviews: mockReviews.filter(r => r.is_approved).length,
        });
        return;
      }

      const [
        { count: projectsCount },
        { data: projects },
        { count: pendingInquiries },
        { count: pendingReviews },
        { count: totalInquiries },
        { count: approvedReviews },
      ] = await Promise.all([
        supabase!.from('projects').select('*', { count: 'exact', head: true }),
        supabase!.from('projects').select('capacity_kw'),
        supabase!.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase!.from('reviews').select('*', { count: 'exact', head: true }).eq('is_approved', false),
        supabase!.from('inquiries').select('*', { count: 'exact', head: true }),
        supabase!.from('reviews').select('*', { count: 'exact', head: true }).eq('is_approved', true),
      ]);

      const totalCapacity = (projects as { capacity_kw: number }[])?.reduce((sum, p) => sum + (p.capacity_kw || 0), 0) || 0;

      setStats({
        totalProjects: projectsCount || 0,
        totalCapacity,
        pendingInquiries: pendingInquiries || 0,
        pendingReviews: pendingReviews || 0,
        totalInquiries: totalInquiries || 0,
        approvedReviews: approvedReviews || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [isMockMode]);

  const value: DataContextType = {
    projects,
    fetchProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    
    reviews,
    approvedReviews,
    fetchReviews,
    fetchApprovedReviews,
    createReview,
    updateReview,
    deleteReview,
    approveReview,
    
    inquiries,
    fetchInquiries,
    createInquiry,
    updateInquiry,
    deleteInquiry,
    
    settings,
    fetchSettings,
    updateSettings,
    
    stats,
    fetchStats,
    
    isLoading,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
