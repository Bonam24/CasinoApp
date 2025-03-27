// components/Header.js
import { FaHome } from "react-icons/fa";

export default function HeaderGames() {
  return (
    <div className="bg-teal-500 text-white p-3 sm:p-4 rounded-lg shadow-lg mb-4 sm:mb-6 flex justify-between items-center">
      <div className="flex items-center gap-2 sm:gap-3">
        <img
          src="/images/BundlesBetsLogo.png"
          alt="Bundlesbets Logo"
          className="w-8 h-8 sm:w-10 sm:h-10"
        />
        <span className="text-lg sm:text-2xl font-bold">Sports Games</span>
      </div>
      <a href="/otherPages/dashboard" className="text-sm font-semibold hover:underline">
        <FaHome className="text-xl sm:text-2xl" />
      </a>
    </div>
  );
}