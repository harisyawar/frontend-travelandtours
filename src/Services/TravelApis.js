export const BASE_URL = process.env.NEXT_PUBLIC_NORTHPOINT_API_URL;

export const getToursByCity = async (city_region_id) => {
  const res = await fetch(`${BASE_URL}/B2C/tour/?city=${city_region_id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("API failed");
  }

  return res.json();
};

export const getTourById = async (id) => {
  const res = await fetch(`${BASE_URL}/B2C/tour/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch tour details");
  }

  const json = await res.json();

  return json.tour || json.data || null;
};
