"use client";

import { searchAtom } from "@/store/atoms";
import { useAtom } from "jotai";
import Link from "next/link";
import { Children } from "react";

const getTransferRate = (transferRates, totalPersons) => {
  if (!transferRates?.length) return 0;

  const slab = transferRates.find(
    (r) => totalPersons >= r.minPax && totalPersons <= r.maxPax,
  );

  return slab ? slab.rate : 0;
};

const PriceBox = ({ tour }) => {
  console.log(tour, "data11");
  const [search] = useAtom(searchAtom);
  const [data] = useAtom(searchAtom);
  const type = data?.type;
  console.log(type, "type ");
  const adults = search.adults || 0;
  const children = search.children || 0;

  // per person prices
  const adultPrice = tour.ticketPriceAdult ?? tour.sharedTransferAdult ?? 0;

  const childPrice = tour.ticketPriceChild ?? tour.sharedTransferChild ?? 0;

  // totals
  const adultTotal = adultPrice * adults;
  const childTotal = childPrice * children;

  const totalPersons = adults + children;

  // transfer slab price
  const transferRatePerPerson = getTransferRate(
    tour.transferRates,
    totalPersons,
  );

  const transferTotal = transferRatePerPerson * totalPersons;

  // grand total
  const grandTotal = adultTotal + childTotal + transferTotal;
  const grandTotalFixed = Number(grandTotal.toFixed(2));

  return (
    <div className="w-full max-w-md sticky top-24 self-start bg-white shadow-xl rounded-2xl p-6 space-y-6 border border-gray-100">
      {/* Header */}
      <h4 className="text-lg font-semibold text-gray-800">Booking Summary</h4>

      {/* Info Boxes */}
      <div className="grid grid-cols-2 gap-4">
        {/* Duration */}
        {(tour.duration || tour.timing) && (
          <div className="bg-gray-50 rounded-xl p-4">
            <span className="block text-xs uppercase tracking-wide text-[#10E9DD] font-medium">
              {tour.duration ? "Duration" : "Timing"}
            </span>
            <div className="text-gray-800 font-semibold mt-1">
              {tour.duration || tour.timing}
            </div>
          </div>
        )}

        {/* Guests */}
        <div className="bg-gray-50 rounded-xl p-4">
          <span className="block text-xs uppercase tracking-wide text-[#10E9DD] font-medium">
            Guests
          </span>
          <div className="text-gray-800 font-semibold mt-1">
            {adults} Adults{children > 0 && `, ${children} Children`}
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center text-lg font-bold">
        <span className="text-gray-700 flex-1">Total Price</span>
        <span className="text-[#10E9DD] flex-1 text-right">
          ${grandTotalFixed}
        </span>
      </div>

      <Link
        href={{
          pathname: "/bookingForm",
          query: { id: tour._id, type },
        }}
        className="w-full bg-[#10E9DD] hover:bg-[#0fcfc4] transition text-white py-3 rounded-xl font-semibold text-base shadow-md flex items-center justify-center gap-2"
      >
        Book Now <span>→</span>
      </Link>
    </div>
  );
};

export default PriceBox;
