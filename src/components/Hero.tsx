import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, Map, ArrowDown } from "lucide-react";
import heroImage from "@/assets/hero-desert.jpg";

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-5">
      {/* Static Fallback Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${heroImage})` }}
      />

      {/* Video Background with better compatibility */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster={heroImage}
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source
          src="https://cdn.pixabay.com/video/2022/11/29/141249-777467897_large.mp4"
          type="video/mp4"
        />
      </video>

      {/* Clear Day Sky Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-sky-400/40 via-blue-300/30 to-orange-200/40" />

      {/* Content */}
      <div className="relative z-20 text-white px-4 max-w-7xl mx-auto py-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Text Content */}
          <div className="space-y-3 animate-slide-in-left">
            <div className="inline-block mt-8">
              <span className="glass px-6 py-3 rounded-full text-sm font-medium backdrop-blur-xl">
                ✨ Premium UAE Experiences
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Your Perfect
              <span className="block gradient-text">Desert</span>
              <span className="block">Adventure</span>
            </h1>

            <p className="text-lg md:text-lg text-white/90 max-w-xl leading-relaxed">
              Immersive desert safaris, thrilling dune adventures, and cultural
              experiences crafted perfectly for you
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/packages">
                <Button
                  size="xl"
                  variant="hero"
                  className="shadow-glow hover-lift text-lg px-8 py-7 group"
                >
                  {/* <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" /> */}
                  <Map className="mr-2 h-5 w-5" />
                  Browse Packages
                </Button>
              </Link>
              {/* <Link to="/packages">
                <Button
                  size="xl"
                  className="glass border-white/30 text-white hover:bg-white/20 backdrop-blur-xl text-lg px-8 py-7"
                >
                  <Map className="mr-2 h-5 w-5" />
                  Browse Packages
                </Button>
              </Link> */}
            </div>

            {/* Stats - Without Cards */}
            <div className="flex items-center justify-center gap-14 md:gap-24 mt-18">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">500+</div>
                <div className="text-sm text-white/70 mt-1">
                  Happy Travelers
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">50+</div>
                <div className="text-sm text-white/70 mt-1">Experiences</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">5★</div>
                <div className="text-sm text-white/70 mt-1">Rated Tours</div>
              </div>
            </div>
          </div>

          {/* Right Side - Interactive Cards */}
          <div className="h-full relative animate-slide-in-right mt-8 flex flex-col items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 perspective-1000 w-full">
              {[
                {
                  emoji: "🏜️",
                  title: "Desert Safari",
                  subtitle: "Dune Bashing",
                },
                {
                  emoji: "🏙️",
                  title: "City Tours",
                  subtitle: "Modern Wonders",
                },
                { emoji: "⛵", title: "Dhow Cruise", subtitle: "Sunset Views" },
                { emoji: "🎢", title: "Theme Parks", subtitle: "Family Fun" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="glass-dark rounded-xl lg:rounded-2xl p-4 lg:p-5 backdrop-blur-xl hover-lift hover-glow cursor-pointer preserve-3d transition-all active:scale-95"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div
                    className="text-3xl lg:text-3xl mb-2 lg:mb-3 animate-bounce-gentle"
                    style={{ animationDelay: `${idx * 0.2}s` }}
                  >
                    {item.emoji}
                  </div>
                  <h3 className="text-sm lg:text-base font-bold mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/60">{item.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        {/* <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce-gentle">
          <ArrowDown className="w-8 h-8 text-white/50" />
        </div> */}
      </div>
    </div>
  );
};
