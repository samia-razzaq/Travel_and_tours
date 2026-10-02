import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { authApi } from "@/services/api/endpoints";
import { tokenManager } from "@/lib/tokenManager";
import { User, LoginRequest, SignUpRequest, ErrorResponse } from "@/types/auth";
import {
  useLoginMutation,
  useSignUpMutation,
  useLogoutMutation,
} from "@/hooks/useAuth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<{
    success: boolean;
    user?: User;
    error?: string;
    message?: string;
  }>;
  signUp: (userData: SignUpRequest) => Promise<{
    success: boolean;
    user?: User;
    error?: string;
    message?: string;
    requiresLogin?: boolean;
  }>;
  logout: () => Promise<{
    success: boolean;
    message?: string;
    detail?: string;
    error?: string;
  }>;
  refreshAuth: () => Promise<void>;
  fetchUserData: () => Promise<void>;
  updateProfile: (
    updateData: Partial<User> & { password?: string }
  ) => Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loginMutation = useLoginMutation();
  const signUpMutation = useSignUpMutation();
  const logoutMutation = useLogoutMutation();

  // ✅ Fetch user data from API
  const fetchUserData = useCallback(async () => {
    try {
      const userData = await authApi.getCurrentUserData();
      setUser(userData);
      console.log("✅ Fresh user data fetched from API");
    } catch (error: any) {
      console.error("❌ Failed to fetch fresh user data:", error);
      if (error.response?.status === 401) {
        tokenManager.clearAccessToken();
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("auth_session"); // Clear flag on 401
      }
    }
  }, []);

  // ✅ Check auth ONLY if user was previously logged in
  useEffect(() => {
    const checkAuth = async () => {
      // Check if user had a previous session
      const hasSession = localStorage.getItem("auth_session") === "true";

      if (!hasSession) {
        console.log("❌ No previous session - skipping refresh API call");
        setIsLoading(false);
        return; // ✅ EXIT - No API call
      }

      console.log("🚀 Previous session found - verifying with backend...");

      try {
        console.log("📞 Calling POST /users/token/refresh/");
        const accessToken = await authApi.refreshToken();
        console.log("✅ Session still valid - user logged in!");

        tokenManager.setAccessToken(accessToken);
        setIsAuthenticated(true);
        await fetchUserData();
      } catch (error: any) {
        console.log("❌ Session expired - clearing auth state");
        tokenManager.clearAccessToken();
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("auth_session"); // ✅ Clear flag on error
      } finally {
        setIsLoading(false);
        console.log("✅ Auth check complete");
      }
    };

    checkAuth();
  }, [fetchUserData]);

  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("auth_session"); // ✅ Clear on logout event
    };
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      return new Promise<{
        success: boolean;
        user?: User;
        error?: string;
        message?: string;
      }>((resolve) => {
        loginMutation.mutate(credentials, {
          onSuccess: async (data) => {
            setIsAuthenticated(true);
            localStorage.setItem("auth_session", "true"); // ✅ Set flag on login

            try {
              await fetchUserData();
            } catch (err) {
              console.error("Failed to fetch user data after login", err);
            }

            resolve({
              success: true,
              user: user,
              message: data.message,
            });
          },
          onError: (error: any) => {
            const errorData = error?.response?.data;

            if (
              errorData?.errors?.non_field_errors &&
              Array.isArray(errorData.errors.non_field_errors)
            ) {
              resolve({
                success: false,
                error: errorData.errors.non_field_errors[0],
              });
              return;
            }

            if (errorData?.error && typeof errorData.error === "object") {
              const firstError = Object.values(errorData.error)[0];
              if (Array.isArray(firstError) && firstError.length > 0) {
                resolve({ success: false, error: firstError[0] });
                return;
              }
            }

            if (typeof errorData?.error === "string") {
              resolve({ success: false, error: errorData.error });
              return;
            }

            if (errorData?.message) {
              resolve({ success: false, error: errorData.message });
              return;
            }

            if (errorData?.detail) {
              resolve({ success: false, error: errorData.detail });
              return;
            }

            resolve({ success: false });
          },
        });
      });
    },
    [loginMutation, user, fetchUserData]
  );

  const signUp = useCallback(
    async (userData: SignUpRequest) => {
      return new Promise<{
        success: boolean;
        user?: User;
        error?: string;
        message?: string;
        requiresLogin?: boolean;
      }>((resolve) => {
        signUpMutation.mutate(userData, {
          onSuccess: (data) => {
            if (data.token?.access) {
              localStorage.setItem("auth_session", "true"); // ✅ Set flag on signup
              if (data.user) {
                setUser(data.user);
                setIsAuthenticated(true);
                resolve({
                  success: true,
                  user: data.user,
                  message: data.message,
                });
              } else {
                setIsAuthenticated(true);
                resolve({
                  success: true,
                  message: data.message,
                });
              }
            } else {
              resolve({
                success: true,
                requiresLogin: true,
                message: data.message,
              });
            }
          },
          onError: (error: any) => {
            const errorData = error?.response?.data;

            if (errorData?.error && typeof errorData.error === "object") {
              const errors = Object.entries(errorData.error).map(
                ([field, messages]) => {
                  const msg = Array.isArray(messages) ? messages[0] : messages;
                  return msg;
                }
              );
              resolve({ success: false, error: errors.join(", ") });
              return;
            }

            if (typeof errorData?.error === "string") {
              resolve({ success: false, error: errorData.error });
              return;
            }

            if (errorData?.message) {
              resolve({ success: false, error: errorData.message });
              return;
            }

            if (errorData?.detail) {
              resolve({ success: false, error: errorData.detail });
              return;
            }

            resolve({ success: false });
          },
        });
      });
    },
    [signUpMutation]
  );

  const logout = useCallback(async () => {
    return new Promise<{
      success: boolean;
      message?: string;
      detail?: string;
      error?: string;
    }>((resolve) => {
      logoutMutation.mutate(undefined, {
        onSuccess: (data) => {
          console.log("✅ Logout API success - clearing tokens");
          tokenManager.clearAccessToken();
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("auth_session"); // ✅ Clear flag on logout
          window.dispatchEvent(new Event("auth:logout"));

          resolve({
            success: true,
            message: data?.message,
            detail: data?.detail,
          });
        },
        onError: (error: any) => {
          console.error("❌ Logout API error:", error);

          tokenManager.clearAccessToken();
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("auth_session"); // ✅ Clear flag on logout error
          window.dispatchEvent(new Event("auth:logout"));

          const errorData = error?.response?.data;
          resolve({
            success: false,
            error: errorData?.message || errorData?.detail || errorData?.error,
          });
        },
      });
    });
  }, [logoutMutation]);

  const refreshAuth = useCallback(async () => {
    try {
      const accessToken = await authApi.refreshToken();
      tokenManager.setAccessToken(accessToken);
      setIsAuthenticated(true);
      localStorage.setItem("auth_session", "true");
    } catch (error) {
      console.log("Refresh failed");
      tokenManager.clearAccessToken();
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("auth_session");
    }
  }, []);

  const updateProfile = useCallback(
    async (
      updateData: Partial<User> & {
        password?: string;
      }
    ) => {
      try {
        const cleanedData = {
          ...updateData,
          phone_number:
            updateData.phone_number?.replace(/\s/g, "") ||
            updateData.phone_number,
        };
        const updatedUser = await authApi.updateProfile(cleanedData);
        setUser(updatedUser);
        return { success: true, user: updatedUser };
      } catch (error: any) {
        const errorData: ErrorResponse = error.response?.data;
        let errorMessage = "Update failed";
        if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorData?.detail) {
          errorMessage = errorData.detail;
        } else if (typeof errorData?.error === "string") {
          errorMessage = errorData.error;
        } else if (errorData?.error && typeof errorData.error === "object") {
          const errors = Object.entries(errorData.error).map(
            ([field, messages]) => {
              const msg = Array.isArray(messages) ? messages[0] : messages;
              return msg;
            }
          );
          errorMessage = errors.join(", ");
        }
        return { success: false, error: errorMessage };
      }
    },
    []
  );

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signUp,
    logout,
    refreshAuth,
    fetchUserData,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
