export const BASE_URL = "https://northpointtravel.com/api/v1";

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

  // API response me tour object kis key me hai, check karo
  // Adjust accordingly: e.g., json.tour ya json.data
  return json.tour || json.data || null;
};
