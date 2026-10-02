import { useQuery } from "@tanstack/react-query";
import { tourismApi } from "@/services/api/endpoints";

export const useCities = () => {
  return useQuery({
    queryKey: ["cities"],
    queryFn: tourismApi.getCities,
  });
};
