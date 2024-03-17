import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./CheckouForm";
import "./stripepayment.css";
import { useSelector } from "react-redux";
import { selectCurrentOrder } from "../order/orderSlice";


// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe("pk_test_51ObGOrSCwO4pu9yRFPr1HI9HWBkpu4DINSXume7V1beWjI4ssWwdZwd3dP4c9lgRt6MdkTuBSaMq4pjfyGmdt19900PupPLMXg");

export default function StripePayment() {
  const [clientSecret, setClientSecret] = useState("");
 
  const currentOrder=useSelector(selectCurrentOrder)
  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    
    fetch("/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentOrder),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="stripepayment">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )
      }
     
    </div>
  );
}