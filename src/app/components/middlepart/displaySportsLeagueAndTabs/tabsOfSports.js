import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import sportsData from "../sportApisData/apiEndpointsData.json"; // Import JSON

export default function SportsFilter({ onSelectSport }) {
  const [selectedSport, setSelectedSport] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Extract sports array from JSON
  const sports = sportsData.sports || []; 

  const handleSelectSport = (sport) => {
    setSelectedSport(sport.name);
    setIsOpen(false);
    onSelectSport(sport.api); // Pass API URL to parent component
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4 pt-4 pl-4 pr-4 mb-8">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-teal-500 text-transparent bg-clip-text">
        Select Sports
      </h2>
      
      {/* Mobile Dropdown */}
      <div className="md:hidden w-full relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2 bg-[#13dfae] text-black rounded-lg shadow-md"
        >
          {selectedSport || "Select"} <ChevronDown className="w-5 h-5" />
        </button>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute w-full bg-white rounded-lg shadow-lg mt-2 z-10"
          >
            {sports.map((sport) => (
              <li
                key={sport.id}
                onClick={() => handleSelectSport(sport)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
              >
                {sport.name}
              </li>
            ))}
          </motion.ul>
        )}
      </div>

      {/* Desktop Filter Buttons */}
      <div className="hidden md:flex flex-wrap gap-3">
        {sports.map((sport) => (
          <button
            key={sport.id}
            onClick={() => handleSelectSport(sport)}
            className={`px-4 py-2 rounded-lg transition-all shadow-md text-black ${
              selectedSport === sport.name
                ? "bg-[#13dfae]"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {sport.name}
          </button>
        ))}
      </div>

      {/* Active Filter Display */}
      {selectedSport && (
        <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-md">
          <p className="text-gray-700 text-lg font-semibold">
            Showing results for: <span className="text-black">{selectedSport}</span>
          </p>
          <button
            onClick={() => {
              setSelectedSport("");
              onSelectSport(""); // Reset API URL
            }}
            className="text-gray-500 hover:text-red-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
