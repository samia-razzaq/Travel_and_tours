// Booking Success Page
import { CheckCircle, Home } from "lucide-react";
import { Link } from "react-router-dom";

export function BookingSuccess() {
  return (
    <div className="h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Success Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>

        {/* Text */}
        <h1 className="text-2xl font-semibold">Booking Successful</h1>
        <p className="text-muted-foreground mt-3">
          Your booking has been processed successfully. Thank you!
        </p>

        {/* CTA */}
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-10"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}