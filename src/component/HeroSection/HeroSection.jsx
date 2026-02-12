import { useState, useEffect } from "react";
import Image from "next/image";
import BookingBox from "./BookingBox";
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";

export default function HeroSection({ country, height }) {
  console.log(country, "2nd page");
  const [pathname, setPathname] = useState("/");

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  // Home = big hero, Other pages = small hero
  const finalHeight =
    height ||
    (pathname === "/" ? "h-[600px]" : " h-[550px] md:h-[670px] lg:h-[500px]");

  return (
    <>
      <section className={`relative w-full ${finalHeight}`}>
        {/* Navbar inside Hero */}
        <div className="absolute top-0 left-0 w-full z-30">
          <Navbar />
        </div>

        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/heroBg.webp"
            alt="Tropical Island"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10" />

        {/* Content Wrapper */}
        <div className="relative z-20 mx-auto h-full flex flex-col lg:flex-row items-center justify-center lg:justify-around">
          {/* Left Content */}
          <div className="max-w-xl text-white text-center lg:text-left">
            <h1 className="font-serif max-w-[472px] text-2xl md:text-3xl lg:text-6xl font-bold ">
              Dare to <span className="text-[#10E9DD]">Live</span>
              <br />
              the <span className="text-[#10E9DD]">life </span>
              you've wanted
            </h1>

            <p className="  hidden lg:block mt-0 lg:mt-4  text-[12px] md:text-base text-white/90 max-w-[430px] px-3 md:px-0">
              We would love to help you realize your travel dreams, to start
              anew. Take the first steps towards making your dream a reality.
            </p>

            {/* <button className="mt-4 inline-flex items-center justify-center px-6 py-3 bg-[#10E9DD] text-black font-medium rounded-md hover:bg-teal-500 transition">
            Discover More →
          </button> */}
          </div>

          {/* Right Booking Card */}
          <BookingBox country={country} />
        </div>
      </section>
    </>
  );
}
