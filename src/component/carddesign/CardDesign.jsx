"use client";

import Link from "next/link";
import Image from "next/image";
import Pagination from "@/component/Pagination/Pagination";
import React, { useEffect, useState } from "react";

export default function CardDesign({
  tours = [],
  currentPage = 1,
  itemsPerPage = 6,
  onPageChange,
}) {
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    // Agar tours array empty ya undefined → loading true
    if (!tours || tours.length === 0) {
      setLocalLoading(true);
    } else {
      setLocalLoading(false);
    }
  }, [tours]);

  // Pagination logic
  const totalPages = Math.ceil(tours.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTours = tours.slice(startIndex, endIndex);

  return (
    <div className="flex-1">
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 gap-y-2">
        {localLoading ? (
          // Loading placeholders
          Array(itemsPerPage)
            .fill(0)
            .map((_, idx) => (
              <div
                key={idx}
                className="bg-gray-100 animate-pulse rounded-xl h-[470px]"
              />
            ))
        ) : paginatedTours.length > 0 ? (
          // Actual tour cards
          paginatedTours.map((tour) => (
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
                    className="object-cover rounded-lg h-[300px]"
                  />
                  <span className="absolute bottom-6 right-6 bg-[#3FD0D4] text-white text-sm font-semibold px-4 py-1 rounded-md">
                    ${tour.ticketPriceAdult}/per person
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
                    <p className="text-sm text-gray-500">{tour.duration}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          // No tour found
          <div className="col-span-full flex justify-center items-center py-20">
            <p className="text-lg font-semibold text-gray-500">No tour found</p>
          </div>
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
