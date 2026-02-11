import React, { useState } from "react";

const Cancellation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(""); // store which content to show

  const cancellationText = `
Free cancellation 24 hours prior - 100% refund
Within 24 hours - No refund

You can cancel up to 24 hours in advance of the experience for a full refund. For a full refund, you must cancel at least 24 hours before the experience’s start time. If you cancel less than 24 hours before the experience’s start time, the amount you paid will not be refunded. Any changes made less than 24 hours before the experience’s start time will not be accepted. Cut-off times are based on the experience’s local time. This experience requires good weather. If it’s canceled due to poor weather, you’ll be offered a different date or a full refund.

`;

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  return (
    <div className=" bg-white   max-w-4xl   space-y-6">
      {/* Cancellation Policy */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className=" rounded-md ">
          <h3 className="font-bold  text-3xl py-4">Cancellation Policy</h3>
          <p className="text-gray-700 mb-3">
            You can cancel up to 24 hours in advance of the experience for a
            full refund.
          </p>
          <button
            onClick={() => openModal("cancellation")}
            className="px-4 py-2 border bg-[#ffda32] text-white rounded-md  transition"
          >
            See More
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0  bg-white/80 backdrop-blur-80 flex items-center justify-center z-50">
          <div className="bg-white border rounded-lg p-6  max-w-[302px] md:max-w-[550px] w-full relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>

            {modalContent === "cancellation" && (
              <>
                <h3 className="text-lg font-semibold mb-4 text-[#10E9DD]">
                  Cancellation Policy Details
                </h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {cancellationText}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cancellation;
