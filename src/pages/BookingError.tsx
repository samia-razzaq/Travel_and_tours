// Booking Error Page
import { XCircle, ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";

export function BookingError() {
  return (
    <div className="h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-10 w-10 text-red-500" />
        </div>

        {/* Text */}
        <h1 className="text-2xl font-semibold">Booking Failed</h1>
        <p className="text-muted-foreground mt-3">
          Something went wrong while processing your booking. Please try again
          or check your details.
        </p>

        {/* CTA */}
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/cart"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-10"
          >
            Retry
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-10"
          >
            Continue to Home
          </Link>
        </div>
      </div>
    </div>
  );
}