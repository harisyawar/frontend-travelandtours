import { useState } from "react";
import Image from "next/image";

// Local assets

const TourTabs = () => {
  const countriesData = [
    {
      id: 1,
      name: "Kuala Lumpur ",
      description:
        "Malaysia, country of Southeast Asia, lying just north of the Equator, that is composed of two noncontiguous regions: Peninsular Malaysia and East Malaysia",
      image: "/images/kuala.jpg",
      tours: [
        {
          title: "Central Park Walk",
          image: "https://source.unsplash.com/400x250/?malaysia,park",
          duration: "2 hours",
          price: "$45",
          reviews: "200",
        },
      ],
    },
    {
      id: 2,
      name: "Bali",
      description:
        "Maldives is a tropical paradise with white-sand beaches, crystal-clear waters, and luxury island resorts—perfect for honeymoon and beach vacations.",
      image: "/images/bali.jpg",
      tours: [
        {
          title: "Beach Relaxation Tour",
          image: "https://source.unsplash.com/400x250/?maldives,beach",
          duration: "3 hours",
          price: "$50",
          reviews: "200",
        },
      ],
    },
    {
      id: 3,
      name: "bangkok",
      description:
        "Thailand is a vibrant travel destination famous for tropical beaches, rich culture, street food, luxury resorts, and unforgettable island adventures",
      image: "/images/bangkok.avif",
      tours: [
        {
          title: "Bangkok City Tour",
          image: "/images/bangkok1.webp",
          duration: "2 hours",
          price: "$35",
          reviews: "200",
        },
        {
          title: "Chiang Mai Adventure",
          image: "/images/bangkok2.jpg",
          duration: "4 hours",
          price: "$55",
          reviews: "200",
        },
        {
          title: "Phuket Island Hopping",
          image: "/images/bangkok3.jpg",
          duration: "3 hours",
          price: "$40",
          reviews: "200",
        },
        {
          title: "Ayutthaya Historical Tour",
          image: "/images/bangkok4.jpg",
          duration: "3 hours",
          price: "$40",
          reviews: "200",
        },
      ],
    },
    {
      id: 4,
      name: "singapore",
      description:
        "Singapore is a modern travel destination known for luxury shopping, iconic skyline, clean streets, world-class attractions, and diverse cuisine",
      image: "/images/singapore.webp",
      tours: [],
    },
    {
      id: 5,
      name: "Dubai",
      description:
        "Dubai is a luxury travel destination famous for iconic skyscrapers, desert safaris, world-class shopping, and vibrant nightlife",
      image: "/images/dubai.jpg",
      tours: [
        {
          title: "Desert Safari",
          image: "https://source.unsplash.com/400x250/?dubai,desert",
          duration: "5 hours",
          price: "$70",
          reviews: "200",
        },
      ],
    },
    {
      id: 6,
      name: "Istanbul",
      description:
        "Saudi Arabia is a fast-growing travel destination known for rich Islamic heritage, modern cities, luxury tourism, and desert adventures",
      image: "/images/itanbul.jpg",
      tours: [],
    },
    {
      id: 7,
      name: "langkawi",
      description:
        "Turkey is a top travel destination offering rich history, stunning landscapes, vibrant culture, and a unique blend of Europe and Asia.",
      image: "/images/langkawi.jpg",
      tours: [],
    },

    {
      id: 9,
      name: "Phuket",
      description:
        "Sri Lanka is a beautiful island with rich culture, beaches, and wildlife",
      image: "/images/phuket.jpg",
      tours: [],
    },
  ];

  const [activeCountry, setActiveCountry] = useState(countriesData[2]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-4 py-12">
      {/* <h4 className="font-serif text-[#e9c151] text-center text-xl">
        Top Trending Tour
      </h4> */}
      <h2 className="text-3xl font-bold font-serif text-center">
        Discover Top Travel Destinations
      </h2>
      <p className="mx-auto text-gray-500 my-4 max-w-3xl text-center">
        Discover hand-picked hotels in the world’s most loved cities, offering
        comfort, convenience, and great value for every traveler
      </p>

      {/* Country Selector Buttons */}
      <div className="flex flex-wrap justify-items-start md:justify-center  gap-4 my-10">
        {countriesData.map((country) => (
          <button
            key={country.id}
            onClick={() => setActiveCountry(country)}
            className={`
        px-6 py-2 rounded text-sm font-medium capitalize
        transition-all duration-300
        ${
          activeCountry.id === country.id
            ? "bg-[#3FD0D4] text-white shadow-sm"
            : "bg-[#F6FFFF] text-[#464646]  hover:bg-[#3FD0D4] hover:text-white"
        }
      `}
          >
            {country.name}
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative mb-4">
        {/* Image */}
        <Image
          src={activeCountry.image}
          alt={activeCountry.name}
          width={1200}
          height={600}
          className="w-full h-[300px] md:h-[500px] object-cover rounded-xl"
          priority
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/50 to-transparent"></div>

        {/* Text at bottom-left */}
        <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 text-white">
          <h3 className="text-2xl md:text-4xl font-volkhov mb-2 capitalize font-bold">
            {activeCountry.name}
          </h3>
          <p className=" text-sm md:text-base text-white font-medium max-w-xl">
            {activeCountry.description}
          </p>
        </div>
      </div>

      {/* Tours */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {activeCountry.tours.length > 0 ? (
          activeCountry.tours.map((tour, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
            >
              {/* Image Section */}
              <div className="relative p-3">
                <Image
                  src={tour.image}
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
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="#3FD0D4"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                  </svg>
                  <span>{activeCountry.name}</span>
                </div>

                {/* Title */}
                <h4 className="text-lg font-bold text-[#363636] leading-snug mb-3">
                  {tour.title}
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
