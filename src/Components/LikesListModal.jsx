import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import postAPI from "../api/postApi";
import API from "../api/api"; // Ensure this matches your file structure

export default function LikesListModal({ postId, commentId, onClose }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const currentUserId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                let endpoint = `/${postId}/likes`;
                if (commentId) {
                    endpoint = `/${postId}/comments/${commentId}/likes`;
                }

                const res = await postAPI.get(endpoint);

                // Transform data to include isFollowing state
                const data = Array.isArray(res.data)
                    ? res.data.map(u => ({
                        ...u,
                        isFollowing: u.followers?.includes(currentUserId)
                    }))
                    : [];

                setUsers(data);
            } catch (err) {
                console.error("Failed to fetch likes", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLikes();
    }, [postId, commentId, currentUserId]);

    const handleFollow = async (targetUserId) => {
        // Optimistic update
        setUsers(prev => prev.map(u => {
            if (u._id === targetUserId) {
                return { ...u, isFollowing: !u.isFollowing };
            }
            return u;
        }));

        try {
            await API.put(`/users/${targetUserId}/follow`);
        } catch (error) {
            console.error("Follow failed", error);
            // Revert on failure
            setUsers(prev => prev.map(u => {
                if (u._id === targetUserId) {
                    return { ...u, isFollowing: !u.isFollowing };
                }
                return u;
            }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-xl overflow-hidden flex flex-col h-[400px]">
                {/* HEADER */}
                <div className="flex items-center justify-between p-3 border-b relative">
                    <p className="font-semibold text-base text-center w-full">Liked by</p>
                    <div className="absolute right-3 top-3">
                        <X className="cursor-pointer" onClick={onClose} />
                    </div>
                </div>

                {/* LIST */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loading ? (
                        <p className="text-center text-gray-400 text-sm">Loading...</p>
                    ) : users.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm">No likes yet</p>
                    ) : (
                        users.map((user) => {
                            const isMe = user._id === currentUserId;

                            return (
                                <div key={user._id} className="flex items-center justify-between">
                                    <div
                                        className="flex items-center gap-3 cursor-pointer"
                                        onClick={() => {
                                            onClose();
                                            navigate(`/user/${user.username}`);
                                        }}
                                    >
                                        <img
                                            src={user.avatar || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"}
                                            className="w-11 h-11 rounded-full object-cover border"
                                            alt="avatar"
                                        />
                                        <div>
                                            <p className="font-semibold text-sm">{user.username}</p>
                                            <p className="text-gray-500 text-xs">{user.name || user.username}</p>
                                        </div>
                                    </div>

                                    {!isMe && (
                                        <button
                                            onClick={() => handleFollow(user._id)}
                                            className={`text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors ${user.isFollowing
                                                ? "bg-gray-100 text-black border border-gray-200"
                                                : "bg-blue-500 text-white hover:bg-blue-600"
                                                }`}
                                        >
                                            {user.isFollowing ? "Following" : "Follow"}
                                        </button>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
