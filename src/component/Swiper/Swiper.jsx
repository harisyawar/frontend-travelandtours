"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const BASE_IMAGE_URL =
  "https://northpointtravel.s3.eu-north-1.amazonaws.com/images/";

export default function SwiperCarousel({ images }) {
  // ✅ normalize images to array
  const normalizedImages = Array.isArray(images)
    ? images
    : images
      ? [images]
      : [];

  const backendImages = normalizedImages.map(
    (img) => `${BASE_IMAGE_URL}${img}`,
  );

  const fallbackImages = [
    "/images/bangkok2.jpg",
    "/images/bangkok3.jpg",
    "/images/bangkok4.jpg",
  ];

  const slides = backendImages.length > 0 ? backendImages : fallbackImages;

  return (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] relative">
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={1}
        className="h-full"
      >
        {slides.map((src, idx) => (
          <SwiperSlide key={idx} className="rounded-xl overflow-hidden">
            <Image
              src={src}
              alt={`Slide ${idx + 1}`}
              width={1200}
              height={600}
              className="w-full h-full object-cover"
              priority={idx === 0}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
