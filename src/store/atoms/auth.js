import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

/**
 * User atom - stores the current authenticated user
 * HTTP-Only cookies are handled by the browser automatically
 * We only store user data in state/storage for UI purposes
 * Using regular atom (not atomWithStorage) to avoid localStorage conflicts on logout
 */
export const userAtom = atomWithStorage("currentUser", null);

/**
 * Loading atom - tracks authentication loading state
 */
export const authLoadingAtom = atom(false);

/**
 * Error atom - tracks authentication errors
 */
export const authErrorAtom = atom(null);

/**
 * Derived atom - checks if user is authenticated
 * No need to check token - if user exists, they have a valid token in HTTP-Only cookie
 */
// store/atoms/booking.js

export const bookingAtom = atom({
  selectedRoom: null,
  hotelData: null,
});

export const isAuthenticatedAtom = atom((get) => {
  const user = get(userAtom);
  return !!user;
});

/**
 * Derived atom - checks initialization status
 */
export const authInitializedAtom = atom(true);
export const searchDataAtom = atomWithStorage(
  "searchData", // localStorage key
  null,
);
export const searchAtom = atomWithStorage("searchData", {
  city_region_id: null, // selected city id
  label: "", // destination label (City, Country)
  adults: 1, // default adult count
  children: 0, // default child count
  type: "tour", // default tab: "tour" or "transfer"
});
export const selectedRoomAtom = atomWithStorage("selectedRoom", null);
