import { useAtom } from "jotai";
import { userAtom } from "@/store/atoms";
import { useEffect, useState } from "react";
import {
  getBookingById,
  getTransferBookingsByUser,
} from "@/Services/TourBooking";
import { message } from "antd";

export default function MyBookings() {
  const [user] = useAtom(userAtom);
  const [bookings, setBookings] = useState([]);
  const [transferBooking, setTransferBooking] = useState([]);
  console.log(transferBooking);
  const userId = user?.id;
  const [visibleCount, setVisibleCount] = useState(5);
  const hasTours = bookings && bookings.length > 0;
  const hasTransfers = transferBooking && transferBooking.length > 0;

  useEffect(() => {
    if (!userId) return;

    const fetchBookings = async () => {
      const res = await getBookingById(userId);
      setBookings(res.bookings);
    };

    fetchBookings();
  }, [userId]);
  useEffect(() => {
    if (!userId) return;

    const fetchtransferBookings = async () => {
      const res = await getTransferBookingsByUser(userId);
      setTransferBooking(res.bookings);
    };

    fetchtransferBookings();
  }, [userId]);
  return (
    <div className="max-w-7xl mx-auto  px-4 py-16">
      <h1 className="text-2xl font-bold mb-4 font-serif ">My Booked Tours</h1>

      {/* ================= MOBILE CARDS ================= */}
      <div className="space-y-4 md:hidden">
        {!hasTours ? (
          <p className="text-center text-gray-500 py-6">No tours booked</p>
        ) : (
          <>
            {bookings.slice(0, visibleCount).map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-xl shadow p-4 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-sm">
                    Order #{b._id.slice(-6)}
                  </p>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    Pending
                  </span>
                </div>

                <p className="text-sm">
                  <strong>Tour:</strong> {b.tourName}
                </p>

                <p className="text-sm">
                  <strong>Date:</strong>{" "}
                  {new Date(b.date).toISOString().split("T")[0]}
                </p>

                <p className="text-sm">
                  <strong>Guests:</strong> {b.guests.adults} Adults,{" "}
                  {b.guests.children} Children
                </p>

                <div className="flex justify-between">
                  <span className="text-sm font-semibold">Price:</span>
                  <span className="text-[#10e9dd]">${b.price}</span>
                </div>
              </div>
            ))}
          </>
        )}

        {visibleCount < bookings.length && (
          <div className="flex justify-center py-4">
            <button
              onClick={() => setVisibleCount((prev) => prev + 5)}
              className="px-6 py-2 rounded-full bg-[#ffda32] text-white font-medium hover:opacity-90 transition"
            >
              Load More
            </button>
          </div>
        )}
      </div>
      <div className="space-y-4 md:hidden">
        <h1 className="text-2xl font-bold my-4 font-serif">My Transfer</h1>
        {!hasTransfers ? (
          <p className="text-center text-gray-500 py-6">No transfers booked</p>
        ) : (
          <>
            {transferBooking.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-xl shadow p-4 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-sm">
                    Order #{b._id.slice(-6)}
                  </p>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    Pending
                  </span>
                </div>
                <p className="text-sm">
                  <strong>Transfer:</strong> {b.tourName || b.transferName}
                </p>
                {/* <p className="text-sm">
              <strong>Date:</strong> {formatDate(b.date)}
            </p> */}
                <p className="text-sm">
                  <strong>Guests:</strong> {b.guests.adults} Adults,{" "}
                  {b.guests.children} Children
                </p>
                <div className="flex justify-between">
                  <span className="text-sm font-semibold ">Price:</span>
                  <span className="text-[#10e9dd]">${b.price}</span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-[#10e9dd] text-white">
            <tr>
              <th className="px-4 py-3 text-left">Order #</th>
              <th className="px-4 py-3 text-left">Guests</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Tour</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {!hasTours ? (
              <p className="text-center text-gray-500 py-6">No tours booked</p>
            ) : (
              <>
                {bookings.slice(0, visibleCount).map((b) => (
                  <tr
                    key={b._id}
                    className=" last:border-none hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium">
                      #{b._id.slice(-6)}
                    </td>

                    <td className="px-4 py-3">
                      {b.guests.adults} Adults, {b.guests.children} Children
                    </td>

                    <td className="px-4 py-3 font-semibold">${b.price}</td>

                    <td className="px-4 py-3">
                      {(() => {
                        const date = new Date(b.date);
                        const day = String(date.getDate()).padStart(2, "0");
                        const month = String(date.getMonth() + 1).padStart(
                          2,
                          "0",
                        ); // months are 0-indexed
                        const year = date.getFullYear();
                        return `${day}/${month}/${year}`;
                      })()}
                    </td>

                    <td className="px-4 py-3">{b.tourName}</td>

                    <td className="px-4 py-3">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        Pending
                      </span>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
        {visibleCount < bookings.length && (
          <div className="flex justify-center py-4">
            <button
              onClick={() => setVisibleCount((prev) => prev + 5)}
              className="px-6 py-2 rounded-full bg-[#ffda32] text-white font-medium hover:opacity-90 transition"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow mt-6">
        <h1 className="text-2xl font-bold mb-4 font-serif">
          My Booked Transfer
        </h1>
        <table className="w-full text-sm">
          <thead className="bg-[#10e9dd] text-white">
            <tr>
              <th className="px-4 py-3 text-left">Order #</th>
              <th className="px-4 py-3 text-left">Guests</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Tour</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {!hasTransfers ? (
              <p className="text-start px-4 text-gray-500 py-6">
                No transfer booked
              </p>
            ) : (
              <>
                {transferBooking.map((b) => (
                  <tr
                    key={b._id}
                    className=" last:border-none hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium">
                      #{b._id.slice(-6)}
                    </td>

                    <td className="px-4 py-3">
                      {b.guests.adults} Adults, {b.guests.children} Children
                    </td>

                    <td className="px-4 py-3 font-semibold">${b.price}</td>

                    <td className="px-4 py-3">
                      {(() => {
                        if (!b.dateTime) return "N/A";

                        const date = new Date(b.dateTime);
                        if (isNaN(date)) return "N/A";

                        const day = String(date.getDate()).padStart(2, "0");
                        const month = String(date.getMonth() + 1).padStart(
                          2,
                          "0",
                        );
                        const year = date.getFullYear();

                        const hours = String(date.getHours()).padStart(2, "0");
                        const minutes = String(date.getMinutes()).padStart(
                          2,
                          "0",
                        );

                        return `${day}/${month}/${year} ${hours}:${minutes}`;
                      })()}
                    </td>

                    <td className="px-4 py-3">{b.transferName}</td>

                    <td className="px-4 py-3">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        Pending
                      </span>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Disable static generation - layout uses useRouter
export async function getServerSideProps() {
  return { props: {} };
}
