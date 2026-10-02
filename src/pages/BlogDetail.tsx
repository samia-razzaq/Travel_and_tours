import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, Loader2 } from "lucide-react";
import { useBlogBySlug } from "@/hooks/useBlogs";

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: blog, isLoading, error } = useBlogBySlug(slug || "");

  // Format content function
  const formatContent = (content: string) => {
    if (!content) return "";

    // Split content by lines
    const lines = content.split("\n");
    let formattedHTML = "";
    let inParagraph = false;

    lines.forEach((line) => {
      let trimmedLine = line.trim();

      // 1. Handle escaped characters like \' (it\'s -> it's)
      trimmedLine = trimmedLine.replace(/\\'/g, "'");

      // 2. Logic for *asterisk* (Italics)
      trimmedLine = trimmedLine.replace(/\*(.*?)\*/g, "<em>$1</em>");

      // 3. Logic for Numbered Points (1. 2. 3.)
      // Margin kam kiya gaya hai taake gap zyada na ho
      if (/^\d+\./.test(trimmedLine)) {
        if (inParagraph) {
          formattedHTML += "</p>";
          inParagraph = false;
        }
        formattedHTML += `<p style="margin-bottom: 0.25rem; margin-top: 0.25rem; line-height: 1.6; padding-left: 0.2rem; font-weight: 500;">${trimmedLine}</p>`;
        return;
      }

      // Check for ### heading
      if (trimmedLine.startsWith("### ")) {
        if (inParagraph) {
          formattedHTML += "</p>";
          inParagraph = false;
        }
        const headingText = trimmedLine.replace("### ", "");
        formattedHTML += `<h3 style="color: #f5a623; font-weight: bold; font-size: 1.2rem; margin-top: 1rem; margin-bottom: 0.4rem;">${headingText}</h3>`;
      }
      // Check for ## heading
      else if (trimmedLine.startsWith("## ")) {
        if (inParagraph) {
          formattedHTML += "</p>";
          inParagraph = false;
        }
        const headingText = trimmedLine.replace("## ", "");
        formattedHTML += `<h2 style="color: #f5a623; font-weight: bold; font-size: 1.4rem; margin-top: 1.2rem; margin-bottom: 0.5rem;">${headingText}</h2>`;
      }
      // Check for # heading
      else if (trimmedLine.startsWith("# ")) {
        if (inParagraph) {
          formattedHTML += "</p>";
          inParagraph = false;
        }
        const headingText = trimmedLine.replace("# ", "");
        formattedHTML += `<h1 style="color: #f5a623; font-weight: bold; font-size: 1.7rem; margin-top: 1.5rem; margin-bottom: 0.6rem;">${headingText}</h1>`;
      }
      // Empty line - handling spacing
      else if (trimmedLine === "") {
        if (inParagraph) {
          formattedHTML += "</p>";
          inParagraph = false;
        }
      }
      // Regular text
      else {
        let cleanedLine = trimmedLine;
        if (cleanedLine.startsWith("- ")) {
          cleanedLine = cleanedLine.substring(2);
        }

        if (!inParagraph) {
          // margin-bottom ko 1rem se kam kar k 0.5rem kar diya hai
          formattedHTML +=
            '<p style="margin-bottom: 0.5rem; line-height: 1.6; text-align: justify;">';
          inParagraph = true;
        } else {
          formattedHTML += " ";
        }
        formattedHTML += cleanedLine;
      }
    });

    // Close last paragraph if open
    if (inParagraph) {
      formattedHTML += "</p>";
    }

    return formattedHTML;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex justify-center items-center py-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-40 text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Not Found</h1>
          <Link to="/blogs">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/blogs">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">{blog.title}</h1>

          <div className="flex items-center gap-4 text-muted-foreground mb-6">
            <span className="flex items-center gap-2">
              <Calendar
                className="w-4 h-4"
                style={{ color: "hsl(28, 100%, 52%)" }}
              />
              {new Date(
                blog.published_at || blog.created_at
              ).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          {blog.image && (
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-6">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />

              {/* Category Badge on Image - Left Side */}
              <div className="absolute top-4 left-4">
                <span
                  className="inline-block px-4 py-2 text-sm font-bold text-white rounded-xl shadow-lg backdrop-blur-sm border border-transparent"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(24, 95%, 55%), hsl(28, 100%, 52%), hsl(22, 96%, 50%))",
                  }}
                >
                  {blog.category_name}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: formatContent(blog.content) }}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
