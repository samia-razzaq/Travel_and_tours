import { useQuery } from "@tanstack/react-query";
import { tourismApi } from "@/services/api/endpoints"; // Adjust path to your API file
import { AuthContext } from "@/context/authContext";
import { useContext } from "react";

const useBookings = () => {
  const auth = useContext(AuthContext); // Import and use
  const { isLoading: authIsLoading, isAuthenticated, user } = auth || {};
  return useQuery({
    queryKey: ["bookings", user?.id],
    queryFn: tourismApi.getBookings,
    enabled: !authIsLoading && isAuthenticated, // Prevent premature fire
  });
};

export default useBookings;
