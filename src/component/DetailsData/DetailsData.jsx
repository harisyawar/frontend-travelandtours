import React, { useState } from "react";
import { Check, X } from "lucide-react";

const WhatsIncludedAndPickup = ({ included = [], excluded = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-4xl py-4 space-y-10">
      {/* What's Included */}
      <div>
        <h2 className="font-bold text-3xl mb-6">What's Included</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Included */}
          <ul className="space-y-4">
            {included.slice(0, 3).map((item, idx) => (
              <li key={idx} className="flex gap-3">
                <Check className="text-green-600 w-5 h-5 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Not Included */}
          <ul className="space-y-4">
            {excluded.slice(0, 3).map((item, idx) => (
              <li key={idx} className="flex gap-3">
                <X className="text-red-300 w-5 h-5 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* See More Button */}
        {(included.length > 3 || excluded.length > 3) && (
          <p
            onClick={() => setIsModalOpen(true)}
            className="text-sm text-[#10E9DD] mt-4 cursor-pointer underline"
          >
            See More
          </p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0  bg-white/80 backdrop-blur-80 flex items-center justify-center z-50">
          <div className="bg-white  border rounded-lg p-6  max-w-[302px] md:max-w-[550px] w-full relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>

            <h3 className="text-lg font-semibold mb-4 text-[#10E9DD]">
              All What's Included
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="space-y-3">
                {included.map((item, idx) => (
                  <li key={idx} className="flex gap-3">
                    <Check className="text-green-600 w-5 h-5 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <ul className="space-y-3">
                {excluded.map((item, idx) => (
                  <li key={idx} className="flex gap-3">
                    <X className="text-red-300 w-5 h-5 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsIncludedAndPickup;
