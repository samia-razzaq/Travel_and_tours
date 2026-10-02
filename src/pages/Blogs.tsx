import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Loader2 } from "lucide-react";
import { useBlogs, useBlogCategories } from "@/hooks/useBlogs";

export default function Blogs() {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    undefined
  );
  const navigate = useNavigate();

  const {
    data: blogs,
    isLoading: blogsLoading,
    error: blogsError,
  } = useBlogs();

  const { data: categories, isLoading: categoriesLoading } =
    useBlogCategories();

  //Frontend filtering
  const filteredBlogs = selectedCategory
    ? blogs?.filter((blog) => blog.category === selectedCategory)
    : blogs;

  const handleBlogClick = (slug: string) => {
    navigate(`/blogs/${slug}`);
  };

  const handleCategoryClick = (categoryId?: number) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in text-white">
            Travel <span className="text-white">Blog</span>
          </h1>
          <p className="text-lg text-border max-w-2xl mx-auto animate-fade-in">
            Tips, guides, and stories to inspire your next Dubai adventure
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          {categoriesLoading ? (
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedCategory === undefined ? "default" : "outline"}
                onClick={() => handleCategoryClick(undefined)}
                className={
                  selectedCategory === undefined
                    ? "rounded-full px-5 py-2 text-sm font-medium h-auto"
                    : "rounded-full px-5 py-2 text-sm font-medium h-auto hover:border-[#FF6B35] hover:text-[#FF6B35] hover:bg-transparent transition-all duration-300"
                }
              >
                All
              </Button>
              {categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  onClick={() => handleCategoryClick(category.id)}
                  className={
                    selectedCategory === category.id
                      ? "rounded-full px-4 py-2 text-sm font-medium h-auto"
                      : "rounded-full px-4 py-2 text-sm font-medium h-auto hover:border-[#FF6B35] hover:text-[#FF6B35] hover:bg-transparent transition-all duration-300"
                  }
                >
                  {category.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          {blogsLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : blogsError ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">
                Failed to load blogs. Please try again later.
              </p>
            </div>
          ) : filteredBlogs && filteredBlogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
              {filteredBlogs.map((post, index) => (
                <article
                  key={post.id}
                  className="group relative bg-white rounded-2xl overflow-hidden hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-all duration-700 cursor-pointer border border-gray-100"
                  onClick={() => handleBlogClick(post.slug)}
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  }}
                >
                  {/* Image Section */}
                  <div className="relative h-56 overflow-hidden">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-90"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                        <span className="text-6xl opacity-40">📸</span>
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span
                        className="inline-block px-4 py-2 bg-white/95 backdrop-blur-sm rounded-xl text-xs font-bold shadow-lg border"
                        style={{
                          color: "hsl(28, 100%, 52%)",
                          borderColor: "hsl(28, 100%, 52%)",
                        }}
                      >
                        {post.category_name}
                      </span>
                    </div>

                    {/* Sunset Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(24,95%,55%)] via-[hsl(28,100%,52%)]/30 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                  </div>

                  {/* Content Section */}
                  <div className="p-7">
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(
                            post.published_at || post.created_at
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-black mb-4 line-clamp-2 leading-snug group-hover:text-[hsl(24,95%,55%)] transition-colors duration-300">
                      {post.title}
                    </h2>

                    {/* Divider */}
                    <div className="w-full h-px bg-gray-200 mb-5" />

                    {/* Read More Link */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="group/btn p-0 h-auto font-semibold hover:bg-transparent hover:gap-3 transition-all duration-300"
                      style={{ color: "hsl(28, 100%, 52%)" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBlogClick(post.slug);
                      }}
                    >
                      Read Full Story
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-2" />
                    </Button>
                  </div>

                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#FF6B35]/5 to-transparent rounded-bl-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">
                No blogs found in this category.
              </p>
            </div>
          )}

          {/* Coming Soon Notice */}
          <div className="mt-16 text-center">
            <div className="glass inline-block p-8 rounded-2xl">
              <h3 className="text-xl font-semibold mb-2">
                More Stories Coming Soon!
              </h3>
              <p className="text-muted-foreground mb-4">
                We're constantly adding new travel guides and tips. Stay tuned!
              </p>
              <Link to="/packages">
                <Button>Explore Our Tours</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
