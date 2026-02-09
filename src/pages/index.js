// pages/index.js

import HeroSection from "@/component/HeroSection/HeroSection";
import HappyCustomer from "@/component/Home/HappyCustomer";
import Reviews from "@/component/Home/Reviews";
import TourTabs from "@/component/Home/TourTabs";

const API_URL = "https://northpointtravel.com/api/v1/country";

export default function HomePage({ country }) {
  console.log(country, "HomePage country");

  return (
    <main className="bg-gray-50 min-h-screen">
      <HeroSection country={country} />
      <TourTabs />
      <HappyCustomer />
      <Reviews />
    </main>
  );
}

// Fetch data at build time
export async function getStaticProps() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      throw new Error("Failed to fetch tours");
    }
    const data = await res.json();

    return {
      props: {
        country: data, // pass data as props
      },
      revalidate: 60, // ISR: rebuild page at most every 60 seconds
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        country: [], // fallback if fetch fails
      },
    };
  }
}
