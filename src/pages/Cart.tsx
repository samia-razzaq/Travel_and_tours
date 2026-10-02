import { useContext } from "react";
import { AuthContext } from "@/context/authContext";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  CalendarDays,
  Users,
  MapPin,
  MapPinOff,
  Edit,
  Plus,
  Minus,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/sonner";
import {
  useCart,
  useRemoveFromCart,
  useUpdateCartItem,
  useCheckout,
} from "@/hooks/useCart";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CartItem, UpdateCartItemPayload } from "@/types/cart";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Cart() {
  const auth = useContext(AuthContext);
  const { isLoading: authIsLoading, isAuthenticated } = auth || {};

  const {
    data: cartData,
    isLoading: cartIsLoading,
    error: cartError,
  } = useCart();

  const { mutate: removeFromCart } = useRemoveFromCart();
  const { mutate: updateCartItem, isPending: isUpdating } = useUpdateCartItem();
  const { mutate: checkoutMutate, isPending: isCheckingOut } = useCheckout();

  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<CartItem | null>(null);

  const updateSchema = z.object({
    tour_option: z.enum(["P", "S", "W"], { message: "Tour type is required" }),
    adult_pax: z.number().min(1, "At least 1 adult is required"),
    child_pax: z.number().min(0),
    infant_pax: z.number().min(0).max(3, "Maximum 3 infants allowed"),
    booking_date: z
      .string()
      .min(1, "Booking date is required")
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      }),
    pickup_place: z
      .string()
      .min(1, "Pickup place is required")
      .max(200, "Pickup place is too long"),
    dropOff_place: z
      .string()
      .min(1, "Dropoff place is required")
      .max(200, "Dropoff place is too long"),
    current_country: z
      .string()
      .min(1, "Current country is required")
      .max(100, "Current country is too long"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
    trigger,
  } = useForm<UpdateCartItemPayload>({
    resolver: zodResolver(updateSchema),
    mode: "onChange",
    defaultValues: {
      tour_option: "",
      adult_pax: 1,
      child_pax: 0,
      infant_pax: 0,
      booking_date: "",
      pickup_place: "",
      dropOff_place: "",
      current_country: "",
    },
  });

  // Helper to update pax safely
  const updatePax = async (
    field: "adult_pax" | "child_pax" | "infant_pax",
    delta: number
  ) => {
    const current = getValues(field);
    const newValue = current + delta;
    const clampedValue =
      field === "infant_pax"
        ? Math.max(0, Math.min(3, newValue))
        : Math.max(0, newValue);

    // Prevent going to 0 if it would make total passengers 0
    const { adult_pax, child_pax, infant_pax } = getValues();
    const currentTotal = adult_pax + child_pax + infant_pax;
    const newTotal = currentTotal + delta;

    if (newTotal < 1) {
      return; // don't allow total to go to 0
    }

    setValue(field, clampedValue);
    await trigger(field);
  };

  const handleEditOpen = (item: CartItem) => {
    const availableStr = item.available_tour_options;
    const available = availableStr
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);
    let initialTourOption = item.tour_option;
    if (!available.includes(initialTourOption)) {
      initialTourOption = available[0];
    }
    reset({
      tour_option: initialTourOption,
      adult_pax: item.adult_pax,
      child_pax: item.child_pax,
      infant_pax: item.infant_pax,
      booking_date: item.booking_date,
      pickup_place: item.pickup_place,
      dropOff_place: item.dropOff_place,
      current_country: item.current_country,
    });
    setEditItem(item);
  };

  const onSubmit = (data: UpdateCartItemPayload) => {
    if (editItem) {
      updateCartItem(
        { itemId: editItem.id, payload: data },
        {
          onSuccess: () => {
            setEditItem(null);
          },
        }
      );
    }
  };

  const handleCheckout = () => {
    checkoutMutate(undefined, {
      onSuccess: (data) => {
        if (data.detail || data.code) {
          toast.error(data.detail || "Checkout error");
        } else {
          toast.success(data.message || "Checkout successful");
          if (data.checkout_url) {
            // Delay redirect to allow toast visibility
            setTimeout(() => {
              window.location.href = data.checkout_url;
            }, 1500);
          }
        }
      },
      onError: (error) => {
        toast.error(error.message || "Failed to checkout");
      },
    });
  };

  if (authIsLoading) {
    return (
      <>
        <Navigation />
        <div className="py-24 max-w-7xl h-screen mx-auto px-4 flex justify-center items-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Navigation />
        <div className="h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-semibold">Please Log In</h1>
            <p className="text-muted-foreground mt-3">
              You need to be logged in to view your cart.
            </p>
            <Button variant="hero" size="lg" className="mt-6" asChild>
              <Link to="/auth">Log In</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  if (cartIsLoading) {
    return (
      <>
        <Navigation />
        <div className="py-24 max-w-7xl h-screen mx-auto px-4 flex justify-center items-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </>
    );
  }

  if (cartError) {
    return (
      <>
        <Navigation />

        <div className="h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            {/* Error Icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3m0 4h.01M10.29 3.86l-8.3 14.36A1.5 1.5 0 003.3 21h17.4a1.5 1.5 0 001.3-2.78l-8.3-14.36a1.5 1.5 0 00-2.7 0z"
                />
              </svg>
            </div>

            {/* Text */}
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p className="text-muted-foreground mt-3">
              We couldn’t load your cart right now. Please try again or continue
              shopping.
            </p>

            {/* CTA */}
            <div className="mt-6 flex justify-center gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
              <Button variant="hero" size="lg">
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const items = cartData?.items || [];
  const sortedItems = [...items].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return dateB.getTime() - dateA.getTime();
  });
  const cartTotal = cartData?.total_price || 0;

  if (items.length === 0) {
    return (
      <>
        <Navigation />

        <div className="h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            {/* Icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7h13M7 13L5.4 5M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
                />
              </svg>
            </div>

            {/* Text */}
            <h1 className="text-2xl font-semibold">Your cart is empty</h1>
            <p className="text-muted-foreground mt-3">
              Looks like you haven’t added anything yet. Start shopping to fill
              your cart.
            </p>

            {/* CTA */}
            <Button
              variant="hero"
              size="lg"
              className="mt-6"
              onClick={() => (window.location.href = "/packages")} // Changed to full navigation if no router hook
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </>
    );
  }

  const getTourType = (option: string) => {
    switch (option) {
      case "P":
        return "Private Transfers (Per Vehicle)";
      case "S":
        return "Shared Transfers (Per Person)";
      case "W":
        return "Without Transfer";
      default:
        return option;
    }
  };

  const tourOptions = [
    { value: "P", label: "Private Transfers (Per Vehicle)" },
    { value: "S", label: "Shared Transfers (Per Person)" },
    { value: "W", label: "Without Transfer" },
  ];

  return (
    <>
      <Navigation />
      <div className="py-24 max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl font-semibold">My Cart</h1>

          {sortedItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="overflow-hidden rounded-2xl shadow-sm sticky">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <img
                      src={item.Package_details.image}
                      alt={item.Package_details.name}
                      className="w-full md:w-48 h-48 md:h-auto object-cover"
                    />

                    {/* Content */}
                    <div className="flex-1 p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h2 className="text-lg font-medium">
                          {item.Package_details.name}
                        </h2>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                            onClick={() => handleEditOpen(item)}
                          >
                            <Edit className="w-5 h-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                            onClick={() => setDeleteItemId(item.id)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {item.adult_pax} Adults, {item.child_pax} Children,{" "}
                          {item.infant_pax} Infants
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-4 h-4" />
                          {format(new Date(item.booking_date), "dd MMM yyyy")}
                        </span>
                        <span>{getTourType(item.tour_option)}</span>
                      </div>

                      <div className="flex flex-col flex-wrap gap-4 text-sm text-muted-foreground  pt-3 border-t">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          Pickup Location: {item.pickup_place}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPinOff className="w-4 h-4" />
                          Dropoff Location: {item.dropOff_place}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t">
                        <span className="text-sm text-muted-foreground">
                          Total Price
                        </span>
                        <span className="text-lg font-semibold">
                          AED {item.total_price}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-24 h-fit"
        >
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Order Summary</h2>

              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>AED {cartTotal}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Taxes</span>
                <span>Included</span>
              </div>

              <div className="flex justify-between text-lg font-semibold border-t pt-4">
                <span>Total</span>
                <span>AED {cartTotal}</span>
              </div>

              <Button
                variant="hero"
                className="w-full rounded-xl mt-4"
                disabled={isCheckingOut}
                onClick={handleCheckout}
              >
                {isCheckingOut && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Dialog
        open={deleteItemId !== null}
        onOpenChange={(open) => !open && setDeleteItemId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this item from your cart? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteItemId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteItemId !== null) {
                  removeFromCart(deleteItemId);
                }
                setDeleteItemId(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editItem !== null}
        onOpenChange={(open) => !open && setEditItem(null)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Cart Item</DialogTitle>
            <DialogDescription>
              Update passengers and details for{" "}
              <strong>{editItem?.Package_details.name}</strong>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid place-items-start gap-6 py-4">
              {/* Transfer Option */}
              {(() => {
                const availableStr =
                  editItem?.available_tour_options || "P,S,W";
                const available = availableStr
                  .split(",")
                  .map((s) => s.trim().toUpperCase());
                const filteredOptions = tourOptions.filter((o) =>
                  available.includes(o.value)
                );
                return (
                  <>
                    {filteredOptions.length > 1 && (
                      <div className="w-full flex items-center gap-2">
                        <Label htmlFor="transfer" className="text-sm">
                          Transfer Option
                        </Label>
                        <Select
                          value={watch("tour_option")}
                          onValueChange={(value) =>
                            setValue("tour_option", value)
                          }
                        >
                          <SelectTrigger id="transfer" className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {filteredOptions.length === 1 && (
                      <div className="w-full flex items-center gap-2">
                        <Label className="text-md">Transfer Option:</Label>
                        <p className="text-sm font-medium">
                          {filteredOptions[0].label}
                        </p>
                      </div>
                    )}
                    {errors.tour_option?.message && (
                      <p className="text-red-500 text-sm -mt-4">
                        {errors.tour_option.message}
                      </p>
                    )}
                  </>
                );
              })()}

              {/* Passengers - Plus/Minus Buttons */}
              <div className="w-full space-y-4">
                <Label>Passengers</Label>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Adults</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      type="button"
                      onClick={() => updatePax("adult_pax", -1)}
                      disabled={watch("adult_pax") <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">
                      {watch("adult_pax")}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      type="button"
                      onClick={() => updatePax("adult_pax", 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {errors.adult_pax?.message && (
                  <p className="text-red-500 text-sm -mt-2">
                    {errors.adult_pax.message}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Children</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      type="button"
                      onClick={() => updatePax("child_pax", -1)}
                      disabled={watch("child_pax") <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">
                      {watch("child_pax")}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      type="button"
                      onClick={() => updatePax("child_pax", 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {errors.child_pax?.message && (
                  <p className="text-red-500 text-sm -mt-2">
                    {errors.child_pax.message}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Infants</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      type="button"
                      onClick={() => updatePax("infant_pax", -1)}
                      disabled={watch("infant_pax") <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">
                      {watch("infant_pax")}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      type="button"
                      onClick={() => updatePax("infant_pax", 1)}
                      disabled={watch("infant_pax") >= 3}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {errors.infant_pax?.message && (
                  <p className="text-red-500 text-sm -mt-2">
                    {errors.infant_pax.message}
                  </p>
                )}
              </div>

              {/* Date */}
              <div className="w-full flex justify-center items-center gap-4">
                <Label className="text-right">Date</Label>
                <Input
                  type="date"
                  {...register("booking_date")}
                  className="flex"
                />
              </div>
              {errors.booking_date?.message && (
                <p className="text-red-500 text-sm -mt-4">
                  {errors.booking_date.message}
                </p>
              )}

              {/* Pickup & Dropoff */}
              <div className="w-full flex items-center justify-between gap-4">
                <Label>Pickup</Label>
                <Input {...register("pickup_place")} />
              </div>
              {errors.pickup_place?.message && (
                <p className="text-red-500 text-sm -mt-4">
                  {errors.pickup_place.message}
                </p>
              )}

              <div className="w-full flex items-center justify-between gap-4">
                <Label className="text-right">Dropoff</Label>
                <Input {...register("dropOff_place")} />
              </div>
              {errors.dropOff_place?.message && (
                <p className="text-red-500 text-sm -mt-4">
                  {errors.dropOff_place.message}
                </p>
              )}

              {/* Current Country */}
              <div className="w-full flex items-center justify-between gap-4">
                <Label className="text-right">Country</Label>
                <Input {...register("current_country")} />
              </div>
              {errors.current_country?.message && (
                <p className="text-red-500 text-sm -mt-4">
                  {errors.current_country.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setEditItem(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
