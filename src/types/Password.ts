// src/types/password.ts

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message?: string;
  detail?: string;
  error?: string;
}
// src/types/Password.ts

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message?: string;
  detail?: string;
  error?: string;
}

export interface ResetPasswordRequest {
  password: string;
  password2: string;
  logout_all: boolean;
}

export interface ResetPasswordResponse {
  message?: string;
  detail?: string;
  non_field_errors?: string[];
  error?: string | Record<string, string[]>;
}

export interface ResetPasswordParams {
  uid: string;
  token: string;
  data: ResetPasswordRequest;
}
