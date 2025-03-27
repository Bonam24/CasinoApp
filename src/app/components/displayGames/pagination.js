// components/Pagination.js
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Pagination({ 
  currentPage, 
  totalPages, 
  handlePreviousPage, 
  handleNextPage,
  matches,
  matchesPerPage
}) {
  if (matches.length <= matchesPerPage) return null;

  return (
    <div className="flex justify-center items-center gap-3 sm:gap-4 mt-4 sm:mt-6 mb-16 sm:mb-0">
      <button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className={`flex items-center gap-1 px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm ${
          currentPage === 1 ? 'bg-gray-700 text-gray-500' : 'bg-teal-600 hover:bg-teal-700 text-white'
        }`}
      >
        <FaChevronLeft className="text-sm sm:text-base" />
        Previous
      </button>
      
      <span className="text-xs sm:text-sm text-gray-300">
        Page {currentPage} of {totalPages}
      </span>
      
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-1 px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm ${
          currentPage === totalPages ? 'bg-gray-700 text-gray-500' : 'bg-teal-600 hover:bg-teal-700 text-white'
        }`}
      >
        Next
        <FaChevronRight className="text-sm sm:text-base" />
      </button>
    </div>
  );
}