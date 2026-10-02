import React, { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, ArrowLeft, Check } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo/logo-2.png";
import { useResetPassword } from "@/hooks/useForgotResetpass";
import { ResetPasswordResponse } from "@/types/Password";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { uid, token } = useParams<{ uid: string; token: string }>();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [logoutAll, setLogoutAll] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const { mutate: resetPassword, isPending } = useResetPassword();

  // ✅ UPDATED: Password 8-12 characters only
  useEffect(() => {
    const newErrors = {
      password: "",
      confirmPassword: "",
    };

    if (password) {
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (
        password.length < 8 ||
        password.length > 15 ||
        !hasUppercase ||
        !hasLowercase ||
        !hasNumber ||
        !hasSpecial
      ) {
        newErrors.password =
          "Password must be 8-15 characters with uppercase, lowercase, number, and special character";
      }
    }

    if (confirmPassword) {
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
  }, [password, confirmPassword]);

  // ✅ UPDATED: Password 8-12 characters only
  const validateForm = () => {
    const newErrors = {
      password: "",
      confirmPassword: "",
    };

    if (!password) {
      newErrors.password = " Please enter your Password";
    } else {
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (
        password.length < 8 ||
        password.length > 15 ||
        !hasUppercase ||
        !hasLowercase ||
        !hasNumber ||
        !hasSpecial
      ) {
        newErrors.password =
          "Password must be 8-15 characters with uppercase, lowercase, number, and special character";
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return !newErrors.password && !newErrors.confirmPassword;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    if (!uid || !token) {
      toast.error("Invalid reset link");
      return;
    }

    resetPassword(
      {
        uid,
        token,
        data: {
          password,
          password2: confirmPassword,
          logout_all: logoutAll,
        },
      },
      {
        onSuccess: (data: ResetPasswordResponse) => {
          if (data.message) {
            toast.success(data.message);
          } else if (data.detail) {
            toast.success(data.detail);
          } else {
            toast.success("Password reset successfully!");
          }

          setIsSuccess(true);

          setTimeout(() => {
            navigate("/auth");
          }, 2000);
        },
        onError: (error: AxiosError<ResetPasswordResponse>) => {
          const errorData = error?.response?.data;

          if (
            errorData?.non_field_errors &&
            Array.isArray(errorData.non_field_errors) &&
            errorData.non_field_errors.length > 0
          ) {
            toast.error(errorData.non_field_errors[0]);
            return;
          }

          if (errorData?.error && typeof errorData.error === "object") {
            const firstErrorKey = Object.keys(errorData.error)[0];
            const firstError = errorData.error[firstErrorKey];
            if (Array.isArray(firstError) && firstError.length > 0) {
              toast.error(firstError[0]);
            } else if (typeof firstError === "string") {
              toast.error(firstError);
            }
            return;
          }

          if (typeof errorData?.error === "string") {
            toast.error(errorData.error);
            return;
          }

          if (errorData?.message) {
            toast.error(errorData.message);
            return;
          }

          if (errorData?.detail) {
            toast.error(errorData.detail);
            return;
          }

          if (error.message) {
            toast.error(error.message);
          } else {
            toast.error("Failed to reset password. Please try again.");
          }
        },
      }
    );
  };

  const handleBackToSignIn = () => {
    navigate("/auth");
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 p-4">
        <Card className="w-full max-w-md">
          <div className="flex items-center justify-center py-6">
            <img src={logo} alt="Logo" className="w-auto h-20" />
          </div>

          <CardContent>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Password Reset Successful!
              </h2>
              <p className="text-gray-600 mb-6">
                Your password has been successfully reset. Redirecting to sign
                in...
              </p>
            </div>
          </CardContent>

          <CardFooter>
            <Button onClick={handleBackToSignIn} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Sign In
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 p-4">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-center py-6">
          <img src={logo} alt="Logo" className="w-auto h-20" />
        </div>

        <CardContent>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Reset Password
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Please enter your new password below.
            </p>
          </div>

          <div className="space-y-4">
            {/* New Password Field */}
            <div className="space-y-2">
              <Label>New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="pl-10 pr-10"
                  maxLength={15}
                  disabled={isPending}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isPending}
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Confirm new password"
                  className="pl-10 pr-10"
                  maxLength={15}
                  disabled={isPending}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isPending}
                >
                  {showConfirmPassword ? (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Logout All Devices Checkbox */}
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="logout-all"
                checked={logoutAll}
                onCheckedChange={(checked) => setLogoutAll(checked as boolean)}
                disabled={isPending}
                className="border-gray-300"
              />
              <label
                htmlFor="logout-all"
                className="text-sm text-gray-700 font-medium leading-none cursor-pointer select-none"
              >
                Logout from all devices
              </label>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              className="w-full mt-6"
              disabled={
                isPending || !!errors.password || !!errors.confirmPassword
              }
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            variant="ghost"
            onClick={handleBackToSignIn}
            className="w-full"
            disabled={isPending}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
