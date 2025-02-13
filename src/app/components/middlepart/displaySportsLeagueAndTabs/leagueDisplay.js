import { useEffect, useState } from "react";

export default function TestLeague({ apiUrl }) {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const leaguesPerPage = 20;

  useEffect(() => {
    if (!apiUrl) return;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "x-apisports-key": "1c72405a286ac7a9b5ad11934276bf3d",
            "Accept": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.response && Array.isArray(data.response)) {
          setLeagues(data.response);
        } else {
          throw new Error("Unexpected API response format");
        }
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [apiUrl]);

  const totalPages = Math.ceil(leagues.length / leaguesPerPage);
  const currentLeagues = leagues.slice(
    (currentPage - 1) * leaguesPerPage,
    currentPage * leaguesPerPage
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleBack = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (!apiUrl) return <p className="text-center text-gray-400">Please select a sport.</p>;
  if (loading) return <p className="text-center text-gray-400">Loading leagues...</p>;
  if (error) return <p className="text-center text-red-400">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4 bg-gray-900 min-h-screen">
      <h1 className="text-center text-3xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-green-400 text-transparent bg-clip-text">
        Select League
      </h1>

      <div className="p-4 bg-gray-800 border border-gray-700 rounded-xl shadow-lg">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {currentLeagues.map((league, index) => (
            <div key={league.id || `league-${index}`} className="bg-gray-900 border border-[#13dfae] rounded-lg shadow-md p-3 flex flex-col items-center text-center sm:p-5">
              <img src={league.logo} alt={`${league.name} logo`} className="w-12 h-12 sm:w-16 sm:h-16 mb-2" />
              <h2 className="text-xs sm:text-sm font-semibold text-white">{league.name}</h2>
              <button className="mt-3 w-full px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm bg-[#13dfae] text-gray-900 font-semibold rounded-md shadow-md hover:bg-teal-400 transition-all active:scale-95">
                View Predictions
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={handleBack}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md font-semibold ${currentPage === 1 ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#13dfae] hover:bg-teal-400'}`}
        >
          Back
        </button>
        <span className="text-white">Page {currentPage} of {totalPages}</span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md font-semibold ${currentPage === totalPages ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#13dfae] hover:bg-teal-400'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
