import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getTourById } from "@/Services/TravelApis";
import { useAtom } from "jotai";
import { searchAtom, userAtom } from "@/store/atoms";

import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { paymentAPI } from "@/Services/api";
import {
  createBooking,
  createTransferBooking,
  getSingleTransfersbyid,
} from "@/Services/TourBooking";
import { CountryDropdown } from "@/component/Countrydropdown/Countrydropdown";
import Image from "next/image";
import { message } from "antd";

// Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

// ---------- Helpers ----------
const getTransferRate = (transferRates, totalPersons) => {
  if (!transferRates?.length) return 0;
  const slab = transferRates.find(
    (r) => totalPersons >= r.minPax && totalPersons <= r.maxPax,
  );
  return slab ? slab.rate : 0;
};

// ---------- Stripe Checkout Form ----------
const CheckoutForm = ({ intentId, bookingData, onSuccess, type }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      // 🔹 Step 1: Check if payment already succeeded
      const statusRes = await paymentAPI.checkPaymentStatus(intentId);

      if (statusRes.data.success && statusRes.data.status === "succeeded") {
        // ✅ Already paid, call correct API
        if (type === "tour") {
          await createBooking(bookingData);
        } else {
          await createTransferBooking(bookingData);
        }
        onSuccess();
        return;
      }

      // 🔹 Step 2: Confirm payment if not already succeeded
      const { error } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        message.error(error.message);
        return;
      }

      // 🔹 Step 3: Check status again after confirmation
      const finalStatus = await paymentAPI.checkPaymentStatus(intentId);

      if (finalStatus.data.success && finalStatus.data.status === "succeeded") {
        if (type === "tour") {
          await createBooking(bookingData);
        } else {
          await createTransferBooking(bookingData);
        }
        onSuccess();
      } else {
        message.error(
          "Payment not confirmed yet. Please wait a moment and try again.",
        );
      }
    } catch (err) {
      console.error(err);
      message.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        disabled={!stripe || loading}
        className="w-full bg-[#10E9DD] text-white py-3 rounded-xl font-semibold mt-4"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

// ---------- Booking Form Component ----------
export default function BookingForm() {
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const router = useRouter();
  const { id, type } = router.query;
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search] = useAtom(searchAtom);
  const [user] = useAtom(userAtom);
  const userId = user?.id;

  const adults = search.adults || 0;
  const children = search.children || 0;
  const totalPersons = adults + children;

  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  console.log(tour, "tourandtransfer");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    nationality: "",
    dates: "", // for tour
    dateTime: "", // for transfer (datetime)
    pickupLocation: "",
    dropupLocation: "", // for transfer
    flightNum: "", // for transfer
  });

  // Fetch tour

  useEffect(() => {
    if (!id || !type) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data =
          type === "tour"
            ? await getTourById(id)
            : await getSingleTransfersbyid(id);
        setTour(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, type]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ---------- Book Now Handler ----------
  const handleBookNow = async () => {
    if (!userId) {
      message.error("Please login first to continue booking");
      return;
    }

    if (!tour || !tour._id) {
      message.error("Tour/Transfer data is not loaded yet");
      return;
    }

    if (grandTotalFixed <= 0) {
      message.error("Invalid number of   amount");
      return;
    }

    const metadata = { tourId: tour._id, adults, children, userId };

    try {
      setLoading(true);

      const res = await paymentAPI.createPaymentIntent({
        amount: grandTotalFixed,
        currency: "usd",
        metadata,
      });

      if (!res?.data?.clientSecret || !res?.data?.paymentIntentId) {
        message.error("Payment initiation failed");
        return;
      }

      setClientSecret(res.data.clientSecret);
      setPaymentIntentId(res.data.paymentIntentId);
      setShowPayment(true);
    } catch (err) {
      console.error("Payment error:", err);
      if (err?.response?.data?.message) {
        message.error(err.response.data.message); // show backend error
      } else if (err?.message) {
        message.error(err.message);
      } else {
        message.error("Something went wrong during payment");
      }
    } finally {
      setLoading(false);
    }
  };
  let grandTotalFixed = 0; // default value

  if (type === "tour") {
    const adultPrice = tour?.ticketPriceAdult ?? 0;
    const childPrice = tour?.ticketPriceChild ?? 0;

    const adultTotal = adultPrice * adults;
    const childTotal = childPrice * children;

    const transferRatePerPerson = getTransferRate(
      tour?.transferRates,
      totalPersons,
    );
    const transferTotal = transferRatePerPerson * totalPersons;

    const grandTotal = adultTotal + childTotal + transferTotal;
    grandTotalFixed = Number(grandTotal.toFixed(2));
  }

  if (type === "transfer") {
    console.log(totalPersons);
    let grandTotal = 0;

    if (tour.sharedTransferAdult > 0) {
      grandTotal =
        tour?.sharedTransferAdult * adults +
        tour?.sharedTransferChild * children;
      console.log(grandTotal, "total");
    } else if (tour.transferRates?.length > 0) {
      const transferRatePerPerson = getTransferRate(
        tour?.transferRates,
        totalPersons,
      );
      grandTotal = transferRatePerPerson;
    }

    grandTotalFixed = Number(grandTotal.toFixed(2));
  }
  console.log("Tour Type:", type);
  console.log("Adults:", adults, "Children:", children, "Total:", totalPersons);
  console.log("Tour Prices:", tour?.ticketPriceAdult, tour?.ticketPriceChild);
  console.log("Transfer Rates:", tour?.transferRates);
  const bookingPayload = {
    userId,
    name: formData.name,
    phone: formData.phone,
    email: formData.email,
    nationality: formData.nationality,
    guests: { adults, children },
    price: grandTotalFixed,
    pickupLocation: formData.pickupLocation,

    // Extra fields for transfer
    ...(type === "transfer" && {
      dropupLocation: formData.dropupLocation,
      dateTime: new Date(formData.dateTime),
      flightNum: formData.flightNum,
      transferId: tour?._id,
      transferName: tour?.name,
    }),

    // Extra fields for tour
    ...(type === "tour" && {
      date: new Date(formData.dates),
      duration: tour?.duration,
      tourId: tour?._id,
      tourName: tour?.name,
    }),
  };

  const inputClass =
    "bg-gray-100 text-gray-800 border-0 rounded-md p-2 py-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-[#10E9DD] transition duration-150";

  if (loading) return <div className="py-20 text-center">Loading...</div>;
  const handleNationalitySelect = (country) => {
    setFormData((prev) => ({
      ...prev,
      nationality: country,
    }));
  };

  return (
    <div className="max-w-6xl mx-auto my-16 px-4">
      <h2 className="text-2xl font-bold text-[#10E9DD] text-center mb-4 font-serif">
        Book Your Tour
      </h2>
      <p className="mx-auto my-4 text-center max-w-2xl">
        Safe, fast, and simple transfer and tour reservations with secure
        payment options. Travel smarter with tourandtransfer.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Tour Card */}
        {tour && (
          <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-col items-start self-start">
            <Image
              src={
                Array.isArray(tour.images) && tour.images.length > 0
                  ? `https://northpointtravel.s3.eu-north-1.amazonaws.com/images/${tour.images[0]}`
                  : typeof tour.images === "string" && tour.images
                    ? `https://northpointtravel.s3.eu-north-1.amazonaws.com/images/${tour.images}`
                    : "/fallback.png" // fallback agar dono nahi mile
              }
              alt={tour.name}
              width={500}
              height={250}
              className="object-cover w-full h-48 rounded-xl mb-4"
            />

            <h3 className="text-lg font-bold mb-2">{tour.name}</h3>
            <div className="flex justify-between gap-3 mb-3 w-full">
              <div className="bg-gray-50 rounded-xl p-4 flex-1">
                <span className="text-xs uppercase text-[#10E9DD] font-medium">
                  {tour.duration ? "Duration" : "Timing"}
                </span>
                <span className="text-gray-800 font-semibold mt-1 block">
                  {tour.duration || tour.timing}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 flex-1">
                <span className="text-xs uppercase text-[#10E9DD] font-medium">
                  Adults / Children
                </span>
                <span className="text-gray-800 font-semibold mt-1 block">
                  {adults} / {children}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-lg font-bold w-full">
              <span className="text-gray-700 ">Total Price</span>
              <span className="text-[#10E9DD]  text-right">
                ${grandTotalFixed}
              </span>
            </div>
          </div>
        )}

        {bookingSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
            <div className="bg-white text-black rounded-2xl p-8 text-center shadow-xl max-w-md mx-4 ">
              <h2 className="text-2xl font-extrabold mb-2 text-[#ffda32] font-serif">
                BOOKING SUCCESSFUL
              </h2>

              <p className="text-lg opacity-90 mb-4">
                Your payment has been received and your booking is confirmed.
              </p>

              <div className="text-sm opacity-80 mb-4">
                Thank you for choosing us. Our team will contact you shortly.
              </div>
              <button
                onClick={() => {
                  setBookingSuccess(false);
                  router.push("/");
                }}
                className="mt-4 bg-[#10E9DD] hover:bg-[#0fcfc4] text-white py-2 px-6 rounded-full font-semibold shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {!showPayment ? (
          <form className="space-y-4 bg-white p-4 rounded-xl shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className={inputClass}
                required
              />
              <CountryDropdown
                value={formData.nationality}
                onSelect={handleNationalitySelect}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Date / DateTime */}
              {type === "transfer" ? (
                <input
                  type="datetime-local"
                  name="dateTime"
                  value={formData.dateTime || ""}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              ) : (
                <input
                  type="date"
                  name="dates"
                  value={formData.dates}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              )}

              {/* Pickup Location */}
              <input
                type="text"
                name="pickupLocation"
                placeholder="Pickup Location"
                value={formData.pickupLocation}
                onChange={handleChange}
                className={inputClass}
                required
              />

              {/* Dropup Location only for transfer */}
              {type === "transfer" && (
                <input
                  type="text"
                  name="dropupLocation"
                  placeholder="Dropup Location"
                  value={formData.dropupLocation || ""}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              )}

              {/* Flight Number only for transfer */}
              {type === "transfer" && (
                <>
                  <p className="text-black font-semibold">
                    For Airport Transfer Please Provide Detail
                  </p>
                  <input
                    type="text"
                    name="flightNum"
                    placeholder="Flight Number"
                    value={formData.flightNum || ""}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </>
              )}
            </div>

            <button
              type="button"
              onClick={handleBookNow}
              className="w-full bg-[#10E9DD] hover:bg-[#0fcfc4] text-white py-3 rounded-md font-semibold shadow-md"
              disabled={loading} // ← Disable while loading
            >
              {loading ? "Processing..." : "Proceed to Payment"}
            </button>
          </form>
        ) : (
          clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm
                intentId={paymentIntentId}
                bookingData={bookingPayload}
                onSuccess={() => setBookingSuccess(true)}
                type={type}
              />
            </Elements>
          )
        )}
      </div>
    </div>
  );
}
// Disable static generation for pages using useRouter
export async function getServerSideProps() {
  return { props: {} };
}
