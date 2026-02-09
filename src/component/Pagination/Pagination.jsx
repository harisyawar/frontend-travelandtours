"use client";

import { useRouter, useSearchParams } from "next/navigation";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 my-12 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className=" px-6 py-2 rounded text-sm font-medium capitalize shadow-sm
        transition-all duration-300 bg-[#F6FFFF] text-[#464646]  hover:bg-[#3FD0D4] hover:text-white"
      >
        Prev
      </button>

      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-6 py-2 rounded text-sm font-medium capitalize shadow-sm
        transition-all duration-300  text-[#464646]  hover:bg-[#3FD0D4] hover:text-white
              ${currentPage === page ? "bg-[#3FD0D4] text-white shadow-sm" : "bg-[#F6FFFF] text-black"}`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-6 py-2 rounded text-sm font-medium capitalize shadow-sm
        transition-all duration-300 bg-[#F6FFFF] text-[#464646]  hover:bg-[#3FD0D4] hover:text-white"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
