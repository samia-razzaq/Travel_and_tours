import { useState } from "react";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp } from "lucide-react";
import dhowCruiseImage from "@/assets/home/dhow_cruise_2.webp";
import desertSafariImage from "@/assets/home/evening_safari_XEodU06.webp";
import cityTourImage from "@/assets/home/overnight_safari_yqHLkwH.webp";
import Footer from "@/components/Footer";
import rasAlKhamiahImage from "@/assets/home/ras_al_khaimah.webp";
import desertArabImage from "@/assets/home/desert-arab_1.webp";
import burjKhalifaImage from "@/assets/home/burj-khalifa.webp";
import dhowCruiseAttractionImage from "@/assets/home/dhow_cruise_2.webp";
import burjAlArabImage from "@/assets/home/burj-arab.webp";
import palmJumeirahImage from "@/assets/home/Palm-Jumeirah2.webp";

const Index = () => {
  const [packages] = useState([
    {
      id: 1,
      title: "Dhow Cruise Dinner Creek - Upper Deck",
      description:
        "Experience the thrill of dune bashing and camel rides in the UAE desert.",
      price: 120,
      image_url: dhowCruiseImage,
      bookingId: 3,
    },
    {
      id: 2,
      title: "Overnight Camping Escape",
      description:
        "Explore the modern wonders of Dubai, including the Palm Jumeirah and Dubai Mall.",
      price: 330,
      image_url: desertSafariImage,
      bookingId: 8,
    },
    {
      id: 3,
      title: "Desert Safari & Overnight Camp",
      description:
        "Discover the architectural beauty of the Sheikh Zayed Grand Mosque.",
      price: 375,
      image_url: cityTourImage,
      bookingId: 9,
    },
  ]);

  const attractions = [
    {
      name: "Ras Al Khaimah",
      image: rasAlKhamiahImage,
    },
    {
      name: "Desert Arab",
      image: desertArabImage,
    },
    {
      name: "Burj Khalifa",
      image: burjKhalifaImage,
    },
    {
      name: "Dhow Cruise",
      image: dhowCruiseAttractionImage,
    },
    {
      name: "Burj Al Arab",
      image: burjAlArabImage,
    },
    {
      name: "Palm Jumeirah",
      image: palmJumeirahImage,
    },
  ];

  const featuredPackage = packages[0];
  const sidePackages = [packages[1], packages[2]];

  return (
    <>
      <Navigation />
      <div className="min-h-screen pt-0">
        <Hero />
        <Features />

        {/* Popular Experiences - Bento Grid */}
        <section className="py-4 pb-16 px-4 bg-gradient-to-b from-background via-secondary/10 to-background relative overflow-hidden">
          {/* Decorative gradient blobs */}
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="inline-block glass px-6 py-3 rounded-full mb-6 backdrop-blur-xl">
                <span className="text-primary font-semibold">
                  🔥 Trending Now
                </span>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold mb-6">
                Popular <span className="gradient-text">Experiences</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Hand-picked adventures that our travelers love the most
              </p>
            </div>

            {packages.length > 0 ? (
              <>
                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 mb-12">
                  {/* Large Featured Card */}
                  {featuredPackage && (
                    <div className="lg:col-span-4 lg:row-span-2 animate-scale-in">
                      <div className="glass-dark rounded-3xl overflow-hidden h-full hover-lift backdrop-blur-xl border border-white/10">
                        <div className="relative h-[540px]">
                          <img
                            src={featuredPackage.image_url}
                            alt={featuredPackage.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-10">
                            <div className="glass inline-block px-4 py-2 rounded-full text-sm mb-4 backdrop-blur-xl">
                              ⭐ Most Popular
                            </div>
                            <h3 className="text-4xl font-bold text-white mb-3">
                              {featuredPackage.title}
                            </h3>
                            <p className="text-white/80 mb-6 text-lg">
                              {featuredPackage.description}
                            </p>
                            <div className="flex items-center gap-4">
                              <span className="text-3xl font-bold gradient-text">
                                {featuredPackage.price}
                                <span className="text-lg font-bold gradient-text">
                                  AED{" "}
                                </span>
                              </span>
                              <Link
                                to={`/booking/${featuredPackage.bookingId}`}
                              >
                                <Button variant="hero" size="lg">
                                  Book Now
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Two Smaller Cards */}
                  {sidePackages.map((pkg, index) => (
                    <div
                      key={pkg.id}
                      className="lg:col-span-2 animate-scale-in"
                      style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                    >
                      <div className="glass-dark rounded-3xl overflow-hidden h-full hover-lift backdrop-blur-xl border border-white/10">
                        <div className="relative h-64">
                          <img
                            src={pkg.image_url}
                            alt={pkg.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h3 className="text-xl font-bold text-white mb-2">
                              {pkg.title}
                            </h3>
                            <div className="flex items-center justify-between">
                              <span className="text-xl font-bold gradient-text">
                                {pkg.price}
                                <span className="text-sm font-bold gradient-text">
                                  AED{" "}
                                </span>
                              </span>
                              <Link to={`/booking/${pkg.bookingId}`}>
                                <Button size="sm" variant="hero">
                                  Book
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <Link to="/packages">
                    <Button
                      variant="hero"
                      size="xl"
                      className="shadow-glow hover-lift group"
                    >
                      View All Packages
                      <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </>
            ) : null}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-8 bg-gray-100">
          <h2 className="py-4 text-3xl md:text-5xl font-bold mb-4 text-center">
            Dubai <span className="gradient-text">Unforgettable Spots</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 mb-6 max-w-7xl mx-auto">
            {/* Ras Al Khaimah - spans 2 columns */}
            <div className="relative rounded-xl overflow-hidden shadow-md lg:col-span-2 lg:row-span-1">
              <img
                src={rasAlKhamiahImage || "/placeholder.svg"}
                alt="Ras Al Khaimah"
                className="w-full h-64 lg:h-72 object-cover"
              />
              <div className="absolute top-4 left-4 text-white font-semibold text-lg drop-shadow-lg">
                Ras Al Khaimah
              </div>
            </div>

            {/* Desert Arab */}
            <div className="relative rounded-xl overflow-hidden shadow-md">
              <img
                src={desertArabImage || "/placeholder.svg"}
                alt="Desert Arab"
                className="w-full h-64 lg:h-72 object-cover"
              />
              <div className="absolute top-4 left-4 text-white font-semibold text-lg drop-shadow-lg">
                Desert Arab
              </div>
            </div>

            {/* Burj Khalifa */}
            <div className="relative rounded-xl overflow-hidden shadow-md">
              <img
                src={burjKhalifaImage || "/placeholder.svg"}
                alt="Burj Khalifa"
                className="w-full h-64 lg:h-72 object-cover"
              />
              <div className="absolute top-4 left-4 text-white font-semibold text-lg drop-shadow-lg">
                Burj Khalifa
              </div>
            </div>

            {/* Dhow Cruise */}
            <div className="relative rounded-xl overflow-hidden shadow-md">
              <img
                src={dhowCruiseAttractionImage || "/placeholder.svg"}
                alt="Dhow Cruise"
                className="w-full h-64 lg:h-72 object-cover"
              />
              <div className="absolute top-4 left-4 text-white font-semibold text-lg drop-shadow-lg">
                Dhow Cruise
              </div>
            </div>

            {/* Burj Al Arab */}
            <div className="relative rounded-xl overflow-hidden shadow-md">
              <img
                src={burjAlArabImage || "/placeholder.svg"}
                alt="Burj Al Arab"
                className="w-full h-64 lg:h-72 object-cover"
              />
              <div className="absolute top-4 left-4 text-white font-semibold text-lg drop-shadow-lg">
                Burj Al Arab
              </div>
            </div>

            {/* Palm Jumeirah - spans 2 columns */}
            <div className="relative rounded-xl overflow-hidden shadow-md lg:col-span-2">
              <img
                src={palmJumeirahImage || "/placeholder.svg"}
                alt="Palm Jumeirah"
                className="w-full h-64 lg:h-72 object-cover"
              />
              <div className="absolute top-4 left-4 text-white font-semibold text-lg drop-shadow-lg">
                Palm Jumeirah
              </div>
            </div>
          </div>
        </section>
        {/* <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20" />

          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="glass-dark rounded-[3rem] p-12 md:p-20 text-center backdrop-blur-xl border border-white/10 hover-lift">
              <div className="inline-block glass px-6 py-3 rounded-full mb-8 backdrop-blur-xl">
                <span className="text-accent font-semibold">
                  ✨ Personalized Just For You
                </span>
              </div>

              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                Not Sure Where to <span className="gradient-text">Start?</span>
              </h2>
              <p className="text-xl md:text-2xl mb-10 text-muted-foreground max-w-2xl mx-auto">
                Take our interactive quiz and discover your perfect UAE
                adventure in just 2 minutes
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/quiz">
                  <Button
                    variant="hero"
                    size="xl"
                    className="shadow-glow hover-lift group text-lg px-10 py-7"
                  >
                    <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    Start the Quiz
                  </Button>
                </Link>
                <Link to="/packages">
                  <Button
                    variant="outline"
                    size="xl"
                    className="text-lg px-10 py-7 hover-lift"
                  >
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Browse All Tours
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/10">
                <div>
                  <div className="text-3xl font-bold gradient-text mb-1">
                    2 min
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Quick Quiz
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold gradient-text mb-1">
                    100%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Personalized
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold gradient-text mb-1">
                    Free
                  </div>
                  <div className="text-sm text-muted-foreground">
                    No Commitment
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}
      </div>
      <Footer />
    </>
  );
};

export default Index;
