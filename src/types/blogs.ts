export interface Blog {
  id: number;
  title: string;
  slug: string;
  meta_title: string;
  content: string;
  meta_description: string;
  image: string;
  tags: string | null;
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  category: number;
  category_name: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export type BlogsResponse = Blog[];
