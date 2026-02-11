import { searchAtom, userAtom } from "@/store/atoms";
import { message } from "antd";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import { Children } from "react";
import { useState, useRef, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";

const getTransferRate = (transferRates, totalPersons) => {
  if (!transferRates?.length) return 0;

  const slab = transferRates.find(
    (r) => totalPersons >= r.minPax && totalPersons <= r.maxPax,
  );

  return slab ? slab.rate : 0;
};

const PriceBox = ({ tour }) => {
  console.log(tour, "data1");

  const [data] = useAtom(searchAtom);
  const [user] = useAtom(userAtom);
  const router = useRouter();
  const type = data?.type;
  console.log(type, "typein price ");
  const [search, setSearch] = useAtom(searchAtom);
  const [showSelector, setShowSelector] = useState(false);

  const adults = Number(search.adults) || 1;
  const children = Number(search.children) || 0;

  const totalPersons = adults + children;
  console.log(totalPersons, "hii");
  const updateAdults = (value) => {
    setSearch({
      ...search,
      adults: Math.max(1, value),
    });
  };

  const updateChildren = (value) => {
    setSearch({
      ...search,
      children: Math.max(0, value),
    });
  };

  const handleBookNow = () => {
    if (!user) {
      message.error("Please login first to book!");
      localStorage.setItem(
        "redirectAfterLogin",
        `/bookingForm?id=${tour._id}&type=${type}`,
      );
      router.push("/Login");
      return;
    }

    router.push({
      pathname: "/bookingForm",
      query: { id: tour._id, type },
    });
  };

  let grandTotalFixed = 0; // default value

  if (type === "tour") {
    const adultPrice = tour.ticketPriceAdult ?? 0;
    const childPrice = tour.ticketPriceChild ?? 0;

    const adultTotal = adultPrice * adults;
    const childTotal = childPrice * children;

    const transferRatePerPerson = getTransferRate(
      tour.transferRates,
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
        tour.sharedTransferAdult * adults + tour.sharedTransferChild * children;
      console.log(grandTotal, "total");
    } else if (tour.transferRates?.length > 0) {
      const transferRatePerPerson = getTransferRate(
        tour.transferRates,
        totalPersons,
      );
      grandTotal = transferRatePerPerson;
    }

    grandTotalFixed = Number(grandTotal.toFixed(2));
  }
  console.log("Tour Type:", type);
  console.log("Adults:", adults, "Children:", children, "Total:", totalPersons);
  console.log("Tour Prices:", tour.ticketPriceAdult, tour.ticketPriceChild);
  console.log("Transfer Rates:", tour.transferRates);

  return (
    <div className="w-full max-w-md sticky top-24 self-start bg-white shadow-xl rounded-2xl p-6 space-y-6 border border-gray-100">
      {/* Header */}
      <h4 className="text-lg font-semibold text-gray-800 font-serif">
        Booking Summary
      </h4>

      {/* Info Boxes */}
      <div className="grid grid-cols-2 gap-3">
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
        {/* Guests */}
        <div className="relative">
          <div
            onClick={() => setShowSelector(!showSelector)}
            className="bg-gray-50 rounded-xl p-4 cursor-pointer flex items-center justify-between"
          >
            <div>
              <span className="block text-xs uppercase tracking-wide text-[#10E9DD] font-medium">
                Guests
              </span>
              <div className="text-gray-800 font-semibold mt-1">
                {adults} Adults{children > 0 && `, ${children} Childs`}
              </div>
            </div>

            <FaRegEdit className="text-[red] text-2xl" />
          </div>

          {showSelector && (
            <div className="absolute top-full left-0 w-full bg-white rounded-xl mt-2 p-4 shadow-xl z-50">
              {/* Adults */}
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium">Adults</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateAdults(adults - 1)}
                    className="w-7 h-7 bg-gray-200 rounded-full"
                  >
                    −
                  </button>
                  <span>{adults}</span>
                  <button
                    onClick={() => updateAdults(adults + 1)}
                    className="w-7 h-7 bg-gray-200 rounded-full"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium">Children</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateChildren(children - 1)}
                    className="w-7 h-7 bg-gray-200 rounded-full"
                  >
                    −
                  </button>
                  <span>{children}</span>
                  <button
                    onClick={() => updateChildren(children + 1)}
                    className="w-7 h-7 bg-gray-200 rounded-full"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowSelector(false)}
                className="w-full bg-[#10E9DD] text-white py-2 rounded-lg mt-2"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center text-lg font-bold">
        <span className="text-gray-700 flex-1">Total Price</span>
        <span className="text-[#10E9DD] flex-1 text-right">
          ${grandTotalFixed}
        </span>
      </div>

      <button
        onClick={handleBookNow}
        className="w-full bg-[#ffda32] hover:bg-[#f3cb1a] transition text-white py-3 rounded-xl font-semibold text-base shadow-md flex items-center justify-center gap-2"
      >
        Book Now <span>→</span>
      </button>
    </div>
  );
};

export default PriceBox;
