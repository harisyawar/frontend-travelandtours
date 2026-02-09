import { useEffect, useRef, useState } from "react";

const { getNames } = require("country-list");

export function CountryDropdown({ value, onSelect }) {
  const countries = getNames();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-100 text-gray-800 rounded-md p-2 py-4 flex justify-between items-center cursor-pointer focus:ring-1 focus:ring-[#10E9DD] transition duration-150"
      >
        <span>{value || "Select Nationality"}</span>
        <svg
          className={`w-4 h-4 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-white rounded-md shadow-lg">
          {countries.map((country) => (
            <li
              key={country}
              onClick={() => {
                onSelect(country);
                setIsOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer transition"
            >
              {country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
