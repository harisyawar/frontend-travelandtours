import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import SwiperCarousel from "@/component/Swiper/Swiper";
import WhatsIncludedAndPickup from "@/component/DetailsData/DetailsData";
import Itinerary from "@/component/DetailsData/Iteneray";
import Additional from "@/component/DetailsData/Cancellation";
import TravelerPhoto from "@/component/DetailsData/TravelPhoto";
import PriceBox from "@/component/DetailsData/PriceBox";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { getTourById, getToursByCity } from "@/Services/TravelApis";
import Image from "next/image";
import { searchAtom } from "@/store/atoms";
import TourApi from "@/component/DetailsData/TourApi";
import Cancellation from "@/component/DetailsData/Cancellation";

const TourDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  const [tour, setTour] = useState(null);
  const [relatedTours, setRelatedTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchState] = useAtom(searchAtom);
  const city_region_id = searchState.city_region_id;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating))
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      else if (i - rating <= 0.5)
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
    return stars;
  };

  useEffect(() => {
    // Only run when router is ready and we have an id
    if (!router.isReady || !id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // API 1: Single tour
        const tourData = await getTourById(id);
        setTour(tourData);

        // API 2: Related tours (safe ID)
        const cityId = city_region_id?.id; // extract ID from object
        if (cityId) {
          const related = await getToursByCity(cityId); // will now return array
          setRelatedTours(related);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router.isReady, id, city_region_id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!tour) return <div className="text-center py-20">No tour found</div>;

  return (
    <main className="p-4 py-12 max-w-7xl mx-auto px-4 md:px-14  2xl:px-1">
      {/* TITLE + RATING */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center mb-6 gap-4">
        <h1 className="!text-xl md:!text-3xl  font-bold text-gray-800 w-[300px] md:w-[600px]">
          {tour.name}
        </h1>
        <div className="flex items-center justify-start md:justify-end gap-1">
          {renderStars(tour.rating || 4)}
          <span className="ml-2 text-gray-600">{tour.rating || 4}</span>
        </div>
      </div>

      <SwiperCarousel images={tour.images || []} />

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mt-8">
        {/* LEFT CONTENT */}
        <div className="w-full">
          <p className="font-bold text-3xl pb-4">Overview</p>
          <div
            className="text-gray-600 text-base md:text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: tour.overview }}
          />
          <WhatsIncludedAndPickup
            included={tour.included}
            excluded={tour.excluded}
          />
          <Itinerary data={tour.itinerary} />
          <Cancellation data={tour.excluded} />
          <TravelerPhoto photos={tour.images} />

          {/* RELATED TOURS */}
          {relatedTours.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Related Tours</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedTours.map((t) => (
                  <div key={t._id} className="bg-white rounded-lg shadow p-3">
                    <Image
                      src={
                        t.images?.length > 0
                          ? `https://northpointtravel.s3.eu-north-1.amazonaws.com/images/${t.images[0]}`
                          : "/fallback.png"
                      }
                      alt={t.name}
                      className="h-40 w-full object-cover rounded"
                    />
                    <h4 className="font-bold mt-2">{t.name}</h4>
                    <p className="text-gray-600">
                      ${t.ticketPriceAdult}/per person
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT STICKY CARD */}
        <PriceBox tour={tour} />
      </div>
      <TourApi city_region_id={city_region_id} />
    </main>
  );
};

// Disable static generation for dynamic routes
export async function getServerSideProps() {
  return { props: {} };
}

export default TourDetails;
