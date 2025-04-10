"use client";
import { Button as MuiButton } from "@mui/material";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export const PaginationControls = ({ 
  matches, 
  matchesPerPage, 
  currentPage, 
  totalPages, 
  handlePreviousPage, 
  handleNextPage 
}) => (
  matches.length > matchesPerPage && (
    <div className="flex justify-center items-center gap-3 sm:gap-4 mt-4 sm:mt-6 mb-16 sm:mb-0">
      <MuiButton
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className={`flex items-center gap-1 px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm ${
          currentPage === 1 ? 'bg-gray-700 text-gray-500' : 'bg-teal-600 hover:bg-teal-700 text-white'
        }`}
      >
        <FaChevronLeft className="text-sm sm:text-base" />
        Previous
      </MuiButton>
      
      <span className="text-xs sm:text-sm text-gray-300">
        Page {currentPage} of {totalPages}
      </span>
      
      <MuiButton
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-1 px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm ${
          currentPage === totalPages ? 'bg-gray-700 text-gray-500' : 'bg-teal-600 hover:bg-teal-700 text-white'
        }`}
      >
        Next
        <FaChevronRight className="text-sm sm:text-base" />
      </MuiButton>
    </div>
  )
);