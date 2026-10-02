import { Shield, Star, Users, Clock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Licensed operators with comprehensive insurance coverage",
  },
  {
    icon: Star,
    title: "Premium Quality",
    description: "Hand-picked experiences with 5-star rated guides",
  },
  {
    icon: Users,
    title: "Expert Guides",
    description: "Local experts with deep knowledge of UAE culture",
  },
  {
    icon: Clock,
    title: "Flexible Timing",
    description: "Multiple time slots to fit your schedule perfectly",
  },
];

export const Features = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-transparent" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="gradient-text">NeuroOcean Tours</span>
          </h2>
          <p className="text-xl text-muted-foreground">Excellence in every adventure</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="glass-dark backdrop-blur-xl rounded-3xl p-8 hover-lift hover-glow border border-white/10 text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-hero mb-6 shadow-glow">
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
