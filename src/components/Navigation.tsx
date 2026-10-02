// Updated Navigation.tsx with integrated profile editing in same dialog
import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  ShoppingCart,
  Menu,
  X,
  Edit2,
  Save,
  X as CloseIcon,
  EyeOff,
  Eye,
  Shield,
} from "lucide-react";
import logo2 from "@/assets/logo/logo-2.png";
import { toast } from "sonner";
import {
  useIsAuthenticated,
  useCurrentUser,
  useLogout,
  useUpdateProfile,
  useFetchUserData,
  useIsAdmin,
} from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/hooks/useCart";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DialogHeader } from "./ui/dialog";
import { authApi } from "@/services/api/endpoints";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import queryClient from "@/services/queryClient";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { PhoneInput } from "./ui/input";

// ───────────────────────────────────────────────────────────
// TYPES & INTERFACES
// ───────────────────────────────────────────────────────────
type NavItem = {
  path: string;
  label: string;
};

// Validation Schema
const editProfileSchema = z
  .object({
    first_name: z
      .string()
      .min(2, "First name must be at least 2 characters long")
      .max(30, "First name must not exceed 30 characters"),
    last_name: z
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
    address: z
      .string()
      .max(50, "Address must not exceed 50 characters")
      .optional(),
    phone_number: z
      .string()
      .optional()
      .refine((val) => val === undefined || val === "" || val.length >= 8, {
        message: "Phone number must be at least 8 characters if provided",
      })
      .refine(
        (val) => val === undefined || val === "" || /^[\d+\s()-]+$/.test(val),
        {
          message: "Invalid phone number format",
        }
      ),
    password: z.string().optional(),
    confirm_password: z.string().optional(),
  })
  // Password confirmation match
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        return data.confirm_password === data.password;
      }
      return true;
    },
    {
      message: "Passwords must match",
      path: ["confirm_password"],
    }
  )
  // Strong password rules (only applied if password is provided)
  .refine(
    (data) => {
      if (!data.password || data.password.length === 0) return true;

      const hasMinLength = data.password.length >= 8;
      const hasMaxLength = data.password.length <= 15;
      const hasUppercase = /[A-Z]/.test(data.password);
      const hasLowercase = /[a-z]/.test(data.password);
      const hasNumber = /\d/.test(data.password);
      const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
        data.password
      );

      return (
        hasMinLength &&
        hasMaxLength &&
        hasUppercase &&
        hasLowercase &&
        hasNumber &&
        hasSpecial
      );
    },
    {
      message:
        "Password must be at least 8 characters and max 15 characters and contain at least one number, special character, upper case and lowercase letter",
      path: ["password"],
    }
  );
type EditProfileFormData = z.infer<typeof editProfileSchema>;

// ───────────────────────────────────────────────────────────
// CONSTANTS
// ───────────────────────────────────────────────────────────
// const NAV_ITEMS: NavItem[] = [
//   { path: "/", label: "Home" },
//   { path: "/packages", label: "Packages" },
//   { path: "/about", label: "About" },
//   { path: "/blogs", label: "Blog" },
//   { path: "/contact", label: "Contact" },
// ];
const getNavItems = (isAdmin: boolean): NavItem[] => {
  const baseItems: NavItem[] = [
    { path: "/", label: "Home" },
    { path: "/packages", label: "Packages" },
    { path: "/about", label: "About" },
    { path: "/blogs", label: "Blog" },
    { path: "/contact", label: "Contact" },
    // { path: "/bookings", label: "My Bookings" },
  ];

  // Add admin-only items
  if (isAdmin) {
    baseItems.push({ path: "/adminBookings", label: "Bookings" });
    // Add more admin routes as needed.
  } else {
    baseItems.push({ path: "/userBookings", label: "My Bookings" });
  }

  return baseItems;
};

// ───────────────────────────────────────────────────────────
// HELPER: Get user initials
// ───────────────────────────────────────────────────────────
const getInitials = (firstName?: string, lastName?: string) => {
  const first = firstName?.charAt(0)?.toUpperCase() || "";
  const last = lastName?.charAt(0)?.toUpperCase() || "";
  return first + last || "U";
};

// ───────────────────────────────────────────────────────────
// MAIN COMPONENT
// ───────────────────────────────────────────────────────────
export default function Navigation() {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const user = useCurrentUser();
  const updateProfile = useUpdateProfile(); // Fixed variable name
  const logout = useLogout();
  const [showNav, setShowNav] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  // const [phone, setPhone] = useState("");
  // const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: cartData } = useCart();
  const isAdmin = useIsAdmin();
  const cartCount = cartData?.items?.length || 0;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      address: user?.address || "",
      phone_number: user?.phone_number || "",
      // phone: "",
      password: "",
      confirm_password: "",
    },
    mode: "onChange",
  });

  // Reset form when user data changes or modal opens
  useEffect(() => {
    if (user && isProfileOpen) {
      const userPhone = user.phone_number || "";
      // setPhone(userPhone);
      reset({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        address: user.address || "",
        phone_number: userPhone,
        password: "",
        confirm_password: "",
      });
    }
  }, [user, isProfileOpen, reset]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error: any) {
      toast.error("Failed to log out");
    }
  };

  const handleEditProfile = async (data: EditProfileFormData) => {
    setIsSubmitting(true);

    try {
      // Build payload with only changed fields
      const payload: Partial<{
        first_name?: string;
        last_name?: string;
        email?: string;
        address?: string;
        phone_number?: string;
        password?: string;
      }> & { password?: string } = {};

      if (data.first_name !== user?.first_name)
        payload.first_name = data.first_name;
      if (data.last_name !== user?.last_name)
        payload.last_name = data.last_name;
      if (data.email !== user?.email) payload.email = data.email;
      if (data.address !== user?.address)
        payload.address = data.address || null;
      if (data.phone_number !== user?.phone_number)
        payload.phone_number = data.phone_number || null;

      const isPasswordChange = data.password && data.password.length > 0;
      if (isPasswordChange) {
        payload.password = data.password;
      }

      // If nothing changed, just close
      if (Object.keys(payload).length === 0) {
        toast.info("No changes detected");
        setIsEditMode(false);
        return;
      }

      const result = await updateProfile(payload);
      if (result.success && result.user) {
        if (isPasswordChange) {
          toast.success(
            "Profile updated! Please log in with your new password."
          );
          await logout();
          setIsProfileOpen(false);
          setIsEditMode(false);
          navigate("/auth");
        } else {
          toast.success("Profile updated successfully!");
          setIsEditMode(false);
          setIsProfileOpen(false);
          // No need to reload or invalidate queries manually
          // → Context already updated state
        }
      } else {
        // Handle error from context
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error: any) {
      // Fallback for unexpected errors
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseProfile = () => {
    setIsProfileOpen(false);
    setIsEditMode(false);
    reset();
  };

  // ─── Close menu on outside click ───────────────────────────
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowNav(false);
      }
    };
    if (showNav) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNav]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/10">
      {/* ─── Desktop Header ────────────────────────────────── */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/">
          <img
            src={logo2}
            alt="Logo"
            className="w-auto min-w-32 h-12 object-contain"
          />
        </NavLink>
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {/* Navigation Links */}
          {/* {NAV_ITEMS.map((item) => ( */}
          {getNavItems(isAdmin).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative text-sm font-medium transition-colors
                ${
                  isActive
                    ? "text-orange-400 after:w-full"
                    : "text-white hover:text-orange-400"
                }
                after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5
                after:bg-orange-500 after:transition-all after:duration-300 after:w-0 hover:after:w-full`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {/* Icons */}
          <div className="flex items-center gap-3">
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `text-white hover:gradient-hero py-3 px-3.5 rounded-md
                ${
                  isActive
                    ? "gradient-hero text-white shadow-warm hover:shadow-glow hover:scale-105 transition-all duration-300 font-semibold"
                    : ""
                }`
              }
            >
              <div className="relative">
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-xs font-semibold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </NavLink>
            {/* User Icon or Avatar with Dropdown */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {isAdmin ? (
                    <div className="flex items-center gap-2 py-2 px-3 rounded-md bg-white/5 cursor-pointer">
                      <Shield className="w-5 h-5 text-emerald-400" />
                      <span className="hidden lg:block text-sm font-medium text-white">
                        Admin
                      </span>
                    </div>
                  ) : (
                    <button className="flex items-center gap-2 text-white hover:bg-white/5 py-2 px-3 rounded-md transition-all duration-300 focus:outline-none group">
                      <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center text-white text-xs font-semibold shadow-lg group-hover:shadow-glow group-hover:scale-105 transition-all duration-300">
                        {getInitials(user?.first_name, user?.last_name)}
                      </div>
                      <span className="hidden lg:block text-sm font-medium">
                        {user?.first_name}
                      </span>
                    </button>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 bg-accent-foreground border-white/10"
                  align="end"
                >
                  <DropdownMenuLabel className="text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center text-white text-sm font-semibold shadow-lg">
                        {getInitials(user?.first_name, user?.last_name)}
                      </div>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.first_name} {user?.last_name}
                        </p>
                        <p className="text-xs leading-none text-gray-400">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={() => setIsProfileOpen(true)}
                    className="text-white hover:bg-white/5 cursor-pointer focus:bg-white/5 focus:text-white"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>View Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-white hover:bg-white/5 cursor-pointer focus:bg-white/5 focus:text-white"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <NavLink
                to="/auth"
                className={({ isActive }) =>
                  `text-white hover:gradient-hero py-3 px-3.5 rounded-md
                  ${
                    isActive
                      ? "gradient-hero text-white shadow-warm hover:shadow-glow hover:scale-105 transition-all duration-300 font-semibold"
                      : ""
                  }`
                }
              >
                <User className="h-4 w-4" />
              </NavLink>
            )}
          </div>
        </div>
        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-orange-400 focus:outline-none"
          onClick={() => setShowNav(!showNav)}
          aria-label="Toggle menu"
        >
          <Menu size={28} />
        </button>
      </div>
      {/* ─── Mobile Menu Overlay ─────────────────────────────── */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${
          showNav
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="border-none absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowNav(false)}
        />
        {/* Menu Panel */}
        <div
          ref={menuRef}
          className={`absolute top-0 right-0 h-screen w-4/5 max-w-xs bg-accent-foreground shadow-2xl transform transition-transform duration-300 ease-in-out ${
            showNav ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="h-16 flex items-center justify-between p-5 border-b border-white/10">
            <h2 className="text-xl font-bold gradient-text">Menu</h2>
            <button
              onClick={() => setShowNav(false)}
              className="text-white hover:text-orange-400 focus:outline-none"
              aria-label="Close menu"
            >
              <X size={28} />
            </button>
          </div>
          {/* Links */}
          <div className="bg-accent-foreground flex flex-col p-6 space-y-5">
            {/* User Profile Section for Mobile (if logged in) */}
            {isAuthenticated && (
              <div className="pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center text-white text-base font-semibold shadow-lg">
                    {getInitials(user?.first_name, user?.last_name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                </div>

                {/* Mobile View Profile Button */}
                <button
                  onClick={() => {
                    setIsProfileOpen(true);
                    setShowNav(false);
                  }}
                  className="w-full mt-3 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-md text-sm text-white flex items-center justify-center gap-2 transition-colors"
                >
                  <User className="h-4 w-4" />
                  View Profile
                </button>
              </div>
            )}
            {/* {NAV_ITEMS.map((item) => ( */}
            {getNavItems(isAdmin).map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setShowNav(false)}
                className={({ isActive }) =>
                  `text-lg font-medium transition-colors ${
                    isActive
                      ? "text-orange-400"
                      : "text-white hover:text-orange-400"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {/* Bottom Actions */}
            <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
              <NavLink
                to="/cart"
                onClick={() => setShowNav(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 ${
                    isActive ? "text-orange-400" : "text-white"
                  } hover:text-orange-400 font-medium`
                }
              >
                <div className="relative flex gap-3">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 left-2 bg-orange-500 text-white text-xs font-semibold rounded-full h-4 w-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
              </NavLink>
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setShowNav(false);
                  }}
                  className="flex items-center gap-3 text-white hover:text-orange-400 w-full text-left"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              ) : (
                <NavLink
                  to="/auth"
                  onClick={() => setShowNav(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 text-white hover:text-orange-400 ${
                      isActive
                        ? "text-orange-400"
                        : "text-white hover:text-orange-400"
                    }`
                  }
                >
                  <User className="h-5 w-5" />
                  Account
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* ✅ Profile Modal (View & Edit in same dialog) */}
      {isAuthenticated && user && (
        <Dialog open={isProfileOpen} onOpenChange={handleCloseProfile}>
          <DialogContent className="bg-accent-foreground border-white/10 text-white max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">
                {isEditMode ? "Edit Profile" : "My Profile"}
              </DialogTitle>
            </DialogHeader>
            {/* VIEW MODE */}
            {!isEditMode && (
              <>
                <div className="flex flex-col items-center gap-6 pt-4">
                  {/* Large avatar */}
                  <div className="w-28 h-28 rounded-full gradient-hero flex items-center justify-center text-white text-4xl font-semibold shadow-xl">
                    {getInitials(user.first_name, user.last_name)}
                  </div>
                  {/* Name & email */}
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">{user.email}</p>
                  </div>
                </div>
                {/* All user details */}
                <div className="space-y-4 mt-6 text-base">
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-gray-400">First Name</span>
                    <span className="font-medium">
                      {user.first_name || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-gray-400">Last Name</span>
                    <span className="font-medium">{user.last_name || "-"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-gray-400">Email</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-gray-400">Phone Number</span>
                    <span className="font-medium">
                      {user.phone_number || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-gray-400">Address</span>
                    <span className="font-medium text-right max-w-[200px]">
                      {user.address || "Not provided"}
                    </span>
                  </div>
                  {user.is_admin && (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-400">Role</span>
                      <span className="font-medium text-orange-400">
                        Administrator
                      </span>
                    </div>
                  )}
                </div>
                <DialogFooter className="mt-6">
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="w-full px-4 py-2 gradient-hero text-white rounded-md hover:shadow-glow transition-all flex items-center justify-center gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Info
                  </button>
                </DialogFooter>
              </>
            )}
            {/* EDIT MODE */}
            {isEditMode && (
              <div className="space-y-4 pt-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    First Name
                  </label>
                  <input
                    {...register("first_name")}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                    placeholder="Enter first name"
                    maxLength={30}
                  />
                  {errors.first_name && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.first_name.message}
                    </p>
                  )}
                </div>
                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <input
                    {...register("last_name")}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                    placeholder="Enter last name"
                    maxLength={30}
                  />
                  {errors.last_name && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.last_name.message}
                    </p>
                  )}
                </div>
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                    placeholder="Enter email"
                    maxLength={30}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                {/* Address */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Address (Optional)
                  </label>
                  <input
                    {...register("address")}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                    placeholder="Enter address"
                    maxLength={50}
                  />
                </div>
                {/* Phone Number */}
                {/* <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    {...register("phone_number")}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                    placeholder="Enter phone number"
                  />
                  {errors.phone_number && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.phone_number.message}
                    </p>
                  )}
                </div> */}
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <div className="relative">
                    <Controller
                      name="phone_number"
                      control={control}
                      render={({ field }) => (
                        <PhoneInput
                          {...field}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                          variant="dark"
                          defaultCountry="PK"
                          // onCountryChange={(country) =>
                          //   setSelectedCountry(country)
                          // }
                          // maxLength={15}
                        />
                      )}
                    />
                  </div>
                  {errors.phone_number && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.phone_number.message}
                    </p>
                  )}
                </div>
                {/* Password Section */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-gray-400 mb-3">
                    Leave blank to keep current password
                  </p>
                  {/* New Password */}
                  <div className="space-y-2 mb-2">
                    <div className="mb-4 relative">
                      <label className="block text-sm font-medium mb-2">
                        New Password
                      </label>
                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        className="w-full px-4 py-2 pr-10 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                        placeholder="Enter new password"
                        maxLength={15}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-3.5 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-red-400 text-sm">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <div className="relative">
                      <label className="block text-sm font-medium mb-2">
                        Confirm Password
                      </label>
                      <input
                        {...register("confirm_password")}
                        type={showConfirmPassword ? "text" : "password"}
                        className="w-full px-4 py-2 pr-10 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                        placeholder="Confirm new password"
                        maxLength={15}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-3.5 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {errors.confirm_password && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.confirm_password.message}
                      </p>
                    )}
                  </div>
                </div>
                <DialogFooter className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditMode(false);
                      reset();
                    }}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <CloseIcon className="h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit(handleEditProfile)}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 gradient-hero text-white rounded-md hover:shadow-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </nav>
  );
}
