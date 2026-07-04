export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  tier: 'regular' | 'vip' | 'pro';
  loyalty_points: number;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  user: AuthUser | null;
  access_token?: string;
  expires_at?: number;
  isLoading: boolean;
  error?: string | null;
}

export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface PasswordResetData {
  email: string;
}

export interface UpdateProfileData {
  full_name?: string;
  phone?: string;
  avatar_url?: string;
}
