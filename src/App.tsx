import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/authContext"; // ✅ Import AuthProvider
import { ProtectedRoute } from "./components/protectedRoute"; // ✅ Import ProtectedRoute
import Index from "./pages/Index";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import Packages from "./pages/Packages";
import Booking from "./pages/Booking";
import { BookingSuccess } from "./pages/BookingSuccess";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Blogs from "./pages/Blogs";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ui/scrolltotop";
import BlogDetail from "./pages/BlogDetail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import { BookingError } from "./pages/BookingError";
import AdminBookings from "./pages/AdminBookings";
import UserBookings from "./pages/UserBookings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable refetch on tab focus globally
      staleTime: 5 * 60 * 1000, // Optional: Set a reasonable stale time (e.g., 5 mins) to control freshness
      //cacheTime: 10 * 60 * 1000, // Optional: How long to keep inactive data in cache
      refetchOnReconnect: false, // Optional: Also disable on network reconnect if not needed
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        {/* ✅ Wrap everything with AuthProvider */}
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/results" element={<Results />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/booking/:packageId" element={<Booking />} />
            <Route path="/booking/success" element={<BookingSuccess />} />
            <Route path="/booking/error" element={<BookingError />} />
            <Route path="/adminBookings" element={<AdminBookings/>} />
            <Route path="/userBookings" element={<UserBookings />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:slug" element={<BlogDetail />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />

            <Route path="/rp/:uid/:token" element={<ResetPassword />} />
            <Route path="/cart" element={<Cart />} />

            {/* ✅ Protected Routes - Require Authentication */}
            {/* <Route
              path="/booking/:packageId"
              element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking/success"
              element={
                <ProtectedRoute>
                  <BookingSuccess />
                </ProtectedRoute>
              }
            /> */}

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />

            {/* 404 Not Found - Must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
