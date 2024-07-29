import { useCallback, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation } from "react-router-dom";
import { supabase } from "../config/supabaseClient";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51PhIG9RplLS2DMsTp1fIAh5DteAoVZ0YSREfNMB3KZDuYxz05lgWCwsJZ2QslWNObnWrdCn8xOlhmSassU1pgxrG00LKEwiKHj",
);
type checkoutState = {
  startTime: Date;
  endTime: string;
};

export default function CheckoutPage() {
  const { state }: { state: checkoutState } = useLocation();
  const { startTime, endTime, duration } = state;

  const fetchClientSecret = useCallback(() => {
    return fetch("http://localhost:54321/functions/v1/checkoutSession", {
      method: "POST",
      body: JSON.stringify({
        priceId: "price_1PhIRkRplLS2DMsTYTcBZRGT",
        startTime: `${startTime?.toISOString()}`,
        endTime: endTime,
      }),
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, [startTime, endTime]);

  const options = { fetchClientSecret };

  return (
    <div>
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
