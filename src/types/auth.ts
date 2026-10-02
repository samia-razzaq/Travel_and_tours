// // src/types/auth.ts

// export interface User {
//   id: number;
//   email: string;
//   first_name: string;
//   last_name: string;
//   phone_number: string;
//   is_admin: boolean;
// }

// // Sign Up Types
// export interface SignUpRequest {
//   email: string;
//   password: string;
//   first_name: string;
//   last_name: string;
//   phone_number: string;
//   isGuest?: boolean; // Optional since backend might not require it
// }

// export interface SignUpResponse {
//   message: string;
//   user?: User;
//   token?: {
//     access: string;
//   };
// }

// // Login Types
// export interface LoginRequest {
//   email: string;
//   password: string;
// }

// export interface LoginResponse {
//   token: {
//     access: string;
//   };
//   user: User;
//   messaege: string; // Backend typo - keeping as is
// }

// // Refresh Token Types
// export interface RefreshResponse {
//   access: string;
// }

// // Error Response Type
// export interface ErrorResponse {
//   error?: string | Record<string, string[]>;
//   message?: string;
//   detail?: string;
// }
// export interface ErrorResponse {
//   message?: string;
//   detail?: string;
//   error?: string | Record<string, string[]>;
//   errors?: {
//     // ✅ Ye add karo
//     non_field_errors?: string[];
//     [key: string]: string[] | undefined;
//   };
// }
// src/types/auth.ts

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  password?: string;
  is_admin: boolean;
}

// Sign Up Types
export interface SignUpRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  isGuest?: boolean; // Optional since backend might not require it
}

export interface SignUpResponse {
  message: string;
  user?: User;
  token?: {
    access: string;
  };
}

// Login Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: {
    access: string;
  };
  user: User;
  messaege: string; // Backend typo - keeping as is
  message?: string;
}

// Refresh Token Types
export interface RefreshResponse {
  access: string;
}

// Error Response Type
export interface ErrorResponse {
  error?: string | Record<string, string[]>;
  message?: string;
  detail?: string;
}
export interface ErrorResponse {
  message?: string;
  detail?: string;
  error?: string | Record<string, string[]>;
  errors?: {
    // ✅ Ye add karo
    non_field_errors?: string[];
    [key: string]: string[] | undefined;
  };
}
// types/auth.types.ts
export interface LogoutAllDevicesResponse {
  detail?: string;
  code?: string;
  messages?: Array<{
    token_class: string;
    token_type: string;
    message: string;
  }>;
  success?: boolean;
  message?: string;
}

export interface ApiError {
  detail?: string;
  code?: string;
  messages?: Array<{
    token_class: string;
    token_type: string;
    message: string;
  }>;
}
