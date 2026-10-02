import React, { useState } from "react";
import { Mail, ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo/logo-2.png";
import { useForgotPassword } from "@/hooks/useForgotResetpass";
import { ForgotPasswordResponse } from "@/types/Password";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const handleSubmit = () => {
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // API call
    forgotPassword(
      { email },
      {
        onSuccess: (data: ForgotPasswordResponse) => {
          // ✅ Show backend message
          if (data.message) {
            toast.success(data.message);
          } else if (data.detail) {
            toast.success(data.detail);
          }
          setIsSubmitted(true);
        },
        onError: (error: AxiosError<ForgotPasswordResponse>) => {
          // ✅ Show backend error
          const errorData = error?.response?.data;

          if (errorData?.message) {
            setError(errorData.message);
            toast.error(errorData.message);
          } else if (errorData?.detail) {
            setError(errorData.detail);
            toast.error(errorData.detail);
          } else if (errorData?.error) {
            const errorMsg =
              typeof errorData.error === "string"
                ? errorData.error
                : Object.values(errorData.error)[0];
            const finalError = Array.isArray(errorMsg) ? errorMsg[0] : errorMsg;
            setError(finalError as string);
            toast.error(finalError as string);
          }
        },
      }
    );
  };

  const handleBackToSignIn = () => {
    navigate("/auth");
  };

  if (isSubmitted) {
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
                Check Your Email
              </h2>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to <strong>{email}</strong>.
                Please check your inbox.
              </p>
            </div>
          </CardContent>

          <CardFooter>
            <Button onClick={handleBackToSignIn} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
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
              Forgot Password
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Enter your email address and we'll send you a reset link.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Enter your email address"
                  className="pl-10"
                  disabled={isPending}
                />
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
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
