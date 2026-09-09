export type AdminUser = {
  id: number;
  email: string;
  is_active: boolean;
  last_login_at: string | null;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  admin: AdminUser;
};

export type LoginCredentials = {
  email: string;
  password: string;
};