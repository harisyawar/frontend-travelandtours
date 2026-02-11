import { useState } from "react";
import Image from "next/image";
import { getToursByCity } from "@/Services/TravelApis";

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
  /* 2️⃣ States */
  const [countriesData] = useState(initialCountries);
  const [activeCountry, setActiveCountry] = useState(initialCountries[0]);
  const [loadingTours, setLoadingTours] = useState(false);

  /* 3️⃣ API call on button click */
  const fetchToursByCountry = async (country) => {
    try {
      setLoadingTours(true);

      const res = await getToursByCity(country.id);
      console.log(res, "tabs");
      const tours = res?.tours || []; // correct array
      console.log(tours, "tabs");
      // Sort by selectionCount and pick top 4
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
        {loadingTours ? (
          <p className="col-span-full text-center">Loading tours...</p>
        ) : activeCountry.tours.length > 0 ? (
          activeCountry.tours.map((tour, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
            >
              {/* Image Section */}
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
                  {tour.price}/day
                </span>
              </div>

              {/* Content */}
              <div className="px-5 pb-5">
                {/* Location */}

                {/* Title */}
                <h4 className="text-lg font-bold text-[#363636] leading-snug mb-3">
                  {tour.name}
                </h4>

                {/* Meta Info */}
                <div className="flex items-center gap-5 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <svg
                      width="24"
                      height="21"
                      viewBox="0 0 24 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.75031 3.3463C7.75031 2.99978 7.41452 2.71887 7.00031 2.71887C6.58609 2.71887 6.25031 2.99978 6.25031 3.3463V4.86587C4.75723 5.04245 3.57768 6.03039 3.378 7.29059L3.29145 7.83683C3.27678 7.92944 3.26275 8.0221 3.24936 8.11481C3.21384 8.36074 3.44545 8.57486 3.74155 8.57486H20.259C20.5551 8.57486 20.7867 8.36074 20.7512 8.11481C20.7378 8.0221 20.7238 7.92944 20.7091 7.83683L20.6225 7.29059C20.4229 6.03041 19.2433 5.04248 17.7503 4.86587V3.3463C17.7503 2.99978 17.4145 2.71887 17.0003 2.71887C16.5861 2.71887 16.2503 2.99978 16.2503 3.3463V4.74139C13.4226 4.53072 10.578 4.53072 7.75031 4.74139V3.3463Z"
                        fill="#3FD0D4"
                      />
                      <path
                        d="M20.9449 10.2275C20.9361 10.0047 20.716 9.82971 20.4494 9.82971H3.55117C3.2846 9.82971 3.06443 10.0047 3.05568 10.2275C2.99628 11.7398 3.10608 13.2551 3.38482 14.7536C3.59583 15.8881 4.69749 16.7594 6.06323 16.8721L7.25623 16.9705C10.4113 17.2308 13.5893 17.2308 16.7443 16.9705L17.9373 16.8721C19.3031 16.7594 20.4047 15.8881 20.6157 14.7536C20.8945 13.2551 21.0043 11.7398 20.9449 10.2275Z"
                        fill="#3FD0D4"
                      />
                    </svg>
                    <span>April 12, 2023</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      width="24"
                      height="21"
                      viewBox="0 0 24 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M3.5 10.0388C3.5 6.11161 7.30558 2.92798 12 2.92798C16.6944 2.92798 20.5 6.11161 20.5 10.0388C20.5 13.966 16.6944 17.1497 12 17.1497C7.30558 17.1497 3.5 13.966 3.5 10.0388ZM12.75 5.85597C12.75 5.50945 12.4142 5.22854 12 5.22854C11.5858 5.22854 11.25 5.50945 11.25 5.85597V10.0388C11.25 10.2552 11.3832 10.4562 11.6025 10.5709L14.6025 12.1394C14.9538 12.3231 15.4165 12.2338 15.636 11.9399C15.8555 11.6461 15.7488 11.259 15.3975 11.0753L12.75 9.69107V5.85597Z"
                        fill="#3FD0D4"
                      />
                    </svg>
                    <span>{tour.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
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
