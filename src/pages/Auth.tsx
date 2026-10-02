// import { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input, PhoneInput } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Loader2 } from "lucide-react";
// import logo from "@/assets/logo/logo-2.png";
// import { useAuth } from "@/hooks/useAuth";
// import { useToast } from "@/hooks/use-toast";

// const signInSchema = z.object({
//   email: z.string().email("Please enter a valid email address"),
//   password: z.string().min(1, "Password is required"),
// });

// const signUpSchema = z
//   .object({
//     firstname: z
//       .string()
//       .min(2, "First name must be at least 2 characters long")
//       .max(30, "First name must not exceed 30 characters"),
//     lastname: z
//       .string()
//       .min(2, "Last name must be at least 2 characters long")
//       .max(30, "Last name must not exceed 30 characters"),
//     email: z.string().email("Please enter a valid email address"),
//     phone: z
//       .string()
//       .min(8, "Phone number is required")
//       .regex(/^\+92\s\d{10}$/, "Invalid phone number format"),
//     password: z
//       .string()
//       .min(
//         8,
//         "Password must be 8-15 characters with A-Z, a-z, 0-9, and special character"
//       )
//       .max(
//         15,
//         "Password must be 8-15 characters with A-Z, a-z, 0-9, and special character"
//       )
//       .regex(
//         /[A-Z]/,
//         "Password must be 8-15 characters with A-Z, a-z, 0-9, and special character"
//       )
//       .regex(
//         /[a-z]/,
//         "Password must be 8-15 characters with A-Z, a-z, 0-9, and special character"
//       )
//       .regex(
//         /[0-9]/,
//         "Password must be 8-15 characters with A-Z, a-z, 0-9, and special character"
//       )
//       .regex(
//         /[!@#$%^&*(),.?":{}|<>]/,
//         "Password must be 8-15 characters with A-Z, a-z, 0-9, and special character"
//       ),
//     confirmpassword: z.string().min(8, "Please confirm your password"),
//   })
//   .refine((data) => data.password === data.confirmpassword, {
//     message: "Passwords do not match",
//     path: ["confirmpassword"],
//   });

// type SignInFormData = z.infer<typeof signInSchema>;
// type SignUpFormData = z.infer<typeof signUpSchema>;

// function Auth() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { login, signUp } = useAuth();
//   const location = useLocation();
//   const returnUrl = location.state?.returnUrl || "/";

//   const [phone, setPhone] = useState("");
//   const [selectedCountry, setSelectedCountry] = useState<any>(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [activeTab, setActiveTab] = useState("signin");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [passwordValue, setPasswordValue] = useState("");

//   const {
//     register: registerSignIn,
//     handleSubmit: handleSignInSubmit,
//     formState: { errors: signInErrors },
//     reset: resetSignIn,
//   } = useForm<SignInFormData>({
//     resolver: zodResolver(signInSchema),
//   });

//   const {
//     register: registerSignUp,
//     handleSubmit: handleSignUpSubmit,
//     formState: { errors: signUpErrors },
//     control,
//     reset: resetSignUp,
//     setValue,
//     watch,
//   } = useForm<SignUpFormData>({
//     resolver: zodResolver(signUpSchema),
//     defaultValues: {
//       phone: "",
//     },
//   });
//   useEffect(() => {
//     if (selectedCountry && phone === "") {
//       const initialValue = selectedCountry.dial;
//       setPhone(initialValue);
//       setValue("phone", initialValue);
//     }
//   }, [selectedCountry, phone, setValue]);

//   // Watch password field for real-time validation
//   const password = watch("password");

//   // Password strength checker
//   const getPasswordStrength = (pass: string) => {
//     if (!pass) return { checks: [], show: false };

//     const checks = [
//       {
//         label: "At least 8 characters",
//         valid: pass.length >= 8,
//       },
//       {
//         label: "One uppercase letter (A-Z)",
//         valid: /[A-Z]/.test(pass),
//       },
//       {
//         label: "One lowercase letter (a-z)",
//         valid: /[a-z]/.test(pass),
//       },
//       {
//         label: "One number (0-9)",
//         valid: /[0-9]/.test(pass),
//       },
//       {
//         label: "One special character (!@#$%^&*)",
//         valid: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
//       },
//     ];

//     return { checks, show: true };
//   };

//   const passwordStrength = getPasswordStrength(password || "");

//   // ✅ Sign In - ONLY backend messages
//   const onSignInSubmit = async (data: SignInFormData) => {
//     setIsSubmitting(true);
//     try {
//       const result = await login({
//         email: data.email,
//         password: data.password,
//       });
//       if (result.success) {
//         if (result.message) {
//           toast({
//             description: result.message,
//             variant: "default",
//           });
//         }
//         navigate(returnUrl, { replace: true });
//       } else {
//         if (result.error) {
//           toast({
//             description: result.error,
//             variant: "destructive",
//           });
//         }
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ✅ Sign Up - Same error handling as ForgotPassword
//   const onSignUpSubmit = async (data: SignUpFormData) => {
//     setIsSubmitting(true);
//     try {
//       const phone_number = "+" + data.phone.replace(/\D/g, "");
//       const signUpData = {
//         email: data.email,
//         password: data.password,
//         first_name: data.firstname,
//         last_name: data.lastname,
//         phone_number,
//         isGuest: false,
//       };
//       const result = await signUp(signUpData);
//       if (result.success) {
//         if (result.message) {
//           toast({
//             description: result.message,
//             variant: "default",
//           });
//         }
//         if (result.requiresLogin) {
//           setActiveTab("signin");
//           resetSignUp();
//           setPhone("");
//         } else {
//           navigate(returnUrl, { replace: true });
//         }
//       } else {
//         if (result.error) {
//           const errorMsg =
//             typeof result.error === "string"
//               ? result.error
//               : Object.values(result.error);
//           const finalError = Array.isArray(errorMsg) ? errorMsg : errorMsg;
//           toast({
//             description: finalError as string,
//             variant: "destructive",
//           });
//         }
//       }
//     } catch (error) {
//       console.error("Signup error:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
//       <Card className="w-full max-w-md">
//         <div className="flex items-center justify-center py-6">
//           <img src={logo} alt="Logo" className="w-auto h-20" />
//         </div>
//         <CardContent>
//           <Tabs
//             value={activeTab}
//             onValueChange={setActiveTab}
//             className="w-full"
//           >
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="signin">Sign In</TabsTrigger>
//               <TabsTrigger value="signup">Sign Up</TabsTrigger>
//             </TabsList>

//             {/* Sign In FORM */}
//             <TabsContent value="signin">
//               <form
//                 onSubmit={handleSignInSubmit(onSignInSubmit)}
//                 className="space-y-4"
//               >
//                 <div className="space-y-2">
//                   <Label>Email</Label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       type="email"
//                       placeholder="Enter your email"
//                       className="pl-10"
//                       {...registerSignIn("email")}
//                     />
//                   </div>
//                   {signInErrors.email && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {signInErrors.email.message}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Password</Label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Enter your password"
//                       className="pl-10 pr-10"
//                       {...registerSignIn("password")}
//                     />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? (
//                         <Eye className="h-4 w-4 text-muted-foreground" />
//                       ) : (
//                         <EyeOff className="h-4 w-4 text-muted-foreground" />
//                       )}
//                     </Button>
//                   </div>
//                   {signInErrors.password && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {signInErrors.password.message}
//                     </p>
//                   )}
//                 </div>

//                 <div className="flex justify-end">
//                   <Link
//                     to="/auth/forgot-password"
//                     className="text-sm font-medium hover:underline"
//                   >
//                     Forgot Password?
//                   </Link>
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Signing in...
//                     </>
//                   ) : (
//                     "Sign In"
//                   )}
//                 </Button>
//               </form>
//             </TabsContent>

//             {/* SignUp FORM */}
//             <TabsContent value="signup">
//               <form
//                 onSubmit={handleSignUpSubmit(onSignUpSubmit)}
//                 className="space-y-4"
//               >
//                 <div className="space-y-2">
//                   <Label>First Name</Label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       type="text"
//                       placeholder="First Name"
//                       className="pl-10"
//                       maxLength={30}
//                       {...registerSignUp("firstname")}
//                     />
//                   </div>
//                   {signUpErrors.firstname && (
//                     <p className="text-red-500 text-xs">
//                       First name must be at least 2 characters long or less than
//                       30 characters
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Last Name</Label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       type="text"
//                       placeholder="Last Name"
//                       className="pl-10"
//                       maxLength={30}
//                       {...registerSignUp("lastname")}
//                     />
//                   </div>
//                   {signUpErrors.lastname && (
//                     <p className="text-red-500 text-xs">
//                       Last name must be at least 2 characters long or less than
//                       30 characters
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Email</Label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       type="email"
//                       placeholder="Enter your email"
//                       className="pl-10"
//                       {...registerSignUp("email")}
//                     />
//                   </div>
//                   {signUpErrors.email && (
//                     <p className="text-red-500 text-sm">
//                       {String(signUpErrors.email.message)}
//                     </p>
//                   )}
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Phone Number</Label>
//                   <div className="relative">
//                     <Controller
//                       name="phone"
//                       control={control}
//                       render={({ field }) => (
//                         <PhoneInput
//                           value={phone}
//                           onChange={(e) => {
//                             let value = e.target.value;
//                             if (value.startsWith("+92")) {
//                               value = value.replace(/^\+92\s*/, "+92 ");
//                               value = value.replace(
//                                 /(\+92\s)(.*)/,
//                                 (match, prefix, rest) => {
//                                   return prefix + rest.replace(/\s/g, "");
//                                 }
//                               );
//                             }
//                             setPhone(value);
//                             field.onChange(value);
//                           }}
//                           defaultCountry="PK"
//                           onCountryChange={(country) =>
//                             setSelectedCountry(country)
//                           }
//                         />
//                       )}
//                     />
//                   </div>
//                   {signUpErrors.phone && (
//                     <p className="text-red-500 text-sm">
//                       {String(signUpErrors.phone.message)}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Password</Label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
//                     <Input
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Enter strong password"
//                       className="pl-10 pr-12"
//                       maxLength={15}
//                       {...registerSignUp("password")}
//                     />
//                     <button
//                       type="button"
//                       className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-transparent z-10"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? (
//                         <Eye className="h-4 w-4 text-muted-foreground" />
//                       ) : (
//                         <EyeOff className="h-4 w-4 text-muted-foreground" />
//                       )}
//                     </button>
//                   </div>

//                   {password &&
//                     password.length > 0 &&
//                     (password.length < 8 ||
//                       password.length > 15 ||
//                       !/[A-Z]/.test(password) ||
//                       !/[a-z]/.test(password) ||
//                       !/[0-9]/.test(password) ||
//                       !/[!@#$%^&*(),.?":{}|<>]/.test(password)) && (
//                       <p className="text-red-500 text-xs mt-1">
//                         Password must be 8-15 characters with uppercase,
//                         lowercase, number, and special character
//                       </p>
//                     )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Confirm Password</Label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
//                     <Input
//                       type={showConfirmPassword ? "text" : "password"}
//                       placeholder="Confirm Password"
//                       className="pl-10 pr-12"
//                       maxLength={15}
//                       {...registerSignUp("confirmpassword")}
//                     />
//                     <button
//                       type="button"
//                       className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-transparent z-10"
//                       onClick={() =>
//                         setShowConfirmPassword(!showConfirmPassword)
//                       }
//                     >
//                       {showConfirmPassword ? (
//                         <Eye className="h-4 w-4 text-muted-foreground" />
//                       ) : (
//                         <EyeOff className="h-4 w-4 text-muted-foreground" />
//                       )}
//                     </button>
//                   </div>
//                   {signUpErrors.confirmpassword && (
//                     <p className="text-red-500 text-sm">
//                       {String(signUpErrors.confirmpassword.message)}
//                     </p>
//                   )}
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Creating account...
//                     </>
//                   ) : (
//                     "Create Account"
//                   )}
//                 </Button>
//               </form>
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//         <CardFooter className="flex flex-col space-y-2">
//           <Button
//             variant="ghost"
//             onClick={() => navigate("/", { replace: true })}
//             className="w-full"
//           >
//             Back to Home
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }

// export default Auth;
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, PhoneInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import logo from "@/assets/logo/logo-2.png";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const signUpSchema = z
  .object({
    firstname: z
      .string()
      .min(2, "First name must be at least 2 characters long")
      .max(30, "First name must not exceed 30 characters"),
    lastname: z
      .string()
      .min(2, "Last name must be at least 2 characters long")
      .max(30, "Last name must not exceed 30 characters"),
    email: z
      .string()
      .email("Please enter a valid email address")
      .refine(
        (email) => email.toLowerCase().endsWith("@gmail.com"),
        "Only gmail addresses are allowed"
      ),
    phone: z
      .string()
      .min(8, "Phone number is required")
      .regex(/^\+92\s\d{10}$/, "Invalid phone number format"),
    password: z
      .string()
      .min(
        8,
        "Password must be 8-15 characters with A-Z, a-z, 0-9, and special character"
      )
      .max(
        15,
        "Password must be 8-15 characters with A-Z, a-z, 0-9, and special character"
      )
      .regex(
        /[A-Z]/,
        "Password must be 8-15 characters with A-Z, a-z, 0-9, and special character"
      )
      .regex(
        /[a-z]/,
        "Password must be 8-15 characters with A-Z, a-z, 0-9, and special character"
      )
      .regex(
        /[0-9]/,
        "Password must be 8-15 characters with A-Z, a-z, 0-9, and special character"
      )
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must be 8-15 characters with A-Z, a-z, 0-9, and special character"
      ),
    confirmpassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords do not match",
    path: ["confirmpassword"],
  });

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, signUp } = useAuth();
  const location = useLocation();
  const returnUrl = location.state?.returnUrl || "/";

  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const {
    register: registerSignIn,
    handleSubmit: handleSignInSubmit,
    formState: { errors: signInErrors },
    reset: resetSignIn,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const {
    register: registerSignUp,
    handleSubmit: handleSignUpSubmit,
    formState: { errors: signUpErrors },
    control,
    reset: resetSignUp,
    setValue,
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      phone: "",
    },
  });
  useEffect(() => {
    if (selectedCountry && phone === "") {
      const initialValue = selectedCountry.dial;
      setPhone(initialValue);
      setValue("phone", initialValue);
    }
  }, [selectedCountry, phone, setValue]);

  // Watch password field for real-time validation
  const password = watch("password");

  // Password strength checker
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { checks: [], show: false };

    const checks = [
      {
        label: "At least 8 characters",
        valid: pass.length >= 8,
      },
      {
        label: "One uppercase letter (A-Z)",
        valid: /[A-Z]/.test(pass),
      },
      {
        label: "One lowercase letter (a-z)",
        valid: /[a-z]/.test(pass),
      },
      {
        label: "One number (0-9)",
        valid: /[0-9]/.test(pass),
      },
      {
        label: "One special character (!@#$%^&*)",
        valid: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
      },
    ];

    return { checks, show: true };
  };

  const passwordStrength = getPasswordStrength(password || "");

  // ✅ Sign In - ONLY backend messages
  const onSignInSubmit = async (data: SignInFormData) => {
    setIsSubmitting(true);
    try {
      const result = await login({
        email: data.email,
        password: data.password,
      });
      if (result.success) {
        if (result.message) {
          toast({
            description: result.message,
            variant: "default",
          });
        }
        navigate(returnUrl, { replace: true });
      } else {
        if (result.error) {
          toast({
            description: result.error,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Sign Up - Same error handling as ForgotPassword
  const onSignUpSubmit = async (data: SignUpFormData) => {
    setIsSubmitting(true);
    try {
      const phone_number = "+" + data.phone.replace(/\D/g, "");
      const signUpData = {
        email: data.email,
        password: data.password,
        first_name: data.firstname,
        last_name: data.lastname,
        phone_number,
        isGuest: false,
      };
      const result = await signUp(signUpData);
      if (result.success) {
        if (result.message) {
          toast({
            description: result.message,
            variant: "default",
          });
        }
        if (result.requiresLogin) {
          setActiveTab("signin");
          resetSignUp();
          setPhone("");
        } else {
          navigate(returnUrl, { replace: true });
        }
      } else {
        if (result.error) {
          const errorMsg =
            typeof result.error === "string"
              ? result.error
              : Object.values(result.error);
          const finalError = Array.isArray(errorMsg) ? errorMsg : errorMsg;
          toast({
            description: finalError as string,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-center py-6">
          <img src={logo} alt="Logo" className="w-auto h-20" />
        </div>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Sign In FORM */}
            <TabsContent value="signin">
              <form
                onSubmit={handleSignInSubmit(onSignInSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      {...registerSignIn("email")}
                    />
                  </div>
                  {signInErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {signInErrors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      {...registerSignIn("password")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {signInErrors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {signInErrors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Link
                    to="/auth/forgot-password"
                    className="text-sm font-medium hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* SignUp FORM */}
            <TabsContent value="signup">
              <form
                onSubmit={handleSignUpSubmit(onSignUpSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="First Name"
                      className="pl-10"
                      maxLength={30}
                      {...registerSignUp("firstname")}
                    />
                  </div>
                  {signUpErrors.firstname && (
                    <p className="text-red-500 text-xs">
                      First name must be at least 2 characters long or less than
                      30 characters
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Last Name"
                      className="pl-10"
                      maxLength={30}
                      {...registerSignUp("lastname")}
                    />
                  </div>
                  {signUpErrors.lastname && (
                    <p className="text-red-500 text-xs">
                      Last name must be at least 2 characters long or less than
                      30 characters
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      {...registerSignUp("email")}
                    />
                  </div>
                  {signUpErrors.email && (
                    <p className="text-red-500 text-sm">
                      {String(signUpErrors.email.message)}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <div className="relative">
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <PhoneInput
                          value={phone}
                          onChange={(e) => {
                            let value = e.target.value;
                            if (value.startsWith("+92")) {
                              value = value.replace(/^\+92\s*/, "+92 ");
                              value = value.replace(
                                /(\+92\s)(.*)/,
                                (match, prefix, rest) => {
                                  return prefix + rest.replace(/\s/g, "");
                                }
                              );
                            }
                            setPhone(value);
                            field.onChange(value);
                          }}
                          defaultCountry="PK"
                          onCountryChange={(country) =>
                            setSelectedCountry(country)
                          }
                        />
                      )}
                    />
                  </div>
                  {signUpErrors.phone && (
                    <p className="text-red-500 text-sm">
                      {String(signUpErrors.phone.message)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter strong password"
                      className="pl-10 pr-12"
                      maxLength={15}
                      {...registerSignUp("password")}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-transparent z-10"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  {password &&
                    password.length > 0 &&
                    (password.length < 8 ||
                      password.length > 15 ||
                      !/[A-Z]/.test(password) ||
                      !/[a-z]/.test(password) ||
                      !/[0-9]/.test(password) ||
                      !/[!@#$%^&*(),.?":{}|<>]/.test(password)) && (
                      <p className="text-red-500 text-xs mt-1">
                        Password must be 8-15 characters with uppercase,
                        lowercase, number, and special character
                      </p>
                    )}
                </div>

                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className="pl-10 pr-12"
                      maxLength={15}
                      {...registerSignUp("confirmpassword")}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-transparent z-10"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  {signUpErrors.confirmpassword && (
                    <p className="text-red-500 text-sm">
                      {String(signUpErrors.confirmpassword.message)}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            variant="ghost"
            onClick={() => navigate("/", { replace: true })}
            className="w-full"
          >
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Auth;
