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
    <main className="p-4 py-12 max-w-7xl mx-auto px-4 md:px-14  2xl:px-1">
      {/* TITLE + RATING */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center mb-6 gap-4">
        <h1 className="!text-xl md:!text-3xl  font-bold text-gray-800 w-[330px] md:w-[500px] lg:w-[600px] 2xl:w-[800px]">
          {transfer.name}
        </h1>
        <div className="flex items-center justify-start md:justify-end gap-1">
          {renderStars(transfer.rating || 4)}
        </div>
      </div>

      <SwiperCarousel images={transfer.images || []} />

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        {/* LEFT CONTENT */}
        <div className="w-full lg:w-[60%]">
          <p className="font-bold text-3xl pb-4">Overview</p>

          <div
            className="text-gray-600 text-base md:text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: transfer.description }}
          />
          <div className="block lg:hidden my-6">
            <PriceBox tour={transfer} />
          </div>
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
        <div className="hidden lg:block md:w-[37%] sticky top-24">
          <PriceBox tour={transfer} />
        </div>
      </div>
      <PopularTransfer city_region_id={city_region_id} />
      {/* <TourApi city_region_id={transfer.city_region_id} /> */}
    </main>
  );
}

// Disable static generation for dynamic routes
export async function getServerSideProps() {
  return { props: {} };
}
