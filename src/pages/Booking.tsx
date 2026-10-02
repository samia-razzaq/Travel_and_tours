import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Minus,
  Plus,
  Phone,
  ArrowLeft,
  Check,
  Loader2,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { usePackageDetail } from "@/hooks/usePackageDetail";
import { z } from "zod";
import { AddToCartPayload, AddToCartResponse } from "@/types/cart";
import { useAddToCart } from "@/hooks/useCart";
import { useIsAuthenticated } from "@/hooks/useAuth";
import { AxiosError } from "axios";

// Zod validation schema
const bookingSchema = z.object({
  date: z.date({
    required_error: "Please select a booking date",
  }),
  adults: z.number().min(1, "At least one adult is required"),
  children: z.number().min(0),
  infants: z.number().min(0).max(3, "Maximum 3 infants allowed"),
  pickupPlace: z.string().min(1, "Pickup place is required"),
  dropOffPlace: z.string().min(1, "Drop-off place is required"),
  transferOption: z.enum(["shared", "private", "without_transfer"]),
});

type BookingFormData = z.infer<typeof bookingSchema>;

// Interface for storing booking form data
interface StoredBookingData {
  packageId: string;
  formData: {
    date: string; // Store as ISO string
    adults: number;
    children: number;
    infants: number;
    pickupPlace: string;
    dropOffPlace: string;
    transferOption: "shared" | "private" | "without_transfer";
  };
  timestamp: number;
}

// Helper functions for localStorage management
const BOOKING_STORAGE_KEY = "pending_booking_data";
const STORAGE_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

const saveBookingData = (
  packageId: string,
  formData: Partial<BookingFormData>
) => {
  try {
    const dataToStore: StoredBookingData = {
      packageId,
      formData: {
        date: formData.date ? formData.date.toISOString() : "",
        adults: formData.adults || 1,
        children: formData.children || 0,
        infants: formData.infants || 0,
        pickupPlace: formData.pickupPlace || "",
        dropOffPlace: formData.dropOffPlace || "",
        transferOption: formData.transferOption || "shared",
      },
      timestamp: Date.now(),
    };
    localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(dataToStore));
  } catch (error) {
    console.error("Failed to save booking data:", error);
  }
};

const getStoredBookingData = (
  packageId: string
): Partial<BookingFormData> | null => {
  try {
    const stored = localStorage.getItem(BOOKING_STORAGE_KEY);
    if (!stored) return null;

    const data: StoredBookingData = JSON.parse(stored);

    // Check if data is for the same package
    if (data.packageId !== packageId) {
      localStorage.removeItem(BOOKING_STORAGE_KEY);
      return null;
    }

    // Check if data has expired
    if (Date.now() - data.timestamp > STORAGE_EXPIRY_MS) {
      localStorage.removeItem(BOOKING_STORAGE_KEY);
      return null;
    }

    // Convert stored data back to form format
    return {
      date: data.formData.date ? new Date(data.formData.date) : undefined,
      adults: data.formData.adults,
      children: data.formData.children,
      infants: data.formData.infants,
      pickupPlace: data.formData.pickupPlace,
      dropOffPlace: data.formData.dropOffPlace,
      transferOption: data.formData.transferOption,
    };
  } catch (error) {
    console.error("Failed to retrieve booking data:", error);
    return null;
  }
};

const clearStoredBookingData = () => {
  try {
    localStorage.removeItem(BOOKING_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear booking data:", error);
  }
};

export default function Booking() {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useIsAuthenticated();

  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

  const {
    data: packageDetail,
    isLoading: packageLoading,
    error: packageError,
  } = usePackageDetail(Number(packageId));

  const [transferOption, setTransferOption] = useState<
    "shared" | "private" | "without_transfer"
  >("shared");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [isRestoringData, setIsRestoringData] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      adults: 1,
      children: 0,
      infants: 0,
      pickupPlace: "",
      dropOffPlace: "",
      transferOption: "shared",
    },
  });

  const date = watch("date");
  const pickupPlace = watch("pickupPlace");
  const dropOffPlace = watch("dropOffPlace");

  // Check for stored booking data on mount
  useEffect(() => {
    if (!packageId || !isLoggedIn) return;

    const storedData = getStoredBookingData(packageId);
    if (storedData) {
      setIsRestoringData(true);

      // Restore all form fields
      if (storedData.date) setValue("date", storedData.date);
      if (storedData.adults) {
        setAdults(storedData.adults);
        setValue("adults", storedData.adults);
      }
      if (storedData.children !== undefined) {
        setChildren(storedData.children);
        setValue("children", storedData.children);
      }
      if (storedData.infants !== undefined) {
        setInfants(storedData.infants);
        setValue("infants", storedData.infants);
      }
      if (storedData.pickupPlace)
        setValue("pickupPlace", storedData.pickupPlace);
      if (storedData.dropOffPlace)
        setValue("dropOffPlace", storedData.dropOffPlace);
      if (storedData.transferOption) {
        setTransferOption(storedData.transferOption);
        setValue("transferOption", storedData.transferOption);
      }

      // Clear stored data after restoring
      clearStoredBookingData();

      // Show success message
      toast.success("Your booking details have been restored", {
        description: "Please review and submit your booking.",
      });

      setIsRestoringData(false);
    }
  }, [packageId, isLoggedIn, setValue]);

  // Set default transfer option based on available options
  useEffect(() => {
    if (packageDetail && !isRestoringData) {
      const availableOptions = getAvailableTransferOptions();
      if (
        availableOptions.length > 0 &&
        !availableOptions.includes(transferOption)
      ) {
        const newOption = availableOptions[0] as
          | "shared"
          | "private"
          | "without_transfer";
        setTransferOption(newOption);
        setValue("transferOption", newOption);
      }
    }
  }, [packageDetail, transferOption, setValue, isRestoringData]);

  // Sync form values with state
  useEffect(() => {
    setValue("adults", adults);
  }, [adults, setValue]);

  useEffect(() => {
    setValue("children", children);
  }, [children, setValue]);

  useEffect(() => {
    setValue("infants", infants);
  }, [infants, setValue]);

  useEffect(() => {
    setValue("transferOption", transferOption);
  }, [transferOption, setValue]);

  // Show loading state
  if (packageLoading) {
    return (
      <>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  // Show error state
  if (packageError || !packageDetail) {
    return (
      <>
        <Navigation />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-xl mb-4">Failed to load package details</p>
          <Button onClick={() => navigate("/packages")}>
            Back to Packages
          </Button>
        </div>
      </>
    );
  }

  const pkg = packageDetail.package;
  const pricing = packageDetail.pricing;
  const currencySymbol = pricing.currency.name;

  // Get available transfer options based on Transfer_Type
  const getAvailableTransferOptions = () => {
    const transferType = packageDetail.Transfer_Type?.toUpperCase() || "";
    const options: string[] = [];

    if (transferType.includes("S")) options.push("shared");
    if (transferType.includes("P")) options.push("private");
    if (transferType.includes("W")) options.push("without_transfer");

    return options.length > 0
      ? options
      : ["shared", "private", "without_transfer"];
  };

  const availableTransferOptions = getAvailableTransferOptions();

  // Helper function to format transfer type display
  const formatTransferType = (type: string) => {
    const typeMap: { [key: string]: string } = {
      P: "Private",
      S: "Shared",
      W: "Without Transfer",
    };

    return type
      .toUpperCase()
      .split(",")
      .map((char) => typeMap[char] || char)
      .join(", ");
  };

  // Dynamic duration and pickup timings based on transfer option
  const durationApprox =
    transferOption === "private"
      ? packageDetail.Private_Duration_Approx || packageDetail.Duration_Approx
      : transferOption === "without_transfer"
      ? packageDetail.Without_Transfer_Duration_Approx ||
        packageDetail.Duration_Approx
      : packageDetail.Duration_Approx;

  const pickupTimings =
    transferOption === "private"
      ? packageDetail.Private_Pickup_Timings || packageDetail.Pickup_Timings
      : transferOption === "without_transfer"
      ? packageDetail.Without_Transfer_Pickup_Timings ||
        packageDetail.Pickup_Timings
      : packageDetail.Pickup_Timings;

  // Price calculation helpers
  const getAdultPrice = () => {
    switch (transferOption) {
      case "shared":
        return pricing.shared_adult_price;
      case "private":
        return pricing.private_adult_price;
      case "without_transfer":
        return pricing.without_transfer_adult_price;
      default:
        return pricing.shared_adult_price;
    }
  };

  const getChildPrice = () => {
    switch (transferOption) {
      case "shared":
        return pricing.shared_child_price;
      case "private":
        return pricing.private_child_price;
      case "without_transfer":
        return pricing.without_transfer_child_price;
      default:
        return pricing.shared_child_price;
    }
  };

  const getDiscount = (isChild: boolean = false) => {
    if (isChild) {
      switch (transferOption) {
        case "shared":
          return pricing.shared_child_discount || 0;
        case "private":
          return pricing.private_child_discount || 0;
        case "without_transfer":
          return pricing.without_transfer_child_discount || 0;
        default:
          return 0;
      }
    } else {
      switch (transferOption) {
        case "shared":
          return pricing.shared_adult_discount || 0;
        case "private":
          return pricing.private_adult_discount || 0;
        case "without_transfer":
          return pricing.without_transfer_adult_discount || 0;
        default:
          return 0;
      }
    }
  };

  // Calculate starting price for sidebar (includes base price for private)
  const getStartingPrice = () => {
    const adultPrice = getAdultPrice();
    const adultDiscount = getDiscount(false);
    const discountedPrice = adultPrice * (1 - adultDiscount / 100);

    // For private transfers, add base price to the displayed starting price
    if (transferOption === "private") {
      const basePrice = pricing.private_base_price || 0;
      return discountedPrice + basePrice;
    }

    return discountedPrice;
  };

  const calculateTotal = () => {
    const adultPrice = getAdultPrice();
    const childPrice = getChildPrice();
    const adultDiscount = getDiscount(false);
    const childDiscount = getDiscount(true);
    const overallDiscount = pricing.discount || 0;

    const totalAdultAmount = adultPrice * adults;
    const totalChildAmount = childPrice * children;

    const adultDiscountedAmount = adultDiscount
      ? totalAdultAmount * (adultDiscount / 100)
      : 0;
    const childDiscountedAmount = childDiscount
      ? totalChildAmount * (childDiscount / 100)
      : 0;

    const finalAdultDiscount = Math.round(adultDiscountedAmount * 100) / 100;
    const finalChildDiscount = Math.round(childDiscountedAmount * 100) / 100;

    const totalAdultFinal = totalAdultAmount - finalAdultDiscount;
    const totalChildFinal = totalChildAmount - finalChildDiscount;

    let calculatedTotal = totalAdultFinal + totalChildFinal;

    if (transferOption === "private") {
      const basePrice = pricing.private_base_price || 0;
      const threshold = packageDetail.base_price_threshold || 7;
      const totalPeople = adults + children;
      const additionalPackageAmount =
        basePrice * Math.floor(totalPeople / threshold);
      calculatedTotal += basePrice + additionalPackageAmount;
    }

    const subtotal = calculatedTotal;

    if (overallDiscount > 0) {
      calculatedTotal = calculatedTotal * ((100 - overallDiscount) / 100);
    }

    return Math.round(calculatedTotal * 100) / 100;
  };

  // Form submission handler
  const onSubmit = (formData: BookingFormData) => {
    if (!packageDetail) {
      toast.error("Package details not loaded.");
      return;
    }

    const payload: AddToCartPayload = {
      package: Number(packageId),
      tour_option:
        transferOption === "shared"
          ? "S"
          : transferOption === "private"
          ? "P"
          : "W",
      adult_pax: adults,
      child_pax: children,
      infant_pax: infants,
      booking_date: format(formData.date, "yyyy-MM-dd"),
      city: packageDetail.package?.city || 1,
      country: packageDetail.package?.country || 1,
      currency: packageDetail.package?.currency || 1,
      location: packageDetail.package?.location || 1,
      pickup_place: formData.pickupPlace,
      dropOff_place: formData.dropOffPlace,
      current_country: "Pak",
    };

    addToCart(payload, {
      onSuccess: (data: AddToCartResponse) => {
        toast.success(data.message || data.detail || "Booking added to cart!", {
          description: `${adults} adult(s) ${children} children for ${
            pkg.name
          } on ${format(formData.date, "PPP")}`,
        });

        // Clear any stored booking data on successful submission
        clearStoredBookingData();
        // Add this block to reset form and states
        reset({
          date: undefined,
          adults: 1,
          children: 0,
          infants: 0,
          pickupPlace: "",
          dropOffPlace: "",
          transferOption: "shared",
        });
        setAdults(1);
        setChildren(0);
        setInfants(0);
        setTransferOption("shared");
      },
      onError: (error: unknown) => {
        let title = "Failed to add to cart";
        let description = "Please try again or contact support.";

        if (error instanceof Error) {
          let errorMsg = error.message;

          if (error instanceof AxiosError && error.response) {
            const apiData = error.response.data;
            errorMsg =
              (apiData as { detail?: string; message?: string; error?: string })
                .detail ||
              apiData.message ||
              apiData.error ||
              errorMsg;

            if (error.response.status >= 500) {
              title = "Server Error";
              description = "Our servers are having issues. Try again later.";
            } else if (
              error.response.status >= 400 &&
              error.response.status < 500
            ) {
              title = "Invalid Request";
              description = errorMsg || "Check your inputs and try again.";
            }
          }

          toast.error(title, { description });
        } else {
          toast.error(title, { description });
        }
      },
    });
  };

  // Handler for "Log in to add package to cart" button
  const handleLoginRedirect = () => {
    // Get current form values
    const currentFormData = {
      date: date,
      adults,
      children,
      infants,
      pickupPlace,
      dropOffPlace,
      transferOption,
    };

    // Save booking data to localStorage
    if (packageId) {
      saveBookingData(packageId, currentFormData);
      toast.info("Your booking details have been saved", {
        description: "You'll be redirected back after logging in.",
      });
    }

    // Navigate to auth page with return URL
    navigate("/auth", {
      state: {
        returnUrl: `/booking/${packageId}`,
        from: location.pathname,
      },
    });
  };

  const handleInfantIncrement = () => {
    if (infants >= 3) {
      toast.error("Maximum limit reached", {
        description: "Only 3 infants are allowed per booking",
      });
      return;
    }
    setInfants(infants + 1);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setValue("date", selectedDate, { shouldValidate: true });
    setDatePickerOpen(false);
  };

  const totalAmount = calculateTotal();
  const adultPrice = getAdultPrice();
  const childPrice = getChildPrice();
  const adultDiscount = getDiscount(false);
  const childDiscount = getDiscount(true);
  const overallDiscount = pricing.discount || 0;
  const adultDiscountPercent = adultDiscount;
  const childDiscountPercent = childDiscount;
  const discountedAdultPrice = adultPrice * (1 - adultDiscountPercent / 100);
  const discountedChildPrice = childPrice * (1 - childDiscountPercent / 100);

  const threshold = packageDetail.base_price_threshold || 7;
  const basePrice =
    transferOption === "private" ? pricing.private_base_price || 0 : 0;
  const totalPeople = adults + children;
  const additionalBaseCount = Math.floor(totalPeople / threshold);
  const additionalBasePrice = basePrice * additionalBaseCount;

  const perPersonSubtotal =
    adults * discountedAdultPrice + children * discountedChildPrice;
  const privateSubtotal =
    transferOption === "private" ? basePrice + additionalBasePrice : 0;
  const subtotal = perPersonSubtotal + privateSubtotal;
  const packageDiscAmount = subtotal * (overallDiscount / 100);

  const startingPrice = getStartingPrice();
  const originalAdultPrice = getAdultPrice();

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-16">
        {/* Hero Section */}
        <div className="relative h-96 overflow-hidden">
          <img
            src={pkg.image}
            alt={pkg.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

          <div className="absolute top-6 left-6">
            <Button
              variant="ghost"
              size="icon"
              className="glass text-white hover:bg-white/20"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto">
            <p className="text-white/80 uppercase tracking-wide text-sm mb-2">
              Enjoy
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {pkg.name}
            </h1>
            {/* <Button size="lg" className="gap-2 bg-green-600 hover:bg-green-700">
              <Phone className="w-4 h-4" />
              Call Now
            </Button> */}
          </div>
        </div>

        {/* Booking Form */}
        <div className="container mx-auto py-12 px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="p-8 glass-dark border-white/10">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Transfer Option */}
                  {availableTransferOptions.length > 1 && (
                    <div className="space-y-2">
                      <Label htmlFor="transfer" className="text-lg">
                        Transfer Option:
                      </Label>
                      <Select
                        value={transferOption}
                        onValueChange={(
                          value: "shared" | "private" | "without_transfer"
                        ) => setTransferOption(value)}
                      >
                        <SelectTrigger id="transfer" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTransferOptions.includes("shared") && (
                            <SelectItem value="shared">
                              Shared Transfers (Per Person)
                            </SelectItem>
                          )}
                          {availableTransferOptions.includes("private") && (
                            <SelectItem value="private">
                              Private Transfers (Per Vehicle)
                            </SelectItem>
                          )}
                          {availableTransferOptions.includes(
                            "without_transfer"
                          ) && (
                            <SelectItem value="without_transfer">
                              Without Transfer
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Date Picker */}
                  <div className="space-y-2">
                    <Label className="text-lg">
                      Date: <span className="text-red-500">*</span>
                    </Label>
                    <Popover
                      open={datePickerOpen}
                      onOpenChange={setDatePickerOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground",
                            errors.date && "border-red-500"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={handleDateSelect}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                      {errors.date && (
                      <p className="text-sm text-red-500">
                        {errors.date.message}
                      </p>
                    )}
                    </Popover>
                    
                  </div>

                  {/* Pickup & Drop-off */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pickup" className="text-lg">
                        Pickup Place: <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="pickup"
                          placeholder="Enter pickup location"
                          {...register("pickupPlace")}
                          className={cn(
                            "pl-10",
                            errors.pickupPlace && "border-red-500"
                          )}
                        />
                      </div>
                      {errors.pickupPlace && (
                        <p className="text-sm text-red-500">
                          {errors.pickupPlace.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dropoff" className="text-lg">
                        Drop-off Place: <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="dropoff"
                          placeholder="Enter drop-off location"
                          {...register("dropOffPlace")}
                          className={cn(
                            "pl-10",
                            errors.dropOffPlace && "border-red-500"
                          )}
                        />
                      </div>
                      {errors.dropOffPlace && (
                        <p className="text-sm text-red-500">
                          {errors.dropOffPlace.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Guest Counters */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-lg">
                        Adults: <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          disabled={adults <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-2xl font-bold w-12 text-center">
                          {adults}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setAdults(adults + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Minimum 1 adult required
                      </p>
                    </div>

                    {packageDetail.is_child && (
                      <div className="space-y-2">
                        <Label className="text-lg">Child:</Label>
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setChildren(Math.max(0, children - 1))
                            }
                            disabled={children <= 0}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-2xl font-bold w-12 text-center">
                            {children}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setChildren(children + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {packageDetail.is_infant && (
                      <div className="space-y-2">
                        <Label className="text-lg">Infants:</Label>
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setInfants(Math.max(0, infants - 1))}
                            disabled={infants <= 0}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-2xl font-bold w-12 text-center">
                            {infants}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={handleInfantIncrement}
                            disabled={infants >= 3}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Maximum 3 infants
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 pt-4 border-t border-border/50">
                    {adults > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>
                          Adults ({adults} × {discountedAdultPrice.toFixed(2)}{" "}
                          {currencySymbol})
                          {adultDiscountPercent > 0 && (
                            <span className="text-green-600 ml-2">
                              ({adultDiscountPercent}% off)
                            </span>
                          )}
                        </span>
                        <span className="font-medium">
                          {(adults * discountedAdultPrice).toFixed(2)}{" "}
                          {currencySymbol}
                        </span>
                      </div>
                    )}
                    {children > 0 && packageDetail.is_child && (
                      <div className="flex justify-between text-sm">
                        <span>
                          Children ({children} ×{" "}
                          {discountedChildPrice.toFixed(2)} {currencySymbol})
                          {childDiscountPercent > 0 && (
                            <span className="text-green-600 ml-2">
                              ({childDiscountPercent}% off)
                            </span>
                          )}
                        </span>
                        <span className="font-medium">
                          {(children * discountedChildPrice).toFixed(2)}{" "}
                          {currencySymbol}
                        </span>
                      </div>
                    )}
                    {infants > 0 && packageDetail.is_infant && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Infants ({infants}) - Free</span>
                        <span className="font-medium">0 {currencySymbol}</span>
                      </div>
                    )}
                    {transferOption === "private" && (
                      <div className="flex justify-between text-sm">
                        <span>Base Package Price</span>
                        <span className="font-medium">
                          {basePrice.toFixed(2)} {currencySymbol}
                        </span>
                      </div>
                    )}
                    {transferOption === "private" &&
                      packageDetail.base_price_threshold &&
                      adults + children >=
                        packageDetail.base_price_threshold && (
                        <div className="flex justify-between text-sm text-blue-600">
                          <span>
                            Additional Base Price (Exceeds threshold of{" "}
                            {packageDetail.base_price_threshold})
                          </span>
                          <span className="font-medium">
                            + {additionalBasePrice.toFixed(2)} {currencySymbol}
                          </span>
                        </div>
                      )}
                    {overallDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>
                          Overall Package Discount ({overallDiscount}%)
                        </span>
                        <span className="font-medium">
                          - {packageDiscAmount.toFixed(2)} {currencySymbol}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Total Amount */}
                  <div className="pt-6 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium">Total Amount:</span>
                      <span className="text-3xl font-bold gradient-text">
                        {totalAmount.toFixed(2)} {currencySymbol}
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  {isLoggedIn ? (
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isAddingToCart}
                    >
                      {isAddingToCart ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding to cart...
                        </>
                      ) : (
                        "Add Booking to Cart"
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="lg"
                      className="w-full"
                      onClick={handleLoginRedirect}
                    >
                      Log in to add package to cart
                    </Button>
                  )}
                </form>
              </Card>

              {/* About Section */}
              <Card className="p-8 glass-dark border-white/10">
                <h2 className="text-2xl font-bold mb-4">About this tour</h2>
                <div
                  className="text-foreground/80 leading-relaxed prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: packageDetail.description,
                  }}
                />
              </Card>

              {/* Highlights */}
              {packageDetail.highlights && (
                <Card className="p-8 glass-dark border-white/10">
                  <h2 className="text-2xl font-bold mb-4">Highlights</h2>
                  <div
                    className="text-foreground/80 leading-relaxed prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: packageDetail.highlights,
                    }}
                  />
                </Card>
              )}

              {/* Reservation Details */}
              <Card className="p-8 glass-dark border-white/10">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <h3 className="text-xl font-bold">
                        Reservation Approval
                      </h3>
                    </div>
                    <p className="text-foreground/80">
                      Instant Tour Confirmation will be Provided
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-bold">Hours & Duration</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-foreground/80">
                        <span className="font-semibold">Duration:</span>{" "}
                        {durationApprox}
                      </p>
                      {packageDetail.Pickup_Timings && (
                        <p className="text-foreground/80">
                          <span className="font-semibold">Pickup Time:</span>{" "}
                          {pickupTimings}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-3">
                      Cancellation Policy
                    </h3>
                    <div
                      className="text-foreground/80 prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: packageDetail.Cancellation_Policy,
                      }}
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-3">Child Policy</h3>
                    <div
                      className="text-foreground/80 prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: packageDetail.child_policy,
                      }}
                    />
                  </div>
                </div>
              </Card>

              {/* Important Info */}
              {packageDetail.important_info && (
                <Card className="p-8 glass-dark border-white/10">
                  <h2 className="text-2xl font-bold mb-4">
                    Important Information
                  </h2>
                  <div
                    className="text-foreground/80 leading-relaxed prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: packageDetail.important_info,
                    }}
                  />
                </Card>
              )}

              {/* Inclusions */}
              {packageDetail.Inclusions && (
                <Card className="p-8 glass-dark border-white/10">
                  <h2 className="text-2xl font-bold mb-4">Inclusions</h2>
                  <div
                    className="text-foreground/80 leading-relaxed prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: packageDetail.Inclusions,
                    }}
                  />
                </Card>
              )}

              {/* Exclusions */}
              {packageDetail.exclusions && (
                <Card className="p-8 glass-dark border-white/10">
                  <h2 className="text-2xl font-bold mb-4">Exclusions</h2>
                  <div
                    className="text-foreground/80 leading-relaxed prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: packageDetail.exclusions,
                    }}
                  />
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 glass-dark border-white/10 sticky top-24">
                <h3 className="text-xl font-bold mb-4">Package Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-foreground/80">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-semibold">{durationApprox}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-foreground/80">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Transfer Type
                      </p>
                      <p className="font-semibold capitalize">
                        {formatTransferType(packageDetail.Transfer_Type)}
                      </p>
                    </div>
                    {/* <div>
                      <p className="text-sm text-slate-400">Transfer Type</p>
                      <p className="font-semibold text-white">
                        
                      </p>
                    </div> */}
                  </div>
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                      Starting From
                    </p>
                    <div className="flex flex-col items-start">
                      {adultDiscount > 0 ? (
                        <>
                          <Badge className="mb-2 bg-green-600 text-white">
                            {Math.round(adultDiscount)}% OFF
                          </Badge>
                          {/* <div className="flex items-baseline gap-3">
                            <span className="text-2xl font-bold gradient-text">
                              {Math.round(
                                discountedAdultPrice
                              ).toLocaleString()}{" "}
                              {currencySymbol}
                            </span>
                            <span className="text-sm text-muted-foreground line-through opacity-70">
                              {Math.round(adultPrice).toLocaleString()}{" "}
                              {currencySymbol}
                            </span>
                          </div> */}
                          <div className="flex items-baseline gap-3">
                            <span className="text-2xl font-bold gradient-text">
                              {Math.round(startingPrice).toLocaleString()}{" "}
                              {currencySymbol}
                            </span>
                            <span className="text-sm text-muted-foreground line-through opacity-70">
                              {Math.round(
                                originalAdultPrice +
                                  (transferOption === "private"
                                    ? pricing.private_base_price
                                    : 0)
                              ).toLocaleString()}{" "}
                              {currencySymbol}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold gradient-text">
                            {Math.round(adultPrice).toLocaleString()}{" "}
                            {currencySymbol}
                          </span>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        per adult
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
