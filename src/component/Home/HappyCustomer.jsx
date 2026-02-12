import Image from "next/image";
import React from "react";

const HappyCustomer = () => {
  return (
    <div className="w-full">
      <Image
        src="/images/why-choose-us.webp"
        alt="Happy Customer"
        width={1600}
        height={200}
        className="w-full h-auto object-contain"
        priority
      />
    </div>
  );
};

export default HappyCustomer;
