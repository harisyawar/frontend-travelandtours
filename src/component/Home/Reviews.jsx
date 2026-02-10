import Image from "next/image";
import React, { useState } from "react";

const reviews = [
  {
    title: "The planning process was excellent",
    name: "Howard Reed",
    date: "15/05/2023",
    stars: 5,
    text: "It was a life changing experience and we couldn’t be happier to have done it, learned so much, seen so much, and escaped from work for a couple of weeks!",
  },
  {
    title: "Amazing journey!",
    name: "Emily Clark",
    date: "02/04/2023",
    stars: 4,
    text: "I loved every moment of the trip. Everything was perfectly organized and fun!",
  },
  {
    title: "Highly recommended",
    name: "Michael Smith",
    date: "10/03/2023",
    stars: 5,
    text: "From start to finish, this was a smooth and unforgettable experience.",
  },
];

const Reviews = () => {
  const [current, setCurrent] = useState(0);

  const prevReview = () => {
    setCurrent(current === 0 ? reviews.length - 1 : current - 1);
  };

  const nextReview = () => {
    setCurrent(current === reviews.length - 1 ? 0 : current + 1);
  };

  const currentReview = reviews[current];

  return (
    <section className="relative w-full min-h-[500px] lg:min-h-[600px] flex items-center py-8">
      <div className="flex flex-col lg:flex-row w-full items-center justify-between gap-8 lg:gap-0">
        {/* Left Side - Image */}
        <div className="relative w-full lg:w-[60%] h-[400px] md:h-[450px] lg:h-[550px]">
          <Image
            src="/images/Left Contents.png"
            alt="Happy Travelers Background"
            fill
            className="object-contain object-left"
            priority
          />
        </div>

        {/* Right Side - Text + Review Card */}
        <div className="flex flex-col items-center gap-4 lg:gap-6 w-full lg:w-[40%] px-4 lg:pr-8">
          {/* Heading */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h4 className="font-serif text-[#10E9DD] !mb-0">Reviews</h4>
            <p className="text-2xl font-bold font-serif">
              What Our Happy Travelers Say
            </p>
            <div className="border-b border-[#838181] w-24"></div>
          </div>

          {/* Review Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 w-full max-w-md md:max-w-lg text-gray-800 flex flex-col">
            {/* Name + Stars */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-black text-xl font-semibold italic">
                {currentReview.name}
              </p>
              <div className="flex gap-1 text-yellow-400">
                {Array(currentReview.stars)
                  .fill("★")
                  .map((star, idx) => (
                    <span key={idx}>{star}</span>
                  ))}
              </div>
            </div>

            {/* Review Text */}
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {currentReview.text}
            </p>

            {/* Arrows */}
            <div className="flex justify-end gap-6 mt-6">
              <button
                onClick={prevReview}
                className="text-gray-600 hover:text-gray-800 text-xl font-bold px-4 py-2 rounded bg-white shadow"
              >
                &lt;
              </button>
              <button
                onClick={nextReview}
                className="text-gray-600 hover:text-gray-800 text-xl font-bold px-4 py-2 rounded bg-white shadow"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
