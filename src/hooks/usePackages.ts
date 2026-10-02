import { useQuery } from "@tanstack/react-query";
import { tourismApi } from "@/services/api/endpoints";

export const usePackages = (cityName?: string) => {
  return useQuery({
    queryKey: ["packages", cityName],
    queryFn: () => tourismApi.getPackages(cityName),
  });
};
