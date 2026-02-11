import HeroSection from "@/component/HeroSection/HeroSection";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import Pagination from "@/component/Pagination/Pagination";
import Link from "next/link";
import { useRouter } from "next/router";
import { getToursByCity } from "@/Services/TravelApis";
import CardDesign from "@/component/carddesign/CardDesign";
import { getTransfersByCity } from "@/Services/TourBooking";

export default function SearchPage({ country }) {
  const [search, setSearch] = useState("");
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile toggle
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const city_region_id = router.query.city_region_id;
  const adult = router.query.adult;
  const child = router.query.child;

  const [priceRange, setPriceRange] = useState(500);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [selectedReviews, setSelectedReviews] = useState([]);
  console.log(tours, "tour");
  const type = searchParams.get("type");
  const hasTour = tours && tours.length > 0;

  useEffect(() => {
    if (!city_region_id || !type) return;

    const fetchData = async () => {
      try {
        let res, itemsWithType;

        if (type === "tour") {
          res = await getToursByCity(city_region_id);
          itemsWithType = (res.tours || []).map((t) => ({
            ...t,
            type: "tour",
          }));
        } else if (type === "transfer") {
          res = await getTransfersByCity(city_region_id);
          itemsWithType = (res.transfers || []).map((t) => ({
            ...t,
            type: "transfer",
          }));
        }

        setTours(itemsWithType);
        setFilteredTours(itemsWithType);
      } catch (error) {
        console.error(error);
        setTours([]);
        setFilteredTours([]);
      }
    };

    fetchData();
  }, [city_region_id, type]);

  // Search + filter
  const handleSearch = () => {
    let temp = [...tours];

    // Search by title
    if (search) {
      temp = temp.filter((tour) =>
        tour.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Price filter
    temp = temp.filter((tour) => tour.ticketPriceAdult <= priceRange);

    // Categories filter
    if (selectedCategories.length > 0) {
      temp = temp.filter((tour) => selectedCategories.includes(tour.category));
    }

    // Destinations filter
    if (selectedDestinations.length > 0) {
      temp = temp.filter((tour) =>
        selectedDestinations.includes(tour.cityName),
      );
    }

    // Reviews filter
    if (selectedReviews.length > 0) {
      temp = temp.filter((tour) =>
        selectedReviews.includes(Math.floor(tour.rating)),
      );
    }

    setFilteredTours(temp);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredTours.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTours = filteredTours.slice(startIndex, endIndex);

  return (
    <>
      <HeroSection country={country} />

      <div className="flex flex-col lg:flex-row px-4 xl:px-16 py-8">
        {/* Mobile Filter Button */}
        <div className="flex lg:hidden justify-center mb-4">
          <button
            className="flex items-center gap-2 text-[#3FD0D4] px-4 py-2 rounded-md"
            onClick={() => setSidebarOpen(true)}
          >
            <FaFilter /> Filter
          </button>
        </div>

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full max-h-screen w-3/4 max-w-xs bg-white z-50 p-6 space-y-6 transform transition-transform overflow-hidden duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } overflow-y-auto lg:overflow-y-visible lg:translate-x-0 lg:relative lg:w-1/4 lg:block`}
        >
          {/* Close Button */}
          <div className="lg:hidden flex justify-end mb-4">
            <button onClick={() => setSidebarOpen(false)}>
              <FaTimes size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="bg-[#f7f8fa] px-4 py-4 rounded-md">
            <p className="text-black font-bold pb-2">Search</p>
            <div className="bg-white flex items-center rounded-xl overflow-hidden">
              <input
                type="text"
                placeholder="Type anything..."
                className="flex-1  py-3 outline-none text-gray-800"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                onClick={handleSearch}
                className="pr-3 py-3 text-black transition"
              >
                <FaSearch />
              </button>
            </div>
          </div>

          {/* Price Filter */}
          <div className="bg-[#f7f8fa] p-4 rounded-md">
            <h4 className="font-bold text-black mb-2">Filter By Price</h4>
            <input
              type="range"
              min="0"
              max="500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <p>$0</p>
              <p>${priceRange}</p>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-[#f7f8fa] p-4 rounded-md">
            <h4 className="font-bold text-black mb-2">Categories</h4>
            <div className="flex flex-col gap-1 text-gray-700 text-sm">
              {["Adventure", "Beach", "City Tours", "Food", "Hiking"].map(
                (cat) => (
                  <label key={cat} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={cat}
                      checked={selectedCategories.includes(cat)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSelectedCategories((prev) =>
                          checked
                            ? [...prev, cat]
                            : prev.filter((c) => c !== cat),
                        );
                      }}
                    />
                    {cat}
                  </label>
                ),
              )}
            </div>
          </div>

          {/* Destinations */}
          <div className="bg-[#f7f8fa] p-4 rounded-md">
            <h4 className="font-bold mb-2">Destinations</h4>
            <div className="flex flex-col gap-1 text-gray-700 text-sm">
              {["Africa", "Asia", "Europe", "America"].map((dest) => (
                <label key={dest} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={dest}
                    checked={selectedDestinations.includes(dest)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSelectedDestinations((prev) =>
                        checked
                          ? [...prev, dest]
                          : prev.filter((d) => d !== dest),
                      );
                    }}
                  />
                  {dest}
                </label>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-[#f7f8fa] p-4 rounded-md">
            <h4 className="font-bold text-black mb-2">Reviews</h4>
            <div className="flex flex-col gap-1 text-gray-700 text-sm">
              {[5, 4, 3, 2, 1].map((r) => (
                <label key={r} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={r}
                    checked={selectedReviews.includes(r)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSelectedReviews((prev) =>
                        checked
                          ? [...prev, r]
                          : prev.filter((rev) => rev !== r),
                      );
                    }}
                  />
                  {r} Stars & Up
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="w-full bg-[#3FD0D4] text-black py-2 rounded-md mt-2 font-medium"
          >
            Apply Filters
          </button>
        </aside>

        <CardDesign
          tours={filteredTours}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}
const API_URL = "https://northpointtravel.com/api/v1/country";
export async function getStaticProps() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      throw new Error("Failed to fetch tours");
    }
    const data = await res.json();

    return {
      props: {
        country: data, // pass data as props
      },
      revalidate: 60, // ISR: rebuild page at most every 60 seconds
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        country: [], // fallback if fetch fails
      },
    };
  }
}
