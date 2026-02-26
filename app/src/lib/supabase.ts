import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();
const bucket = 'project-images';
const hasSupabaseCredentials = Boolean(supabaseUrl && supabaseAnonKey);

if (!hasSupabaseCredentials) {
  console.warn('Supabase credentials not configured. Using mock data mode.');
}

export const supabase: SupabaseClient<Database> | null = hasSupabaseCredentials
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

const buildPublicUrl = (path: string): string =>
  `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;

// Storage helper functions
export const uploadImage = async (file: File, path: string): Promise<string | null> => {
  try {
    if (!supabase) return null;

    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: false,
      contentType: file.type || 'application/octet-stream',
    });

    if (error) throw error;

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    return data?.publicUrl || buildPublicUrl(path);
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

export const deleteImage = async (path: string): Promise<boolean> => {
  try {
    if (!supabase) return false;

    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

// Helper to extract path from public URL
export const getPathFromUrl = (url: string): string => {
  const match = url.match(/project-images\/(.+)$/);
  return match ? match[1] : '';
};
