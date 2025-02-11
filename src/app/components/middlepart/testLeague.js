import { useEffect, useState } from "react";

export default function TestLeague() {
    const [leagues, setLeagues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const leaguesPerPage = 20;

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('https://v1.basketball.api-sports.io/leagues', {
                    method: 'GET',
                    headers: {
                        "x-apisports-key": "1c72405a286ac7a9b5ad11934276bf3d",
                        "Accept": "application/json"
                    }
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
    }, []);

    const indexOfLastLeague = currentPage * leaguesPerPage;
    const indexOfFirstLeague = indexOfLastLeague - leaguesPerPage;
    const currentLeagues = leagues.slice(indexOfFirstLeague, indexOfLastLeague);
    const totalPages = Math.ceil(leagues.length / leaguesPerPage);

    // Scroll back to the "Select League" heading when changing pages
    const scrollToTop = () => {
        document.getElementById("select-league-heading")?.scrollIntoView({ behavior: "smooth" });
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        scrollToTop();
    };

    if (loading) return <p className="text-center text-gray-400">Loading leagues...</p>;
    if (error) return <p className="text-center text-red-400">Error: {error}</p>;

    return (
        <div className="container mx-auto p-4 bg-gray-900 min-h-screen">
            <h1 
                id="select-league-heading" 
                className="text-center text-3xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-green-400 text-transparent bg-clip-text"
            >
                Select League
            </h1>

            {/* Cards Wrapper */}
            <div className="p-4 bg-gray-800 border border-gray-700 rounded-xl shadow-lg">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {currentLeagues.map((league, index) => (
                        <div 
                            key={league.id || `league-${index}`} 
                            className="bg-gray-900 border border-[#13dfae] rounded-lg shadow-md p-3 flex flex-col items-center text-center sm:p-5"
                        >
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
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-6 mt-10 p-4 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-5 py-3 text-sm sm:text-lg font-bold rounded-lg transition-all active:scale-95 ${
                            currentPage === 1 ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-[#13dfae] text-gray-900 hover:bg-teal-400"
                        }`}
                    >
                        ⬅ Previous
                    </button>

                    <span className="text-lg sm:text-2xl font-bold text-[#13dfae] px-5 py-2 bg-gray-900 border border-[#13dfae] rounded-lg shadow-md">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-5 py-3 text-sm sm:text-lg font-bold rounded-lg transition-all active:scale-95 ${
                            currentPage === totalPages ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-[#13dfae] text-gray-900 hover:bg-teal-400"
                        }`}
                    >
                        Next ➡
                    </button>
                </div>
            )}
        </div>
    );
}
