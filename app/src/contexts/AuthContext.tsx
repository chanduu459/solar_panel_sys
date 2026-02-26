import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Profile } from '../types';

const MOCK_ADMIN_EMAIL = 'admin@solarsystems.in';
const MOCK_ADMIN_PASSWORD = 'admin123';
const MOCK_SESSION_KEY = 'mock_admin_session';
const PROFILE_FETCH_TIMEOUT_MS = 10000;

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fetch profile with a timeout to prevent hanging
async function fetchProfileSafe(
  userId: string,
  timeoutMs = PROFILE_FETCH_TIMEOUT_MS
): Promise<Profile | null> {
  try {
    const fetchPromise = supabase!
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
      setTimeout(
        () => resolve({ data: null, error: new Error('Profile fetch timed out') }),
        timeoutMs
      )
    );
    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);
    if (error) {
      console.warn('Profile fetch error:', error.message);
      return null;
    }
    return data as Profile;
  } catch (err) {
    console.warn('Profile fetch failed:', err);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Track in-flight profile fetch so we don't double-fetch
  const profileFetchRef = useRef<string | null>(null);

  const hasAuthClient = Boolean(supabase && typeof (supabase as any).auth === 'object');

  // Whenever user.id changes, fetch their profile in the background
  useEffect(() => {
    if (!user?.id || !hasAuthClient) return;
    if (profileFetchRef.current === user.id) return; // already fetching/fetched
    profileFetchRef.current = user.id;

    fetchProfileSafe(user.id).then((profileData) => {
      setProfile(profileData);
      setUser((prev) =>
        prev ? { ...prev, is_admin: profileData?.is_admin ?? false } : null
      );
      setIsLoading(false);
    });
  }, [user?.id, hasAuthClient]);

  // Refresh profile (callable externally)
  const refreshProfile = async () => {
    if (!user?.id) return;
    profileFetchRef.current = null; // reset so fetch runs again
    const profileData = await fetchProfileSafe(user.id);
    setProfile(profileData);
    setUser((prev) =>
      prev ? { ...prev, is_admin: profileData?.is_admin ?? false } : null
    );
  };

  // Bootstrap: check session once on mount, then subscribe to auth changes
  useEffect(() => {
    // ── Mock mode (no Supabase credentials) ──────────────────────────────────
    if (!hasAuthClient) {
      const isMockAdminLoggedIn = localStorage.getItem(MOCK_SESSION_KEY) === '1';
      if (isMockAdminLoggedIn) {
        const mockUser: User = {
          id: 'mock-admin',
          email: MOCK_ADMIN_EMAIL,
          is_admin: true,
          full_name: 'Demo Admin',
        };
        const mockProfile: Profile = {
          id: 'mock-admin',
          is_admin: true,
          full_name: 'Demo Admin',
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUser(mockUser);
        setProfile(mockProfile);
      }
      setIsLoading(false);
      return;
    }

    // ── Real Supabase mode ────────────────────────────────────────────────────
    // Check existing session on page load
    supabase!.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          is_admin: false, // profile useEffect will update this
          full_name: session.user.user_metadata?.full_name || null,
        });
        // isLoading=false will be set by the profile useEffect above
      } else {
        setIsLoading(false);
      }
    }).catch(() => setIsLoading(false));

    // Subscribe to auth state changes — SYNCHRONOUS only, no awaiting inside
    const { data: { subscription } } = supabase!.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          profileFetchRef.current = null; // allow profile re-fetch
          setUser({
            id: session.user.id,
            email: session.user.email!,
            is_admin: false, // profile useEffect will update this
            full_name: session.user.user_metadata?.full_name || null,
          });
          // isLoading=false is handled by the profile useEffect
        } else {
          profileFetchRef.current = null;
          setUser(null);
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [hasAuthClient]);

  // Sign in
  const signIn = async (email: string, password: string) => {
    // ── Mock mode ─────────────────────────────────────────────────────────────
    if (!hasAuthClient) {
      const isValid =
        email.trim().toLowerCase() === MOCK_ADMIN_EMAIL &&
        password === MOCK_ADMIN_PASSWORD;
      if (!isValid) return { error: new Error('Invalid credentials') };

      const mockUser: User = { id: 'mock-admin', email: MOCK_ADMIN_EMAIL, is_admin: true, full_name: 'Demo Admin' };
      const mockProfile: Profile = {
        id: 'mock-admin', is_admin: true, full_name: 'Demo Admin',
        avatar_url: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      };
      setUser(mockUser);
      setProfile(mockProfile);
      localStorage.setItem(MOCK_SESSION_KEY, '1');
      return { error: null };
    }

    // ── Real Supabase mode ─────────────────────────────────────────────────────
    try {
      setIsLoading(true);

      // Race signIn against a timeout so it never hangs forever
      const authResult = await Promise.race([
        supabase!.auth.signInWithPassword({ email, password }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Login timed out. Please try again.')), 15000)
        ),
      ]);

      if (authResult.error) {
        setIsLoading(false);
        return { error: authResult.error };
      }

      // Immediately fetch profile so ProtectedRoute has isAdmin before navigating
      const session = authResult.data?.session;
      if (session?.user) {
        profileFetchRef.current = session.user.id;
        const profileData = await fetchProfileSafe(session.user.id);
        const userData: User = {
          id: session.user.id,
          email: session.user.email!,
          is_admin: profileData?.is_admin ?? false,
          full_name: session.user.user_metadata?.full_name || null,
        };
        setUser(userData);
        setProfile(profileData);
      }

      setIsLoading(false);
      return { error: null };
    } catch (err) {
      setIsLoading(false);
      return { error: err as Error };
    }
  };

  // Sign out
  const signOut = async () => {
    if (hasAuthClient) {
      await supabase!.auth.signOut();
    } else {
      localStorage.removeItem(MOCK_SESSION_KEY);
    }
    profileFetchRef.current = null;
    setUser(null);
    setProfile(null);
  };

  const isAdmin = (user?.is_admin || profile?.is_admin) ?? false;

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, isAdmin, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
