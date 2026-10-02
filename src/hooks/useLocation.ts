import { useQuery } from "@tanstack/react-query";
import { tourismApi } from "@/services/api/endpoints";

export const useLocations = (cityName?: string) => {
  return useQuery({
    queryKey: ["locations", cityName],
    queryFn: () => tourismApi.getLocations(cityName),
    enabled: !!cityName, // Only fetch if cityName is provided
  });
};
