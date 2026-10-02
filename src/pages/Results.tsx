import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PackageCard } from "@/components/PackageCard";
import { calculateRecommendations, getBadge } from "@/utils/quizLogic";
import { Package } from "@/types/quiz";
import { Sparkles, RotateCcw, Home } from "lucide-react";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, score } = location.state || {};
  const [recommendations, setRecommendations] = useState<Package[]>([]);
  const badge = getBadge(score || 0);

  useEffect(() => {
    if (!answers) {
      navigate("/quiz");
      return;
    }

    const recommended = calculateRecommendations(answers);
    setRecommendations(recommended);
  }, [answers, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Badge Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-block mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full gradient-hero flex items-center justify-center text-6xl shadow-glow animate-scale-in">
                {badge.icon}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-accent text-accent-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold shadow-lg">
                {score}
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            You're a <span className="text-primary">{badge.title}</span>!
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Based on your preferences, we've curated the perfect experiences for your UAE adventure
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/">
              <Button variant="outline" size="lg">
                <Home className="w-4 h-4 mr-2" />
                Back Home
              </Button>
            </Link>
            <Link to="/quiz">
              <Button variant="desert" size="lg">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Quiz
              </Button>
            </Link>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Sparkles className="w-6 h-6 text-accent" />
            <h2 className="text-3xl font-bold">Your Perfect Matches</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendations.map((pkg, index) => (
              <div
                key={pkg.id}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PackageCard package={pkg} rank={index + 1} />
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center gradient-hero rounded-2xl p-12 text-white shadow-warm">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Book Your Adventure?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Contact us now to customize your perfect UAE experience
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
              Contact Us
            </Button>
            <Link to="/packages">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/20">
                View All Packages
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
