import { useEffect, useState } from "react";
import Image from "next/image";
import { getToursByCity } from "@/Services/TravelApis";
import Link from "next/link";
import { useAtom } from "jotai";
import { searchAtom } from "@/store/atoms";
import { MdOutlineTimer } from "react-icons/md";
/* 1️⃣ Static countries OUTSIDE component */
const initialCountries = [
  {
    id: 1951,
    name: "Kuala Lumpur",
    description:
      "Malaysia, country of Southeast Asia, lying just north of the Equator, that is composed of two noncontiguous regions: Peninsular Malaysia and East Malaysia",
    image: "/images/kuala.jpg",
    tours: [],
  },
  {
    id: 602651,
    name: "Bali",
    description:
      "Maldives is a tropical paradise with white-sand beaches, crystal-clear waters, and luxury island resorts—perfect for honeymoon and beach vacations.",
    image: "/images/bali.jpg",
    tours: [],
  },
  {
    id: 604,
    name: "Bangkok",
    description:
      "Thailand is a vibrant travel destination famous for tropical beaches, rich culture, street food, luxury resorts, and unforgettable island adventures",
    image: "/images/bangkok.avif",
    tours: [],
  },
  {
    id: 3168,
    name: "Singapore",
    description:
      "Singapore is a modern travel destination known for luxury shopping, iconic skyline, clean streets, world-class attractions, and diverse cuisine",
    image: "/images/singapore.webp",
    tours: [],
  },
  {
    id: 6053839,
    name: "Dubai",
    description:
      "Dubai is a luxury travel destination famous for iconic skyscrapers, desert safaris, world-class shopping, and vibrant nightlife",
    image: "/images/dubai.jpg",
    tours: [],
  },
  {
    id: 1639,
    name: "Istanbul",
    description:
      "Saudi Arabia is a fast-growing travel destination known for rich Islamic heritage, modern cities, luxury tourism, and desert adventures",
    image: "/images/itanbul.jpg",
    tours: [],
  },
  {
    id: 6126505,
    name: "Langkawi",
    description:
      "Turkey is a top travel destination offering rich history, stunning landscapes, vibrant culture, and a unique blend of Europe and Asia.",
    image: "/images/langkawi.jpg",
    tours: [],
  },
  {
    id: 6046393,
    name: "Phuket",
    description:
      "Sri Lanka is a beautiful island with rich culture, beaches, and wildlife",
    image: "/images/phuket.jpg",
    tours: [],
  },
];
const TourTabs = () => {
  const [search, setSearch] = useAtom(searchAtom);

  const [countriesData] = useState(initialCountries);
  const [activeCountry, setActiveCountry] = useState(initialCountries[0]);
  const [loadingTours, setLoadingTours] = useState(false);
  const [searchState, setSearchState] = useAtom(searchAtom);
  const adults = Number(search.adults) || 1;
  const children = Number(search.children) || 0;
  console.log(activeCountry, "hlo");
  const totalPersons = adults + children;
  const handleTourClick = (tour, country) => {
    setSearchState({
      ...searchState,
      city_region_id: country.id,
      label: `${country.name}`,
      type: "tour",
    });
  };
  const getTransferRate = (transferRates, totalPersons) => {
    if (!transferRates?.length) return 0;
    const slab = transferRates.find(
      (r) => totalPersons >= r.minPax && totalPersons <= r.maxPax,
    );
    return slab ? slab.rate : 0;
  };
  const fetchToursByCountry = async (country) => {
    try {
      setLoadingTours(true);

      const res = await getToursByCity(country.id);
      const tours = res?.tours || [];

      const topTours = tours
        .sort((a, b) => (b.selectionCount || 0) - (a.selectionCount || 0))
        .slice(0, 4);

      setActiveCountry({
        ...country,
        tours: topTours,
      });
    } catch (error) {
      console.error("Failed to fetch tours", error);
      setActiveCountry({ ...country, tours: [] });
    } finally {
      setLoadingTours(false);
    }
  };

  // ✅ Fetch tours for default country on first render
  useEffect(() => {
    fetchToursByCountry(activeCountry);
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center">
        Discover Top Travel Destinations
      </h2>

      {/* Country Tabs */}
      <div className="flex flex-wrap justify-center gap-4 my-10">
        {countriesData.map((country) => (
          <button
            key={country.id}
            onClick={() => fetchToursByCountry(country)}
            className={`px-6 py-2 rounded text-sm font-medium transition ${
              activeCountry.id === country.id
                ? "bg-[#3FD0D4] text-white"
                : "bg-[#edf7f7] text-gray-700 hover:bg-[#3FD0D4] hover:text-white"
            }`}
          >
            {country.name}
          </button>
        ))}
      </div>

      {/* Hero Image */}
      <div className="relative mb-6">
        <Image
          src={activeCountry.image}
          alt={activeCountry.name}
          width={1200}
          height={500}
          className="w-full h-[400px] object-cover rounded-xl"
        />
        <div className="absolute inset-0 bg-black/40 rounded-xl" />
        <div className="absolute bottom-6 left-6 text-white max-w-xl">
          <h3 className="text-3xl font-bold">{activeCountry.name}</h3>
          <p className="mt-2 text-sm">{activeCountry.description}</p>
        </div>
      </div>
      {/* Tours */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {activeCountry.tours.length > 0 ? (
          activeCountry.tours.map((tour, index) => {
            const adultTicketPrice = Number(tour?.ticketPriceAdult ?? 0);

            const transferRatePerPerson = getTransferRate(
              tour?.transferRates || [],
              totalPersons,
            );

            const grandTotal = adultTicketPrice + transferRatePerPerson;

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
              >
                <Link
                  href={`/tour-details/${tour._id}`}
                  onClick={() => handleTourClick(tour, activeCountry)}
                >
                  <div className="relative p-3">
                    <Image
                      src={`https://northpointtravel.s3.eu-north-1.amazonaws.com/images/${tour.images[0]}`}
                      alt={tour.title}
                      width={400}
                      height={250}
                      className="w-full h-[230px] object-cover rounded-lg"
                    />

                    {/* Price Badge */}
                    <span className="absolute bottom-6 right-6 bg-[#3FD0D4] text-white text-sm font-semibold px-4 py-1 rounded-md">
                      ${grandTotal}/Per person
                    </span>
                  </div>

                  <div className="px-5">
                    <h4 className="text-lg font-bold text-[#363636] leading-snug mb-3 line-clamp-2">
                      {tour.name}
                    </h4>

                    <div
                      className="text-gray-700 text-sm line-clamp-1"
                      dangerouslySetInnerHTML={{ __html: tour.description }}
                    />
                    <div className="flex items-center gap-2 my-4">
                      <MdOutlineTimer className="text-[#3FD0D4] font-bold w-6 h-6" />
                      <p className="text-sm text-gray-500">
                        {tour.duration || tour.timing}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-400">
            No tours available for this country
          </p>
        )}
      </div>
    </div>
  );
};

export default TourTabs;
