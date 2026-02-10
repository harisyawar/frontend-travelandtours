import { useEffect, useState } from "react";
import { getToursByCity } from "@/Services/TravelApis";
import Image from "next/image";
import Link from "next/link";

export default function TourApi({ city_region_id }) {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!city_region_id) return;

    const fetchTours = async () => {
      setLoading(true);
      try {
        const relatedData = await getToursByCity(
          city_region_id.id ?? city_region_id,
        );
        let related = relatedData.tours || [];

        // Sort by selectionCount descending
        related.sort(
          (a, b) => (b.selectionCount || 0) - (a.selectionCount || 0),
        );

        // Only take top 4
        related = related.slice(0, 4);

        setTours(related);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [city_region_id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (tours.length === 0) return <div>No tours found</div>;

  return (
    <div className="flex-1">
      <h2 className="text-black text-3xl font-bold">Most popular Tour</h2>
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 gap-y-2 my-4">
        {tours.map((tour) => (
          <div
            key={tour._id}
            className="bg-white rounded-xl shadow-md transition overflow-hidden h-[470px] hover:scale-95 hover:shadow-lg"
          >
            <Link href={`/tour-details/${tour._id}`}>
              <div className="relative p-3">
                <Image
                  src={
                    tour.images?.length > 0
                      ? `https://northpointtravel.s3.eu-north-1.amazonaws.com/images/${tour.images[0]}`
                      : "/fallback.png"
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
                  <svg
                    width="17"
                    height="15"
                    viewBox="0 0 17 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 7.11084C0 3.18363 3.80558 0 8.5 0C13.1944 0 17 3.18363 17 7.11084C17 11.0381 13.1944 14.2217 8.5 14.2217C3.80558 14.2217 0 11.0381 0 7.11084ZM9.25 2.92799C9.25 2.58147 8.91421 2.30057 8.5 2.30057C8.08579 2.30057 7.75 2.58147 7.75 2.92799V7.11084C7.75 7.32717 7.88321 7.52824 8.1025 7.6429L11.1025 9.21147C11.4538 9.39512 11.9165 9.30579 12.136 9.01194C12.3555 8.7181 12.2488 8.33101 11.8975 8.14735L9.25 6.76309V2.92799Z"
                      fill="#3FD0D4"
                    />
                  </svg>
                  <p className="text-sm text-gray-500">{tour.duration}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </main>
    </div>
  );
}
