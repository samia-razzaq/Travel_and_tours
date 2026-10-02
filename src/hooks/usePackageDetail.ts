import { useQuery } from "@tanstack/react-query";
import { tourismApi } from "@/services/api/endpoints";

export const usePackageDetail = (packageId: number | null) => {
  return useQuery({
    queryKey: ["packageDetail", packageId],
    queryFn: () => tourismApi.getPackageDetail(packageId!),
    enabled: packageId !== null,
  });
};
