import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AuthContext } from "@/context/authContext";
import { authApi } from "@/services/api/endpoints";
import type {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
} from "@/types/auth";

// CONTEXT HOOK

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

//  HELPER HOOKS

export const useLogin = () => {
  const { login } = useAuth();
  return login;
};

export const useSignUp = () => {
  const { signUp } = useAuth();
  return signUp;
};

export const useLogout = () => {
  const { logout } = useAuth();
  return logout;
};

export const useCurrentUser = () => {
  const { user } = useAuth();
  return user;
};

export const useIsAdmin = () => {
  const { user } = useAuth();
  return user?.is_admin || false;
};

export const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};

//TANSTACK QUERY MUTATIONS

export const useLoginMutation = () => {
  return useMutation<LoginResponse, AxiosError<any>, LoginRequest, unknown>({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
  });
};

export const useSignUpMutation = () => {
  return useMutation<SignUpResponse, AxiosError<any>, SignUpRequest, unknown>({
    mutationFn: (userData: SignUpRequest) => {
      // Clean the phone number by removing spaces (extend to /\D/g if you want to remove all non-digits)
      const cleanedData = {
        ...userData,
        phone_number: userData.phone_number?.replace(/\s/g, "") || "",
      };
      return authApi.signUp(cleanedData);
    },
  });
};

export const useLogoutMutation = () => {
  return useMutation<
    { message?: string; detail?: string },
    AxiosError<any>,
    void,
    unknown
  >({
    mutationFn: () => authApi.logout(),
  });
};

export const useFetchUserData = () => {
  const { fetchUserData } = useAuth();
  return fetchUserData;
};

export const useUpdateProfile = () => {
  const { updateProfile } = useAuth();
  return updateProfile;
};
