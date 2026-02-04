import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Home,
    Search,
    Compass,
    Film,
    MessageCircle,
    Heart,
    PlusSquare,
    Menu,
    Instagram
} from "lucide-react";
import API from "../api/api";
import socket from "../socket";

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [hasNotifications, setHasNotifications] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await API.get("/users/getmyprofile");
                setUser(res.data);
            } catch (err) {
                console.error("Sidebar profile fetch failed", err);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        // Check initial notifications
        API.get("/notifications")
            .then(res => {
                if (res.data.some(n => !n.isRead)) setHasNotifications(true);
            })
            .catch(() => { });

        // Socket listeners
        socket.on("notification", () => setHasNotifications(true));
        return () => socket.off("notification");
    }, []);

    const menuItems = [
        { icon: <Home size={28} />, label: "Home", path: "/home" },
        { icon: <Search size={28} />, label: "Search", path: "/search" },
        {
            icon: <MessageCircle size={28} />,
            label: "Messages",
            path: "/messages",
            badge: false
        },
        {
            icon: <Heart size={28} />,
            label: "Notifications",
            path: "/notifications",
            badge: hasNotifications
        },
        { icon: <PlusSquare size={28} />, label: "Create", path: "/create" },
        {
            icon: (
                <img
                    src={user?.avatar || "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png"}
                    className="w-7 h-7 rounded-full object-cover border"
                    alt="profile"
                />
            ),
            label: "Profile",
            path: "/profile"
        },
    ];

    return (
        <div className="hidden md:flex flex-col w-[245px] h-screen bg-white border-r fixed top-0 left-0 px-4 pt-8 pb-5 z-50">
            <div className="mb-10 px-2 cursor-pointer" onClick={() => navigate("/home")}>
                <h1
                    className="text-3xl font-bold tracking-wide text-black"
                    style={{
                        fontFamily: "'Montserrat', sans-serif",
                        letterSpacing: '0.08em',
                        fontWeight: 700
                    }}
                >
                    Loop
                </h1>
            </div>

            {/* MENU ITEMS */}
            <div className="flex flex-col gap-2 flex-grow">
                {menuItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <div
                            key={index}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 group
                ${isActive ? 'font-bold' : 'hover:bg-gray-50'}
              `}
                        >
                            <div className={`relative transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                                {item.icon}
                                {item.badge && (
                                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                                )}
                            </div>
                            <span className={`text-base ${isActive ? 'font-bold' : 'font-normal'}`}>
                                {item.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* MORE OPTION */}
            <div className="mt-auto px-2">
                <div className="flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Menu size={28} />
                    <span className="text-base">More</span>
                </div>
            </div>
        </div>
    );
}
