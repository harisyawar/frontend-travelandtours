import Link from "next/link";
import Image from "next/image";
import Pagination from "@/component/Pagination/Pagination";
import React from "react";
import { MdOutlineTimer } from "react-icons/md";
import { useRouter } from "next/router";

export default function CardDesign({
  tours = [],
  currentPage = 1,
  itemsPerPage = 6,
  onPageChange,
}) {
  // Pagination logic
  const totalPages = Math.ceil(tours.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTours = tours.slice(startIndex, endIndex);
  console.log(tours, "card");
  const router = useRouter();

  const adults = Number(router.query.adults); // 3
  const children = Number(router.query.children); // 2
  const type = router.query.type;
  console.log(type, "typeincard");
  const totalPersons = adults + children; // 3 + 2 = 5

  const getTransferRate = (transferRates, totalPersons) => {
    if (!transferRates?.length) return 0;

    const slab = transferRates.find(
      (r) => totalPersons >= r.minPax && totalPersons <= r.maxPax,
    );

    return slab ? slab.rate : 0;
  };

  return (
    <div className="flex-1">
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 gap-y-2">
        {tours.length === 0 ? (
          // No tour found
          <div className="col-span-full flex justify-center items-center py-10">
            <p className="text-lg font-semibold text-gray-500">No Data Found</p>
          </div>
        ) : (
          // Actual tour cards
          paginatedTours.map((tour) => {
            let grandTotal = 0;

            // 🔹 Tour logic
            if (tour.type === "tour") {
              const adultTicketPrice = Number(tour?.ticketPriceAdult ?? 0);
              const transferRatePerPerson = getTransferRate(
                tour?.transferRates || [],
                totalPersons,
              );
              grandTotal = transferRatePerPerson + adultTicketPrice;
            }

            // 🔹 Transfer logic
            else if (tour.type === "transfer") {
              const adults = Number(router.query.adults) || 0;
              const children = Number(router.query.children) || 0;
              const totalPersons = adults + children;

              const getTransferRate = (transferRates, totalPersons) => {
                if (!transferRates?.length) return 0;
                const slab = transferRates.find(
                  (r) => totalPersons >= r.minPax && totalPersons <= r.maxPax,
                );
                return slab ? slab.rate : 0;
              };

              // ✅ Shared transfer
              if (tour.sharedTransferAdult > 0) {
                grandTotal = tour.sharedTransferAdult;
              }
              // ✅ Private transfer
              else if (tour.transferRates && tour.transferRates.length > 0) {
                const slabRate = getTransferRate(
                  tour.transferRates,
                  totalPersons,
                );
                grandTotal = slabRate / totalPersons;
              }
            }

            // Agar grandTotal 0 hai to UI me show mat karo
            if (grandTotal <= 0) return null;

            const grandTotalFixed = Number(grandTotal.toFixed(2));

            return (
              <div
                key={tour._id}
                className="bg-white rounded-xl shadow-md transition overflow-hidden h-[470px] hover:scale-95 hover:shadow-lg"
              >
                <Link
                  href={
                    tour.type === "tour"
                      ? `/tour-details/${tour._id}`
                      : `/transfer-details/${tour._id}`
                  }
                >
                  <div className="relative p-3">
                    <Image
                      src={
                        Array.isArray(tour.images) && tour.images.length > 0
                          ? `https://northpointtravel.s3.eu-north-1.amazonaws.com/images/${tour.images[0]}`
                          : typeof tour.images === "string"
                            ? `https://northpointtravel.s3.eu-north-1.amazonaws.com/images/${tour.images}`
                            : "https://northpointtravel.s3.eu-north-1.amazonaws.com/images/default.jpg"
                      }
                      alt={tour.name}
                      width={400}
                      height={300}
                      className="object-cover rounded-lg h-[300px] w-full"
                    />
                    <span className="absolute bottom-6 right-6 bg-[#3FD0D4] text-white text-sm font-semibold px-4 py-1 rounded-md">
                      ${grandTotalFixed}/per person
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

                    <div className="flex items-center gap-2 mt-2">
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
        )}
      </main>

      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
