import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CONFIRM-BOOKING] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.id) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    const { sessionId } = await req.json();
    if (!sessionId) throw new Error("Session ID is required");
    logStep("Session ID received", { sessionId });

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Retrieve the session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep("Session retrieved", { status: session.payment_status, metadata: session.metadata });

    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    // Create booking in database
    const { data: booking, error: bookingError } = await supabaseClient
      .from("bookings")
      .insert({
        user_id: user.id,
        package_id: session.metadata!.packageId,
        booking_date: session.metadata!.bookingDate,
        adults: parseInt(session.metadata!.adults),
        children: parseInt(session.metadata!.children),
        infants: parseInt(session.metadata!.infants),
        transfer_option: session.metadata!.transferOption,
        total_price: session.amount_total! / 100, // Convert from fils to AED
        payment_status: "paid",
        stripe_payment_intent_id: session.payment_intent as string,
      })
      .select()
      .single();

    if (bookingError) {
      logStep("ERROR creating booking", { error: bookingError });
      throw new Error(`Failed to create booking: ${bookingError.message}`);
    }

    logStep("Booking created successfully", { bookingId: booking.id });

    // Log notification (admin will see this in edge function logs)
    console.log(`📧 NEW BOOKING NOTIFICATION for ${session.metadata!.adminEmail}`);
    console.log(`Booking ID: ${booking.id}`);
    console.log(`Package: ${session.metadata!.packageId}`);
    console.log(`Date: ${session.metadata!.bookingDate}`);
    console.log(`Guests: ${session.metadata!.adults} adults, ${session.metadata!.children} children, ${session.metadata!.infants} infants`);
    console.log(`Total: ${booking.total_price} AED`);

    return new Response(JSON.stringify({ 
      success: true, 
      booking,
      message: "Booking confirmed successfully" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});