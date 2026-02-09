"use client";
import Image from "next/image";
import React from "react";

const HappyCustomer = () => {
  return (
    <div>
      <Image
        src="/images/whyChooseUs.png" // replace with your image path or URL
        alt="Happy Customer"
        width={1600} // set desired width
        height={200} // set desired height
        className=" object-cover" // optional styling
        priority
      />
    </div>
  );
};

export default HappyCustomer;
