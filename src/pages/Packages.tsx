import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PackageCard } from "@/components/PackageCard";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Loader2,
  AlertCircle,
  Hourglass,
  Clock,
  Loader,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Pricing } from "@/types/tourism";
import { useCities } from "@/hooks/useCities";
import { useLocations } from "@/hooks/useLocation";
import { usePackages } from "@/hooks/usePackages";
import { usePricing } from "@/hooks/usePricing";
import { usePackageDetail } from "@/hooks/usePackageDetail";
import { useIsMobile } from "@/hooks/use-mobile";

const Packages = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const packagesRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    setSelectedLocation(null); // Clear location filter when city changes
  }, [selectedCity]);

  // Fetch cities
  const {
    data: cities,
    isLoading: citiesLoading,
    error: citiesError,
  } = useCities();

  // Fetch packages (filtered by city if selected)
  const {
    data: packages,
    isLoading: packagesLoading,
    error: packagesError,
  } = usePackages(selectedCity || undefined);

  const {
    data: locations,
    isLoading: locationsLoading,
    error: locationsError,
  } = useLocations(selectedCity || undefined);

  const handleCityChange = (cityName: string) => {
    setSelectedCity(selectedCity === cityName ? null : cityName);
  };

  //Map locations to packages
  const mappedLocations =
    locations?.map((loc) => ({
      id: loc.id.toString(),
      name: loc.name,
      image: loc.image,
      city: loc.city,
    })) || [];

  // Map API packages to component format - KEEP ID AS NUMBER for pricing match
  const mappedPackages =
    packages?.map((pkg) => ({
      id: pkg.id, // Keep as number for pricing lookup
      title: pkg.name,
      image: pkg.image,
      is_active: pkg.is_active,
      created_at: pkg.created_at,
      modified_at: pkg.modified_at,
      city: pkg.city,
      country: pkg.country,
      currency: pkg.currency,
      location: pkg.location?.toString() || "",
    })) || [];

  //Filter packages based on selected location
  const filteredPackages = selectedLocation
    ? mappedPackages.filter((pkg) => pkg.location === selectedLocation)
    : mappedPackages;

  // if (citiesError && locationsLoading && packagesError) {
  //   return (
  //     <>
  //       <Navigation />
  //       <div className="flex flex-col items-center justify-center gap-4 border border-red-200 bg-red-50 rounded-2xl p-10 text-center">
  //         <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100">
  //           <AlertCircle className="w-7 h-7 text-red-500" />
  //         </div>

  //         <h2 className="text-xl font-semibold text-gray-900">
  //           Something went wrong
  //         </h2>

  //         <p className="text-sm text-gray-600 max-w-xs">
  //           We couldn’t load the locations right now. Please check your
  //           connection or try again.
  //         </p>

  //         <Button
  //           onClick={() => window.location.reload()}
  //           className="mt-2 px-6"
  //           variant="destructive"
  //         >
  //           Try Again
  //         </Button>
  //       </div>
  //     </>
  //   );
  // }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
        {/* Header */}
        <div className="pt-32 pb-16 gradient-hero text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Explore Our Packages
            </h1>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Discover amazing experiences across Dubai, Abu Dhabi, and the UAE
            </p>
            {/* <Link to="/quiz">
              <Button
                variant="secondary"
                size={isMobile ? "default" : "lg"}
                className="bg-white text-primary hover:bg-white/90"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Get Personalized Recommendations
              </Button>
            </Link> */}
            <Button
              variant="secondary"
              size={isMobile ? "default" : "lg"}
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => {
                packagesRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Explore Packages
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Location Selector Cards */}
          {citiesLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : citiesError ? (
            <div className="flex flex-col items-center justify-center gap-4 border border-red-200 bg-red-50 rounded-2xl p-10 text-center">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100">
                <AlertCircle className="w-7 h-7 text-red-500" />
              </div>

              <h2 className="text-xl font-semibold text-gray-900">
                Something went wrong
              </h2>

              <p className="text-sm text-gray-600 max-w-xs">
                We couldn’t load the cities right now. Please check your
                connection or try again.
              </p>

              <Button
                onClick={() => window.location.reload()}
                className="mt-2 px-6"
                variant="destructive"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="mb-16">
              <h2 className="text-5xl font-semibold text-center gradient-text mb-10">
                Popular Cities to Visit
              </h2>

              <div className="flex items-center justify-center flex-row-reverse flex-wrap md:flex-nowrap gap-8 max-w-5xl mx-auto">
                {cities?.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleCityChange(city.name)}
                    className={`relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 group ring-4 ${
                      selectedCity === city.name
                        ? "ring-primary ring-offset-2 scale-105"
                        : "ring-transparent hover:ring-primary/50"
                    }`}
                  >
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-full max-h-60 md:max-h-80 aspect-video object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-8 left-8 text-white text-left">
                      <h3 className="text-4xl md:text-5xl font-bold mb-2">
                        {city.name}
                      </h3>
                    </div>
                  </button>
                ))}
              </div>

              {selectedCity && (
                <div className="text-center mt-6">
                  <Button
                    variant="hero"
                    onClick={() => {
                      setSelectedCity(null);
                    }}
                  >
                    Show All Packages
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Locations Grid */}
          {locationsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : locationsError ? (
            <div className="flex flex-col items-center justify-center gap-4 border border-red-200 bg-red-50 rounded-2xl p-10 text-center">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100">
                <AlertCircle className="w-7 h-7 text-red-500" />
              </div>

              <h2 className="text-xl font-semibold text-gray-900">
                Something went wrong
              </h2>

              <p className="text-sm text-gray-600 max-w-xs">
                We couldn’t load the locations right now. Please check your
                connection or try again.
              </p>

              <Button
                onClick={() => window.location.reload()}
                className="mt-2 px-6"
                variant="destructive"
              >
                Try Again
              </Button>
            </div>
          ) : mappedLocations.length > 0 ? (
            <>
              <h2 className="text-3xl font-semibold text-start gradient-text">
                Top {selectedCity} Activities
              </h2>
              <div className="flex flex-wrap justify-center gap-6 md:gap-10 py-10 px-0 md:px-10">
                {mappedLocations.map((loc, index) => (
                  <button
                    key={loc.id}
                    onClick={() =>
                      setSelectedLocation(
                        selectedLocation === loc.id ? null : loc.id // toggle
                      )
                    }
                    className={`w-40 h-40 rounded-xl overflow-hidden shadow-sm transition-all duration-300 transform ${
                      selectedLocation === loc.id
                        ? "ring-4 ring-primary ring-offset-2 scale-105"
                        : "hover:shadow-md hover:ring-2 hover:ring-primary/50 hover:scale-105"
                    }`}
                  >
                    <div className="h-[75%] w-full">
                      <img
                        src={loc.image}
                        alt={loc.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="h-[25%] flex items-center justify-center bg-white">
                      <p className="text-sm font-semibold text-gray-800">
                        {loc.name.split("-")[0].trim()}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center ">
              <p className="text-xl text-muted-foreground">
                {selectedCity
                  ? `Locations for ${selectedCity} are coming soon!`
                  : ""}
              </p>
            </div>
          )}

          {/* Packages Grid */}
          {packagesLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : packagesError ? (
            <div className="flex flex-col items-center justify-center gap-4 border border-red-200 bg-red-50 rounded-2xl p-10 text-center">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100">
                <AlertCircle className="w-7 h-7 text-red-500" />
              </div>

              <h2 className="text-xl font-semibold text-gray-900">
                Something went wrong
              </h2>

              <p className="text-sm text-gray-600 max-w-xs">
                We couldn’t load the packages right now. Please check your
                connection or try again.
              </p>

              <Button
                onClick={() => window.location.reload()}
                className="mt-2 px-6"
                variant="destructive"
              >
                Try Again
              </Button>
            </div>
          ) : filteredPackages.length > 0 ? (
            <>
              <h2  ref={packagesRef}  className="text-2xl font-semibold text-start gradient-text mb-6">
                {selectedLocation
                  ? mappedLocations
                      .find((l) => l.id === selectedLocation)
                      ?.name.split("-")[0]
                      .trim() || "Selected Location"
                  : selectedCity
                  ? `Popular Places in ${selectedCity}`
                  : "Popular Places"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPackages.map((pkg, index) => (
                  <div
                    key={pkg.id}
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <PackageCard package={pkg} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            // "Coming soon" message - can make it more specific
            <div className="text-center">
              {selectedCity && (
                <div className="flex justify-center">
                  <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-sm">
                    {/* Icon */}
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Hourglass className="h-6 w-6 text-muted-foreground animate-pulse" />
                    </div>

                    {/* Heading */}
                    <p className="text-base font-semibold text-foreground">
                      Coming Soon
                    </p>

                    {/* Description */}
                    <p className="mt-1 text-sm text-muted-foreground">
                      Packages for{" "}
                      <span className="font-medium">{selectedCity}</span> will
                      be available shortly.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Packages;
