// ============================================
// SOLAR SYSTEMS - TYPES
// ============================================

// Project Types
export interface Project {
  id: string;
  title: string;
  description: string;
  capacity_kw: number;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  images: string[];
  installation_date: string | null;
  status: 'active' | 'completed' | 'pending';
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ProjectInsert {
  title: string;
  description: string;
  capacity_kw: number;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  images?: string[];
  installation_date?: string | null;
  status?: 'active' | 'completed' | 'pending';
  tags?: string[];
}

export interface ProjectUpdate {
  title?: string;
  description?: string;
  capacity_kw?: number;
  address?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
  installation_date?: string | null;
  status?: 'active' | 'completed' | 'pending';
  tags?: string[];
}

// Review Types
export interface Review {
  id: string;
  project_id: string | null;
  reviewer_name: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  admin_response: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  project?: {
    title: string;
    city: string;
  };
}

export interface ReviewInsert {
  project_id?: string | null;
  reviewer_name: string;
  rating: number;
  comment: string;
  is_approved?: boolean;
  admin_response?: string | null;
}

export interface ReviewUpdate {
  reviewer_name?: string;
  rating?: number;
  comment?: string;
  is_approved?: boolean;
  admin_response?: string | null;
}

// Inquiry Types
export interface Inquiry {
  id: string;
  project_id: string | null;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'archived';
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  project?: {
    title: string;
  };
}

export interface InquiryInsert {
  project_id?: string | null;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface InquiryUpdate {
  status?: 'new' | 'in_progress' | 'resolved' | 'archived';
  notes?: string | null;
}

// Settings Types
export interface Settings {
  id: number;
  org_name: string;
  contact_email: string;
  contact_phone: string;
  org_address: string;
  // Calculator settings
  kwh_per_kw_per_month: number;
  tariff_per_kwh: number;
  system_cost_per_kw: number;
  subsidy_percentage: number;
  maintenance_cost_per_kw_year: number;
  // Carousel settings
  carousel_speed: number;
  // Map settings
  map_center_lat: number;
  map_center_lng: number;
  map_zoom: number;
  updated_at: string;
}

export interface SettingsUpdate {
  org_name?: string;
  contact_email?: string;
  contact_phone?: string;
  org_address?: string;
  kwh_per_kw_per_month?: number;
  tariff_per_kwh?: number;
  system_cost_per_kw?: number;
  subsidy_percentage?: number;
  maintenance_cost_per_kw_year?: number;
  carousel_speed?: number;
  map_center_lat?: number;
  map_center_lng?: number;
  map_zoom?: number;
}

// Profile Types
export interface Profile {
  id: string;
  is_admin: boolean;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// Calculator Types
export interface CalculatorInputs {
  monthlyBill: number;
  monthlyKwh: number;
  useKwh: boolean;
}

export interface CalculatorResults {
  currentMonthlyCost: number;
  recommendedSystemSize: number;
  systemCost: number;
  subsidyAmount: number;
  netCost: number;
  monthlyGeneration: number;
  monthlySavings: number;
  yearlySavings: number;
  savingsPercentage: number;
  paybackPeriod: number;
  twentyFiveYearSavings: number;
  co2Reduction: number;
}

// Map Types
export interface MapMarker {
  id: string;
  title: string;
  capacity_kw: number;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  images: string[];
}

// Search Types
export interface SearchFilters {
  query: string;
  city: string;
  minCapacity: number | null;
  maxCapacity: number | null;
  status: string | null;
  tags: string[];
}

// Auth Types
export interface User {
  id: string;
  email: string;
  is_admin: boolean;
  full_name: string | null;
}

// Component Props Types
export interface ProjectCardProps {
  project: Project;
  onClick?: (project: Project) => void;
}

export interface ReviewCardProps {
  review: Review;
  showProject?: boolean;
}

export interface InfiniteCarouselProps {
  projects: Project[];
  speed?: number;
  pauseOnHover?: boolean;
}

export interface MapProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (marker: MapMarker) => void;
  onMapClick?: (lat: number, lng: number) => void;
  selectable?: boolean;
}

export interface CalculatorProps {
  settings: Settings;
}

export interface InquiryFormProps {
  projectId?: string | null;
  projectTitle?: string;
  onSuccess?: () => void;
}

// Stats Types
export interface DashboardStats {
  totalProjects: number;
  totalCapacity: number;
  pendingInquiries: number;
  pendingReviews: number;
  totalInquiries: number;
  approvedReviews: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
