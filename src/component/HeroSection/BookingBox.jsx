"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { IoLocationSharp } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai"; // add this
import { useAtom } from "jotai";
import { searchAtom } from "@/store/atoms";

const BookingBox = ({ country }) => {
  const [searchState, setSearchState] = useAtom(searchAtom);

  const [activeTab, setActiveTab] = useState("tour");
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [destination, setDestination] = useState(null);

  const [showSelector, setShowSelector] = useState(false);
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  // URL → Jotai → Hero sync
  useEffect(() => {
    if (!searchState) return;
    setActiveTab(searchState.type || "tour");
    setAdultCount(searchState.adults || 1);
    setChildCount(searchState.children || 0);
    if (searchState.city_region_id) {
      setDestination({
        city_region_id: searchState.city_region_id,
        label: searchState.label,
      });
    }
  }, [searchState]);

  // Destinations list
  const destinations = useMemo(() => {
    if (!country?.length) return [];
    return country.flatMap((country) =>
      (country.cities || []).map((city) => ({
        label: `${city.name}, ${country.name}`,
        city_region_id: city.region_id,
      })),
    );
  }, [country]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpen(false);
        setShowSelector(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Destination select handler → dropdown close only
  const handleDestinationSelect = (dest) => {
    setDestination(dest);
    setOpen(false);
  };

  // Search button → save state + navigate
  const handleSearch = () => {
    if (!destination) return;

    setSearchState({
      city_region_id: destination.city_region_id,
      label: destination.label,
      adults: adultCount,
      children: childCount,
      type: activeTab,
    });
  };

  return (
    <div
      ref={boxRef}
      className="block w-[300px] md:w-[380px] bg-white/20 backdrop-blur-lg rounded-xl p-4 md:p-6 text-white border border-white/30"
    >
      <h3 className="text-xl font-semibold mb-3 text-center font-serif">
        Book your Transfer and Tour
      </h3>

      {/* Tabs */}
      <div className="mb-4 flex gap-4 justify-center">
        {["tour", "transfer"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative pb-1 text-sm font-medium ${
              activeTab === tab ? "text-white" : "text-white/60"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {activeTab === tab && (
              <span className="absolute left-0 -bottom-[6px] h-[2px] w-full bg-[#10E9DD]" />
            )}
          </button>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          value={destination?.label || ""}
          onChange={(e) =>
            setDestination({ ...destination, label: e.target.value })
          }
          onFocus={() => setOpen(true)}
          placeholder="Select Destination"
          className="w-full bg-transparent border border-white/40 px-4 py-3 rounded-md text-white placeholder-white outline-none pr-10"
        />

        {/* ✖ Clear button */}
        {destination?.label && (
          <button
            onClick={() => setDestination(null)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-lg"
          >
            <AiOutlineClose />
          </button>
        )}

        {open && (
          <div className="absolute top-full left-0 w-full bg-white text-black rounded-md mt-1 shadow-lg z-50 max-h-60 overflow-y-auto">
            {destinations
              .filter((d) =>
                d.label
                  .toLowerCase()
                  .includes((destination?.label || "").toLowerCase()),
              )
              .map((dest, i) => (
                <div
                  key={i}
                  onClick={() => handleDestinationSelect(dest)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  <IoLocationSharp className="text-[#10E9DD]" />
                  {dest.label}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Adults / Children */}
      <div className="relative mt-4">
        <button
          onClick={() => setShowSelector(!showSelector)}
          className="w-full border border-white/40 px-4 py-3 rounded-md flex justify-between"
        >
          Adults: {adultCount} • Children: {childCount}
          <span>{showSelector ? "▲" : "▼"}</span>
        </button>

        {showSelector && (
          <div className="absolute top-full left-0 w-full bg-white text-black rounded-md mt-2 p-4 shadow-lg z-50">
            <div className="flex justify-between mb-3">
              <span>Adult</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
                  className="w-6 h-6 bg-gray-200 rounded-full"
                >
                  -
                </button>
                <span>{adultCount}</span>
                <button
                  onClick={() => setAdultCount(adultCount + 1)}
                  className="w-6 h-6 bg-gray-200 rounded-full"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex justify-between mb-3">
              <span>Child</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setChildCount(Math.max(0, childCount - 1))}
                  className="w-6 h-6 bg-gray-200 rounded-full"
                >
                  -
                </button>
                <span>{childCount}</span>
                <button
                  onClick={() => setChildCount(childCount + 1)}
                  className="w-6 h-6 bg-gray-200 rounded-full"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowSelector(false)}
              className="w-full bg-[#10E9DD] py-2 rounded-md mt-2"
            >
              Done
            </button>
          </div>
        )}
      </div>

      {/* Search */}
      <Link
        href={{
          pathname: "/Search",
          query: {
            city_region_id: destination?.city_region_id,
            label: destination?.label,
            adults: adultCount,
            children: childCount,
            type: activeTab,
          },
        }}
        onClick={handleSearch} 
        className={`block text-center bg-[#10E9DD] py-3 rounded-md mt-4 text-black font-medium ${
          !destination ? "opacity-50 pointer-events-none" : ""
        }`}
        prefetch={true}
      >
        Search →
      </Link>
    </div>
  );
};

export default BookingBox;
