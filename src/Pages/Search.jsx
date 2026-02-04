import { useState, useEffect } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../API/api";

const DEFAULT_AVATAR =
    "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png";

export default function Search() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const res = await API.get(`/users/search?query=${query}`);
                setResults(res.data);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchResults();
        }, 300); // Debounce

        return () => clearTimeout(timeoutId);
    }, [query]);

    return (
        <div className="max-w-xl mx-auto py-4 px-4 mt-4 md:mt-8">
            <h1 className="text-2xl font-bold mb-6">Search</h1>

            {/* Search Input */}
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-gray-100 rounded-lg py-3 pl-11 pr-10 outline-none focus:ring-1 ring-gray-300 transition-all font-medium"
                />
                <SearchIcon className="absolute left-4 top-3.5 text-gray-400" size={20} />
                {query && (
                    <X
                        className="absolute right-3 top-3.5 text-gray-400 cursor-pointer hover:text-gray-600"
                        size={20}
                        onClick={() => setQuery("")}
                    />
                )}
            </div>

            {/* Results */}
            <div className="flex flex-col">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                    </div>
                ) : results.length > 0 ? (
                    <div className="space-y-4">
                        {results.map((user) => (
                            <div
                                key={user._id}
                                onClick={() => navigate(`/user/${user.username}`)}
                                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={user.avatar || DEFAULT_AVATAR}
                                        alt={user.username}
                                        className="w-12 h-12 rounded-full object-cover border border-gray-100"
                                    />
                                    <div>
                                        <p className="font-semibold text-sm">{user.username}</p>
                                        <p className="text-gray-500 text-sm">{user.name || user.username}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : query && (
                    <div className="text-center text-gray-500 py-10">
                        <p>No results found.</p>
                    </div>
                )}

                {/* Recent/Default state if needed */}
                {!query && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-base mb-4">Recent</h3>
                        <div className="text-gray-400 text-sm italic">No recent searches.</div>
                    </div>
                )}
            </div>
        </div>
    );
}
