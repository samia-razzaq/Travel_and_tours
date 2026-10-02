import { useQuery } from "@tanstack/react-query";
import { tourismApi } from "@/services/api/endpoints";

export const usePricing = () => {
  return useQuery({
    queryKey: ["pricing"],
    queryFn: tourismApi.getPricing,
  });
};
