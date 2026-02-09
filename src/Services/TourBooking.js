// api.js
import axios from "axios";

console.log("Base URL:", process.env.NEXT_PUBLIC_TOURS_URL); // ✅ check baseURL in console

export const travelClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TOURS_URL, // your backend URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // cookies/auth
});

console.log("Axios instance baseURL:", travelClient.defaults.baseURL); // ✅ also check axios instance

export const createBooking = async (bookingData) => {
  const res = await travelClient.post(
    "/api/v1/B2C/tour/createBooking",
    bookingData,
  );
  return res.data;
};

export const getBookingById = async (UserId) => {
  const res = await travelClient.get(`/api/v1/B2C/tour/bookings/${UserId}`);
  return res.data;
};

export const getTransfersByCity = async (city_region_id) => {
  const res = await travelClient.get(
    `/api/v1/B2C/transfer/?city=${city_region_id}`,
  );
  return res.data;
};

export const getSingleTransfersbyid = async (id) => {
  const res = await travelClient.get(`/api/v1/B2C/transfer/${id}`);

  return res.data?.transfer || null;
};

export const createTransferBooking = async (bookingTransferData) => {
  const res = await travelClient.post(
    "/api/v1/B2C/transfer/create_Transfer_Booking",
    bookingTransferData,
  );
  return res.data;
};
export const getTransferBookingsByUser = async (UserId) => {
  const res = await travelClient.get(`/api/v1/B2C/transfer/bookings/${UserId}`);
  return res.data;
};
