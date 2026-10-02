import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Users,
  Star,
  Sparkles,
  ArrowRight,
  Currency,
  Loader,
} from "lucide-react";
import { Package } from "@/types/tourism";
import { useNavigate } from "react-router-dom";
import { usePricing } from "@/hooks/usePricing";
import { useIsMobile } from "@/hooks/use-mobile";
// import { usePackageDetail } from "@/hooks/usePackageDetail";

export const PackageCard = ({ package: pkg }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const {
    data: pricingData,
    isLoading: isPricingLoading,
    error: pricingError,
  } = usePricing();

  // Find the pricing entry that matches this package's ID
  // Convert both to numbers for comparison since pkg.id might be a string
  const pricingDetail = pricingData?.find(
    (pricing) => pricing.package === Number(pkg.id)
  );

  // Early return or default values if pricing not found
  if (!pricingDetail) {
    return (
      <Card className="group relative overflow-hidden hover-lift glass-dark border-white/10 backdrop-blur-xl">
        <div className="relative h-72 overflow-hidden rounded-t-xl">
          <img
            src={pkg.image}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-3xl font-bold text-white mb-2 group-hover:gradient-text transition-all">
              {pkg.name}
            </h3>
          </div>
        </div>

        <div className="p-6 space-y-4 bg-card/50 backdrop-blur-xl">
          <div className="flex flex-col justify-between pt-4 border-t border-border/50">
            <div className="flex w-full">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Starting From
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-start">
                {isPricingLoading ? (
                  <Loader className="w-6 h-6 text-muted-foreground animate-spin" />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Price not available
                  </p>
                )}
              </div>
              <Button
                variant="hero"
                size="lg"
                className="group/btn"
                onClick={() => navigate(`/booking/${pkg.id}`)}
              >
                Book Now
                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Extract all prices and discounts from API (now safe since we checked pricingDetail exists)
  const sharedAdultPrice = pricingDetail.shared_adult_price;
  const privateAdultPrice = pricingDetail.private_adult_price;
  const privateBasePrice = pricingDetail.private_base_price;
  const withoutTransferAdultPrice = pricingDetail.without_transfer_adult_price;

  const sharedAdultDiscount = pricingDetail.shared_adult_discount ?? 0;
  const privateAdultDiscount = pricingDetail.private_adult_discount ?? 0;
  const withoutTransferAdultDiscount =
    pricingDetail.without_transfer_adult_discount ?? 0;
  const overallDiscount = pricingDetail.discount ?? 0;

  // Priority logic: Determine which price to use
  // Priority: 1. Shared (if available and > 0), 2. Private (if available and > 0), 3. Without Transfer (if available and > 0)
  let basePrice = 200; // fallback
  let specificDiscount = 0;
  let priceType = "default";

  if (
    sharedAdultPrice !== null &&
    sharedAdultPrice !== undefined &&
    sharedAdultPrice > 0
  ) {
    // Shared price is available and greater than 0 - use it (highest priority)
    basePrice = sharedAdultPrice;
    specificDiscount = sharedAdultDiscount;
    priceType = "shared";
  } else if (
    privateAdultPrice !== null &&
    privateAdultPrice !== undefined &&
    privateAdultPrice > 0
  ) {
    // Private price is available and greater than 0
    basePrice = privateAdultPrice + (privateBasePrice ?? 0);
    specificDiscount = privateAdultDiscount;
    priceType = "private";
  } else if (
    withoutTransferAdultPrice !== null &&
    withoutTransferAdultPrice !== undefined &&
    withoutTransferAdultPrice > 0
  ) {
    // Without transfer price is available and greater than 0
    basePrice = withoutTransferAdultPrice;
    specificDiscount = withoutTransferAdultDiscount;
    priceType = "without_transfer";
  }

  // Combine the specific discount with overall discount
  // const totalDiscountPercent = specificDiscount + overallDiscount;
  const totalDiscountPercent = specificDiscount;

  // Cap at 100% to avoid negative prices
  const discountPercent = Math.min(totalDiscountPercent, 100);

  // Calculate discounted price
  const discountedPrice = basePrice * (1 - discountPercent / 100);

  // Display values
  const displayPrice = discountPercent > 0 ? discountedPrice : basePrice;
  const originalPrice = basePrice;
  const currencySymbol = pricingDetail.currency?.name ?? "AED";

  const handleBookNow = () => {
    navigate(`/booking/${pkg.id}`);
  };

  return (
    <Card className="group relative overflow-hidden hover-lift glass-dark border-white/10 backdrop-blur-xl">
      <div className="relative h-72 overflow-hidden rounded-t-xl">
        <img
          src={pkg.image}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {discountPercent > 0 && (
          <Badge className="absolute top-4 left-4 bg-green-600 text-white z-10">
            {Math.round(discountPercent)}% OFF
          </Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        {/* Title at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-3xl font-bold text-white mb-2 group-hover:gradient-text transition-all">
            {pkg.title}
          </h3>
        </div>
      </div>

      <div className="p-6 space-y-4 bg-card/50 backdrop-blur-xl">
        <div className="flex flex-col justify-between pt-4 border-t border-border/50">
          <div className="flex w-full">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Starting From
            </p>
          </div>
          <div className="flex justify-between items-center gap-2">
            <div className="flex flex-col items-start">
              {isPricingLoading ? (
                <Loader className="w-6 h-6 text-muted-foreground animate-spin" />
              ) : pricingError ? (
                <p className="text-sm text-red-500">Error loading price</p>
              ) : discountPercent > 0 ? (
                // Show original price with strikethrough + discounted price
                <>
                  <div className="flex flex-col">
                    <span className="flex items-end">
                      <p className="text-2xl font-bold gradient-text">
                        {Math.round(displayPrice).toLocaleString()}{" "}
                      </p>
                      <p className="text-sm font-bold gradient-text mb-0.5">
                        {currencySymbol}
                      </p>
                    </span>
                    <p className="text-sm text-muted-foreground line-through opacity-70">
                      {Math.round(originalPrice).toLocaleString()}{" "}
                      {currencySymbol}
                    </p>
                  </div>
                </>
              ) : (
                // No discount → just show normal price
                <span className="flex items-end">
                  <p className="text-2xl font-bold gradient-text">
                    {Math.round(basePrice).toLocaleString()}{" "}
                  </p>
                  <p className="text-sm font-bold gradient-text mb-0.5">
                    {currencySymbol}
                  </p>
                </span>
              )}
            </div>

            <Button
              variant="hero"
              size={isMobile ? "md" : "lg"}
              className="group/btn"
              onClick={handleBookNow}
            >
              Book Now
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
