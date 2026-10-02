// src/hooks/useForgotResetPassword.ts

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { passwordResetApi } from "@/services/api/endpoints";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordParams,
  ResetPasswordResponse,
} from "@/types/Password";

//  FORGOT PASSWORD HOOK

export const useForgotPassword = () => {
  return useMutation<
    ForgotPasswordResponse,
    AxiosError<ForgotPasswordResponse>,
    ForgotPasswordRequest,
    unknown
  >({
    mutationFn: (email: ForgotPasswordRequest) =>
      passwordResetApi.forgotPassword(email),
  });
};

// ==================== RESET PASSWORD HOOK ====================

export const useResetPassword = () => {
  return useMutation<
    ResetPasswordResponse,
    AxiosError<ResetPasswordResponse>,
    ResetPasswordParams,
    unknown
  >({
    mutationFn: (params: ResetPasswordParams) =>
      passwordResetApi.resetPassword(params),
  });
};
