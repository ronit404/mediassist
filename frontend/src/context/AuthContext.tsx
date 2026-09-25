'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, LoginCredentials, SignupData, PatientProfile } from '@/types';
import {
  apiLogin,
  apiSignup,
  apiLogout,
  getSavedSession,
  apiForgotPassword,
  apiResetPassword,
  PATIENT_PROFILE_KEY,
} from '@/lib/auth-api';
import { fetchPatientProfile, updatePatientProfile } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  patientProfile: PatientProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  signup: (data: SignupData) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<PatientProfile>) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (newPassword: string) => Promise<{ success: boolean; message: string }>;
  
  // Auth Modal Controls
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup' | 'forgot-password';
  redirectPath: string | null;
  openAuthModal: (mode?: 'login' | 'signup' | 'forgot-password', redirect?: string) => void;
  closeAuthModal: () => void;
  setAuthModalMode: (mode: 'login' | 'signup' | 'forgot-password') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot-password'>('login');
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  // Hydrate session & patient profile on initial load
  useEffect(() => {
    async function initSession() {
      try {
        const session = getSavedSession();
        if (session && session.user) {
          setUser(session.user);
          setToken(session.token);

          // Fetch dynamic patient profile from MongoDB
          const profile = await fetchPatientProfile(session.token);
          if (profile) {
            setPatientProfile(profile);
          } else {
            // Check local fallback
            const cached = localStorage.getItem(PATIENT_PROFILE_KEY);
            if (cached) {
              setPatientProfile(JSON.parse(cached));
            }
          }
        }
      } catch (e) {
        console.error('Failed to load session:', e);
      } finally {
        setIsLoading(false);
      }
    }

    initSession();
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    const profile = await fetchPatientProfile(token);
    if (profile) {
      setPatientProfile(profile);
    }
  }, [token]);

  const updateProfile = async (data: Partial<PatientProfile>): Promise<boolean> => {
    if (!token) return false;
    const res = await updatePatientProfile(data, token);
    if (res.success && res.patient) {
      setPatientProfile(res.patient);
      return true;
    }
    return false;
  };

  const openAuthModal = useCallback((mode: 'login' | 'signup' | 'forgot-password' = 'login', redirect?: string) => {
    setAuthModalMode(mode);
    if (redirect !== undefined) {
      setRedirectPath(redirect);
    }
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await apiLogin(credentials);
      setUser(res.user);
      setToken(res.token);
      if (res.patient) {
        setPatientProfile(res.patient);
      } else {
        const profile = await fetchPatientProfile(res.token);
        if (profile) setPatientProfile(profile);
      }
      setIsAuthModalOpen(false);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await apiSignup(data);
      setUser(res.user);
      setToken(res.token);
      if (res.patient) {
        setPatientProfile(res.patient);
      } else {
        const profile = await fetchPatientProfile(res.token);
        if (profile) setPatientProfile(profile);
      }
      setIsAuthModalOpen(false);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    await apiLogout();
    // Complete state wipe to guarantee session and cache isolation
    setUser(null);
    setToken(null);
    setPatientProfile(null);
  };

  const forgotPassword = async (email: string) => {
    return await apiForgotPassword(email);
  };

  const resetPassword = async (newPassword: string) => {
    return await apiResetPassword(newPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        patientProfile,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        refreshProfile,
        forgotPassword,
        resetPassword,
        isAuthModalOpen,
        authModalMode,
        redirectPath,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

