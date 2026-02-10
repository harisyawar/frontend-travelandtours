import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { getSingleTransfersbyid } from "@/Services/TourBooking";
import SwiperCarousel from "@/component/Swiper/Swiper";
import WhatsIncludedAndPickup from "@/component/DetailsData/DetailsData";
import Itinerary from "@/component/DetailsData/Iteneray";

import TravelerPhoto from "@/component/DetailsData/TravelPhoto";
import PriceBox from "@/component/DetailsData/PriceBox";
import TourApi from "@/component/DetailsData/TourApi";
import AdditionalInfo from "@/component/DetailsData/AdditionalInfo";
import PopularTransfer from "@/component/DetailsData/PopularTransfer";
import { searchAtom } from "@/store/atoms";
import { useAtom } from "jotai";

export default function TransferDetailPage() {
  const [searchState] = useAtom(searchAtom);
  const city_region_id = searchState.city_region_id;
  const router = useRouter();
  const { id } = router.query;

  const [transfer, setTransfer] = useState(null);
  
  useEffect(() => {
    // Only run when router is ready and we have an id
    if (!router.isReady || !id) return;

    const fetchTransfer = async () => {
      try {
        const res = await getSingleTransfersbyid(id);
        setTransfer(res);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTransfer();
  }, [router.isReady, id]);

  if (!transfer) return <p>Loading...</p>;

  // ⭐ simple star renderer
  const renderStars = (rating) => {
    return Array.from({ length: rating }).map((_, i) => (
      <span key={i}>⭐</span>
    ));
  };

  return (
    <main className="p-4 py-12 max-w-7xl mx-auto">
      {/* TITLE + RATING */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          {transfer.name}
        </h1>
        <div className="flex items-center gap-1">
          {renderStars(transfer.rating || 4)}
          <span className="ml-2 text-gray-600">{transfer.rating || 4}</span>
        </div>
      </div>

      <SwiperCarousel images={transfer.images || []} />

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        {/* LEFT CONTENT */}
        <div className="w-full">
          <p className="font-bold text-3xl pb-4">Overview</p>

          <div
            className="text-gray-600 text-base md:text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: transfer.description }}
          />

          <WhatsIncludedAndPickup
            included={transfer.included}
            excluded={transfer.excluded}
          />

          <Itinerary data={transfer.itinerary} />

          <AdditionalInfo info={transfer.additionalInfo} />

          <TravelerPhoto photos={transfer.images} />

          {/* RELATED (SAME TRANSFER AS DEMO) */}
        </div>

        {/* RIGHT STICKY CARD */}
        <PriceBox tour={transfer} />
      </div>
      <PopularTransfer city_region_id={city_region_id} />
      {/* <TourApi city_region_id={transfer.city_region_id} /> */}
    </main>
  );
}
