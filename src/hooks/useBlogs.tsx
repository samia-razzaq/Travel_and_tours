import { useQuery } from "@tanstack/react-query";
import { blogApi } from "@/services/api/endpoints";

// Get all blogs
export const useBlogs = (categoryId?: number) => {
  return useQuery({
    queryKey: ["blogs", categoryId],
    queryFn: () => blogApi.getBlogs(categoryId),
  });
};

// Get single blog by slug
export const useBlogBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["blog", slug],
    queryFn: () => blogApi.getBlogBySlug(slug),
    enabled: !!slug,
  });
};

// Get all blog categories
export const useBlogCategories = () => {
  return useQuery({
    queryKey: ["blogCategories"],
    queryFn: () => blogApi.getBlogCategories(),
  });
};
