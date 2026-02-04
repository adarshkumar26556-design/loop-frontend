import { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import API from "../api/api";

export default function NewChatModal({ onClose, onSelect }) {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch suggestions on mount
    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const res = await API.get("/users/suggestions");
                setSuggestions(res.data);
            } catch (error) {
                console.error("Failed to fetch suggestions", error);
            }
        };
        fetchSuggestions();
    }, []);

    useEffect(() => {
        if (!search.trim()) {
            setResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await API.get(`/users/search?query=${search}`);
                setResults(res.data);
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    // Determine what list to show
    const listToDisplay = search.trim() ? results : suggestions;
    const isSearching = !!search.trim();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-96 rounded-xl max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <button onClick={onClose} className="text-2xl">&times;</button>
                    <h2 className="font-bold text-lg">New Message</h2>
                    {/* Placeholder for Next button if we supported multi-select */}
                    <div className="w-8"></div>
                </div>

                {/* Search */}
                <div className="p-4 border-b flex items-center gap-2">
                    <span className="font-semibold text-gray-700">To:</span>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 outline-none"
                        autoFocus
                    />
                </div>

                {/* Results / Suggestions */}
                <div className="flex-1 overflow-y-auto p-2">
                    {!isSearching && suggestions.length > 0 && (
                        <p className="px-3 py-2 text-sm font-semibold text-gray-500">Suggested</p>
                    )}

                    {loading ? (
                        <p className="text-center text-gray-500 py-4">Searching...</p>
                    ) : listToDisplay.length > 0 ? (
                        listToDisplay.map((user) => (
                            <div
                                key={user._id}
                                onClick={() => {
                                    onSelect(user);
                                    onClose();
                                }}
                                className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded-lg"
                            >
                                <img
                                    src={user.avatar || "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png"}
                                    alt="avatar"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex flex-col">
                                    <span className="font-semibold text-sm">{user.username}</span>
                                    <span className="text-gray-500 text-xs">{user.name || user.email}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400 py-4">
                            {isSearching ? "No account found." : "No suggestions found."}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
