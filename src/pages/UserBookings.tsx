import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, Eye, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import useBookings from "@/hooks/useBookings";
import { Booking } from "@/types/bookings";
import Footer from "@/components/Footer";

export default function AdminBookings() {
  const { data: bookings = [], isLoading, isError, error } = useBookings();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tourOptionFilter, setTourOptionFilter] = useState<string>("all");

  const getTourType = (option: string) => {
    switch (option) {
      case "P":
        return "Private Transfers";
      case "S":
        return "Shared Transfers";
      case "W":
        return "Without Transfer";
      default:
        return option || "Unknown";
    }
  };

  const getTourBadge = (option: string) => {
    const config: Record<string, { className: string }> = {
      P: { className: "bg-purple-500 hover:bg-purple-600" },
      S: { className: "bg-blue-500 hover:bg-blue-600" },
      W: { className: "bg-gray-500 hover:bg-gray-600" },
    };
    const safeOption = option || "W";
    const badgeConfig = config[safeOption] || config.W;

    return (
      <Badge className={`${badgeConfig.className} text-white`}>
        {getTourType(safeOption)}
      </Badge>
    );
  };

  const getPaymentBadge = (payment: string | null) => {
    if (!payment || payment === null) {
      return (
        <Badge
          variant="secondary"
          className="bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          Pending
        </Badge>
      );
    }

    if (payment.toLowerCase() === "done") {
      return (
        <Badge className="bg-green-500 hover:bg-green-600 text-white">
          Paid
        </Badge>
      );
    }

    return (
      <Badge
        variant="secondary"
        className="bg-yellow-500 hover:bg-yellow-600 text-white"
      >
        Pending
      </Badge>
    );
  };

  // Filter and sort bookings - only search by package_title, sort by booking_date descending
  const filteredBookings = bookings
    .filter((booking) => {
      const matchesSearch = (booking.package_title || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesTourOption =
        tourOptionFilter === "all" ||
        (booking.tour_option || "") === tourOptionFilter;

      return matchesSearch && matchesTourOption;
    })
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  // Stats
  const stats = {
    total: bookings.length,
    private: bookings.filter((b) => b.tour_option === "P").length,
    shared: bookings.filter((b) => b.tour_option === "S").length,
    withoutTransfer: bookings.filter((b) => b.tour_option === "W").length,
  };

  if (isError) {
    return (
      <>
        <Navigation />
        <div className="py-24 max-w-7xl mx-auto px-4">
          <Alert variant="destructive">
            <AlertTitle>Error Loading Bookings</AlertTitle>
            <AlertDescription>
              {error?.message ||
                "Failed to load bookings. Please try again later."}
            </AlertDescription>
          </Alert>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      {/* Header */}
      <section className="pt-32 pb-16 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in text-white">
            <span className="text-white">Booking Managment</span>
          </h1>
          <p className="text-lg text-gray-100 max-w-2xl mx-auto animate-fade-in">
            View all you bookings in one place
          </p>
        </div>
      </section>
      <div className="pt-10 pb-16 max-w-7xl mx-auto px-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {isLoading ? (
            <>
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-12 w-full" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Bookings
                      </p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <CalendarDays className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Private</p>
                      <p className="text-2xl font-bold">{stats.private}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Shared</p>
                      <p className="text-2xl font-bold">{stats.shared}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        No Transfer
                      </p>
                      <p className="text-2xl font-bold">
                        {stats.withoutTransfer}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by package title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Tour Option Filter */}
              <Select
                value={tourOptionFilter}
                onValueChange={setTourOptionFilter}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Tour Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="P">Private Transfers</SelectItem>
                  <SelectItem value="S">Shared Transfers</SelectItem>
                  <SelectItem value="W">Without Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <div className="space-y-4">
          {isLoading ? (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="overflow-hidden rounded-2xl shadow-sm">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <Skeleton className="w-full md:w-48 h-48 md:h-auto" />
                      <div className="flex-1 p-6 space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-6 w-1/4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">
                  {bookings.length === 0
                    ? "No bookings available yet"
                    : "No bookings match your search criteria"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <img
                        src={
                          booking.package_image ||
                          "https://via.placeholder.com/800"
                        }
                        alt={booking.package_title}
                        className="w-full md:w-48 h-48 md:h-auto object-cover"
                      />

                      {/* Content */}
                      <div className="flex-1 p-6 space-y-4">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h2 className="text-lg font-semibold">
                                {booking.package_title}
                              </h2>
                              {getTourBadge(booking.tour_option)}
                              {getPaymentBadge(booking.payment_status)}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>

                        {/* Booking Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {format(
                                new Date(booking.booking_date),
                                "dd MMM yyyy"
                              )}
                            </span>
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {booking.adult_pax} Adult
                              {booking.adult_pax !== 1 ? "s" : ""}
                              {booking.child_pax > 0 &&
                                `, ${booking.child_pax} Child${
                                  booking.child_pax !== 1 ? "ren" : ""
                                }`}
                              {booking.infant_pax > 0 &&
                                `, ${booking.infant_pax} Infant${
                                  booking.infant_pax !== 1 ? "s" : ""
                                }`}
                            </span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex justify-between items-center pt-3 border-t">
                          <div className="flex flex-col gap-1">
                            {booking.discounted_amount <
                              booking.total_amount && (
                              <span className="text-sm text-muted-foreground line-through">
                                AED {booking.total_amount.toFixed(2)}
                              </span>
                            )}
                            <span className="text-xl font-bold text-primary">
                              AED {booking.discounted_amount.toFixed(2)}
                            </span>
                          </div>
                          {booking.discounted_amount < booking.total_amount && (
                            <div className="text-right">
                              <Badge className="bg-green-500 hover:bg-green-600 text-white">
                                Save AED{" "}
                                {(
                                  booking.total_amount -
                                  booking.discounted_amount
                                ).toFixed(2)}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
      <Footer/>

      {/* Booking Details Modal */}
      <Dialog
        open={selectedBooking !== null}
        onOpenChange={(open) => !open && setSelectedBooking(null)}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Reference: {selectedBooking?.booking_reference}
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              {/* Package Info */}
              <div>
                <img
                  src={
                    selectedBooking.package_image ||
                    "https://via.placeholder.com/800"
                  }
                  alt={selectedBooking.package_title}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <h3 className="text-lg font-semibold mb-2">
                  {selectedBooking.package_title}
                </h3>
                <div className="flex gap-2">
                  {getTourBadge(selectedBooking.tour_option)}
                  {getPaymentBadge(selectedBooking.payment_status)}
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-3 border-t pt-4">
                <h4 className="font-semibold">Booking Information</h4>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Booking Date:</span>
                    <span className="font-medium">
                      {format(
                        new Date(selectedBooking.booking_date),
                        "dd MMM yyyy"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Transfer Type:
                    </span>
                    <span className="font-medium">
                      {getTourType(selectedBooking.tour_option)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Passengers:</span>
                    <span className="font-medium">
                      {selectedBooking.adult_pax} Adult
                      {selectedBooking.adult_pax !== 1 ? "s" : ""}
                      {selectedBooking.child_pax > 0 &&
                        `, ${selectedBooking.child_pax} Child${
                          selectedBooking.child_pax !== 1 ? "ren" : ""
                        }`}
                      {selectedBooking.infant_pax > 0 &&
                        `, ${selectedBooking.infant_pax} Infant${
                          selectedBooking.infant_pax !== 1 ? "s" : ""
                        }`}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">Pickup:</span>
                    <span className="font-medium text-right max-w-[300px]">
                      {selectedBooking.pickup_place}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">Drop-off:</span>
                    <span className="font-medium text-right max-w-[300px]">
                      {selectedBooking.dropOff_place}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Country:</span>
                    <span className="font-medium">
                      {selectedBooking.current_country}
                    </span>
                  </div>
                  {selectedBooking.detail && (
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground">
                        Additional Details:
                      </span>
                      <span className="font-medium bg-muted p-3 rounded">
                        {selectedBooking.detail}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Info */}
              <div className="space-y-3 border-t pt-4">
                <h4 className="font-semibold">Payment Summary</h4>
                <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                  {selectedBooking.discounted_amount <
                    selectedBooking.total_amount && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        Original Price:
                      </span>
                      <span className="line-through text-muted-foreground">
                        AED {selectedBooking.total_amount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold">
                      {selectedBooking.discounted_amount <
                      selectedBooking.total_amount
                        ? "Discounted Price:"
                        : "Total Amount:"}
                    </span>
                    <span className="font-bold text-primary">
                      AED {selectedBooking.discounted_amount.toFixed(2)}
                    </span>
                  </div>
                  {selectedBooking.discounted_amount <
                    selectedBooking.total_amount && (
                    <div className="flex justify-between items-center text-sm pt-2 border-t border-border">
                      <span className="text-green-600 font-medium">
                        You Save:
                      </span>
                      <span className="text-green-600 font-bold">
                        AED{" "}
                        {(
                          selectedBooking.total_amount -
                          selectedBooking.discounted_amount
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 border-t pt-4">
                <Button
                  onClick={() => setSelectedBooking(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
