import { apiClient } from "./axios";
import { ContactFormData, ContactResponse } from "@/types/tourism";
import type { LogoutAllDevicesResponse } from "@/types/auth";
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ResetPasswordParams,
} from "@/types/Password";
import { tokenManager } from "@/lib/tokenManager";
import {
  City,
  Currency,
  Location,
  Package,
  PackageDetail,
  Pricing,
} from "@/types/tourism";
import { Blog, BlogCategory } from "@/types/blogs";
import {
  AddToCartPayload,
  AddToCartResponse,
  Cart,
  CartItem,
  CheckoutResponse,
  RemoveFromCartResponse,
  UpdateCartItemPayload,
  UpdateCartItemResponse,
} from "@/types/cart";
import {
  SignUpRequest,
  SignUpResponse,
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  User,
} from "@/types/auth";
import { Booking, BookingsApiResponse, PaginatedBookingsResponse } from "@/types/bookings";

// ==================== TOURISM API ====================

export const tourismApi = {
  getCurrencies: async (): Promise<Currency[]> => {
    const { data } = await apiClient.get("/api/tourism/currencies/");
    return data;
  },

  getCities: async (): Promise<City[]> => {
    const { data } = await apiClient.get("/api/tourism/cities/");
    return data;
  },

  getLocations: async (cityName?: string): Promise<Location[]> => {
    const params = cityName ? { city: cityName } : {};
    const { data } = await apiClient.get("/api/tourism/location/", { params });
    return data;
  },

  getPackages: async (cityName?: string): Promise<Package[]> => {
    const params = cityName ? { city: cityName } : {};
    const { data } = await apiClient.get("/api/tourism/packages/", { params });
    return data;
  },

  getPackageDetail: async (id: number): Promise<PackageDetail> => {
    const { data } = await apiClient.get("/api/tourism/package-detail/", {
      params: { id },
    });
    return data;
  },

  getPricing: async (): Promise<Pricing[]> => {
    const { data } = await apiClient.get("/api/tourism/pricing/");
    return data;
  },

  // New method for fetching all bookings
  // getBookings: async (): Promise<Booking[]> => {
  //   const { data } = await apiClient.get("/api/tourism/booking/");
  //   return data;
  // },
  getBookings: async (): Promise<Booking[]> => {
    const { data } = await apiClient.get<BookingsApiResponse | PaginatedBookingsResponse | Booking[]>("/api/tourism/booking/");
    
    // Handle the "Booking List" wrapper
    if (data && typeof data === 'object' && 'Booking List' in data) {
      return data["Booking List"];
    }
    
    // Handle paginated response
    if (data && typeof data === 'object' && 'results' in data && Array.isArray(data.results)) {
      return data.results;
    }
    
    // Handle direct array response
    if (Array.isArray(data)) {
      return data;
    }
    
    console.error("Unexpected response format for bookings:", data);
    return [];
  },
};

// ==================== BLOG API ====================

export const blogApi = {
  getBlogs: async (categoryId?: number): Promise<Blog[]> => {
    const params = categoryId ? { category: categoryId } : {};
    const { data } = await apiClient.get("/api/blogs/blogs/", { params });
    return data;
  },

  getBlogBySlug: async (slug: string): Promise<Blog> => {
    const { data } = await apiClient.get(`/api/blogs/blogs/${slug}/`);
    return data;
  },

  getBlogCategories: async (): Promise<BlogCategory[]> => {
    const { data } = await apiClient.get("/api/blogs/category/");
    return data;
  },
};

//Cart endpoints are below
export const cartApi = {
  addToCart: async (payload: AddToCartPayload): Promise<AddToCartResponse> => {
    const { data } = await apiClient.post(
      "/api/tourism/cart/add_item/",
      payload
    );
    return data;
  },

  getCart: async (): Promise<Cart> => {
    const { data } = await apiClient.get("/api/tourism/cart/");
    return data;
  },

  updateCartItem: async (
    itemId: number,
    payload: UpdateCartItemPayload
  ): Promise<UpdateCartItemResponse> => {
    const response = await apiClient.patch(
      `/api/tourism/cart/${itemId}/update_item/`,
      payload
    );
    const data = response.data;
    return data;
  },

  removeFromCart: async (itemId: number): Promise<RemoveFromCartResponse> => {
    const response = await apiClient.delete(
      `/api/tourism/cart/${itemId}/remove_item/`
    );
    const data = response.data;
    return data;
  },

  checkout: async (): Promise<CheckoutResponse> => {
    const { data } = await apiClient.post("/api/tourism/cart/checkout/");
    return data;
  },
};
// ==================== AUTH API ====================

export const authApi = {
  signUp: async (userData: SignUpRequest): Promise<SignUpResponse> => {
    const { data } = await apiClient.post<SignUpResponse>(
      "/api/users/signup/",
      userData
    );

    // Store access token if returned (some backends return token on signup)
    if (data.token?.access) {
      tokenManager.setAccessToken(data.token.access);
    }

    return data;
  },

  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>(
      "/api/users/login/",
      credentials
    );

    // Store access token in memory
    if (data.token?.access) {
      tokenManager.setAccessToken(data.token.access);
    }

    return data;
  },

  refreshToken: async (): Promise<string> => {
    const { data } = await apiClient.post<RefreshResponse>(
      "/api/users/token/refresh/"
    );
    return data.access;
  },

  // ✅ UPDATED LOGOUT
  logout: async (): Promise<{ message?: string; detail?: string }> => {
    try {
      const { data } = await apiClient.post("/api/users/logout/");
      return data;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      tokenManager.clearAccessToken();
    }
  },

  getCurrentUserData: async (): Promise<User> => {
    const { data } = await apiClient.get<{ user: User; is_admin: boolean }>(
      "/api/users/profile/"
    );
    return data.user;
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const { data } = await apiClient.patch<User>(
      "/api/users/profile/",
      userData
    );
    return data;
  },

  // getCurrentUser: async (): Promise<User> => {
  //   const { data } = await apiClient.get<User>("/api/users/");
  //   return data;
};
export const passwordResetApi = {
  forgotPassword: async (
    email: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> => {
    const { data } = await apiClient.post<ForgotPasswordResponse>(
      "/api/users/forgot-password/",
      email
    );
    return data;
  },

  resetPassword: async (
    params: ResetPasswordParams
  ): Promise<ResetPasswordResponse> => {
    const { uid, token, data: requestData } = params;
    const { data } = await apiClient.post<ResetPasswordResponse>(
      `/api/users/password-reset/${uid}/${token}/`,
      requestData
    );
    return data;
  },
};

//contact form
export const contactApi = {
  sendInquiry: async (data: ContactFormData): Promise<ContactResponse> => {
    const response = await apiClient.post<ContactResponse>(
      "/api/tourism/inquiry-email/",
      data
    );
    return response.data;
  },
};
export default apiClient;
