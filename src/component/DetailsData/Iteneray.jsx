import React from "react";

const Itinerary = ({ data = [] }) => {
  if (!data.length) return null; // Nothing to display

  return (
    <>
      <h2 className="font-bold text-3xl my-6">Itinerary</h2>
      <div className="max-w-3xl  px-3 py-6 ">
        <div className="relative pl-8 space-y-10 border-l border-gray-300  ">
          {data.map((item, idx) => (
            <div key={item._id} className="relative">
              <span className="absolute -left-[50px] top-0 w-8 h-8 bg-[#10E9DD] text-white rounded-full flex items-center justify-center text-sm">
                {idx + 1}
              </span>

              <h3 className="font-bold text-xl">{item.title}</h3>

              <p className="text-gray-600 text-sm mt-1 whitespace-pre-line">
                {item.details}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Itinerary;
