import { useEffect, useRef, useState } from "react";
const { getNames } = require("country-list");

export function CountryDropdown({ value, onSelect }) {
  const countries = getNames();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || "");
  const dropdownRef = useRef(null);

  // Filter countries as you type
  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().startsWith(searchTerm.toLowerCase()),
  );

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle typing in the input
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  // Handle selecting a country
  const handleSelect = (country) => {
    setSearchTerm(country); // put selected country in field
    onSelect(country); // pass to parent
    setIsOpen(false); // close dropdown
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <input
        type="text"
        placeholder="Select Nationality"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        className="w-full bg-gray-100 text-gray-800 rounded-md p-2 py-4 focus:outline-none focus:ring-1 focus:ring-[#10E9DD] cursor-pointer transition duration-150"
      />

      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-white rounded-md shadow-lg">
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <li
                key={country}
                onClick={() => handleSelect(country)}
                className="px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer transition"
              >
                {country}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-400">No countries found</li>
          )}
        </ul>
      )}
    </div>
  );
}
