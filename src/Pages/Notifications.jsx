import { useEffect, useState } from "react";
import { User, MessageCircle, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import socket from "../socket";

export default function Notifications() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();

        socket.on("notification", (newNotif) => {
            setNotifications((prev) => [newNotif, ...prev]);
        });

        return () => socket.off("notification");
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await API.get("/notifications");
            setNotifications(res.data);
        } catch (error) {
            console.error("Fetch notifications error:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await API.put(`/notifications/read`);
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleAccept = async (userId, notificationId) => {
        try {
            await API.post("/users/follow-requests/respond", {
                requesterId: userId,
                action: "accept",
            });
            // Remove the notification or mark as handled
            setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
        } catch (error) {
            console.error("Accept error:", error);
        }
    };

    const handleDecline = async (userId, notificationId) => {
        try {
            await API.post("/users/follow-requests/respond", {
                requesterId: userId,
                action: "reject",
            });
            setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
        } catch (error) {
            console.error("Decline error:", error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case "like":
                return <Heart size={20} className="text-red-500 fill-red-500" />;
            case "comment":
                return <MessageCircle size={20} className="text-blue-500" />;
            case "follow":
            case "follow_request":
            case "follow_accept":
                return <User size={20} className="text-purple-500" />;
            default:
                return <Heart size={20} />;
        }
    };

    const getText = (notif) => {
        const username = notif.sender?.username || "Someone";
        switch (notif.type) {
            case "like":
                return (
                    <span>
                        <span className="font-semibold">{username}</span> liked your post.
                    </span>
                );
            case "comment":
                return (
                    <span>
                        <span className="font-semibold">{username}</span> commented:{" "}
                        {notif.message}
                    </span>
                );
            case "follow":
                return (
                    <span>
                        <span className="font-semibold">{username}</span> started following
                        you.
                    </span>
                );
            case "follow_request":
                return (
                    <span>
                        <span className="font-semibold">{username}</span> sent a follow
                        request.
                    </span>
                );
            case "follow_accept":
                return (
                    <span>
                        <span className="font-semibold">{username}</span> accepted your follow request.
                    </span>
                );
            default:
                return <span>New notification</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto px-4 mt-8 pb-10">
            <h2 className="text-xl font-bold mb-6">Notifications</h2>

            <div className="flex flex-col gap-4">
                {notifications.length === 0 ? (
                    <p className="text-gray-500 text-center">No notifications yet.</p>
                ) : (
                    notifications.map((notif) => (
                        <div
                            key={notif._id}
                            onClick={() => markAsRead(notif._id)}
                            className={`flex flex-col p-3 rounded-lg cursor-pointer transition-colors ${notif.isRead ? "bg-white" : "bg-blue-50"
                                } hover:bg-gray-50`}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img
                                            src={
                                                notif.sender?.avatar ||
                                                "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png"
                                            }
                                            className="w-10 h-10 rounded-full object-cover border"
                                            alt="avatar"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/user/${notif.sender?.username}`);
                                            }}
                                        />
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                            {getIcon(notif.type)}
                                        </div>
                                    </div>
                                    <div className="text-sm">{getText(notif)}</div>
                                </div>

                                {notif.post?.image && (
                                    <img
                                        src={notif.post.image}
                                        alt="post"
                                        className="w-10 h-10 object-cover rounded ml-4"
                                    />
                                )}
                            </div>

                            {/* SHOW ACTIONS FOR FOLLOW REQUESTS */}
                            {notif.type === "follow_request" && (
                                <div className="flex gap-2 mt-3 ml-14">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAccept(notif.sender._id, notif._id);
                                        }}
                                        className="bg-[#0095f6] text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-[#1877f2]"
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDecline(notif.sender._id, notif._id);
                                        }}
                                        className="bg-gray-200 text-black px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-300"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

/* ============================
    ADD NEW HANDLERS BELOW
============================ */

