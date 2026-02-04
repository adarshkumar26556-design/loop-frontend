import { useNavigate } from "react-router-dom";
import { useState } from "react";
import NewChatModal from "./NewChatModal";

export default function ChatSidebar({ conversations, currentUser, onSelectUser, selectedUserId }) {
    const navigate = useNavigate();
    const [showNewChat, setShowNewChat] = useState(false);

    return (
        <div className="w-1/3 border-r h-full bg-white flex flex-col">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    {currentUser?.username} <span className="text-sm">▼</span>
                </h2>
                <button onClick={() => setShowNewChat(true)} className="p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                </button>
            </div>

            {showNewChat && (
                <NewChatModal
                    onClose={() => setShowNewChat(false)}
                    onSelect={(user) => {
                        onSelectUser(user);
                        setShowNewChat(false);
                    }}
                />
            )}

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                    <p className="text-center text-gray-400 mt-10">No messages yet.</p>
                ) : (
                    conversations.map((conv) => (
                        <div
                            key={conv.user._id}
                            onClick={() => onSelectUser(conv.user)}
                            className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer ${selectedUserId === conv.user._id ? "bg-gray-100" : ""
                                }`}
                        >
                            <img
                                src={conv.user.avatar || "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png"}
                                alt="avatar"
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold">{conv.user.username}</p>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <p className="truncate">
                                        {conv.isRead ? conv.lastMessage : <span className="font-bold text-black">{conv.lastMessage}</span>}
                                    </p>
                                    <span>• {getTimeAgo(conv.createdAt)}</span>
                                </div>
                            </div>
                            {!conv.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function getTimeAgo(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
}
