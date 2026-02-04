import { useEffect, useState } from "react";
import { Home, PlusSquare, Heart, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../API/api";
import socket from "../socket";

const DEFAULT_AVATAR =
  "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png";

export default function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [hasRequests, setHasRequests] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await API.get("/users/getmyprofile");
        setUser(res.data);
      } catch { }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    API.get("/notifications")
      .then((res) => {
        if (res.data.some((n) => !n.isRead)) setHasRequests(true);
      })
      .catch(() => { });
  }, []);

  // ✅ SOCKET LISTENERS (FINAL)
  useEffect(() => {
    socket.on("post:like", () => setHasRequests(true));
    socket.on("post:comment", () => setHasRequests(true));
    socket.on("follow:request", () => setHasRequests(true));
    socket.on("notification", () => setHasRequests(true));

    return () => {
      socket.off("post:like");
      socket.off("post:comment");
      socket.off("follow:request");
      socket.off("notification");
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/user/${search.trim()}`);
    setSearch("");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <h1 onClick={() => navigate("/home")} className="text-xl font-bold cursor-pointer">
          Loop
        </h1>

        <form onSubmit={handleSearch} className="hidden md:block relative">
          <input
            type="text"
            placeholder="Search users"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              // Fetch suggestions
              if (e.target.value.trim().length > 0) {
                API.get(`/users/search?query=${e.target.value}`)
                  .then((res) => setSuggestions(res.data))
                  .catch(() => setSuggestions([]));
              } else {
                setSuggestions([]);
              }
            }}
            className="bg-[#efefef] text-sm px-4 py-1.5 rounded-md outline-none w-64"
          />

          {/* SUGGESTIONS DROPDOWN */}
          {suggestions.length > 0 && (
            <div className="absolute top-10 left-0 w-64 bg-white border rounded shadow-lg max-h-64 overflow-y-auto">
              {suggestions.map((user) => (
                <div
                  key={user._id}
                  onClick={() => {
                    navigate(`/user/${user.username}`);
                    setSearch("");
                    setSuggestions([]);
                  }}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <img
                    src={user.avatar || DEFAULT_AVATAR}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                  <div className="text-sm">
                    <p className="font-semibold text-xs">{user.username}</p>
                    <p className="text-gray-500 text-[10px]">{user.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>

        <div className="flex items-center gap-5">
          <Home size={22} onClick={() => navigate("/home")} />
          <PlusSquare size={22} onClick={() => navigate("/create")} />
          <MessageCircle size={22} onClick={() => navigate("/messages")} />

          <div className="relative cursor-pointer">
            <Heart size={22} onClick={() => navigate("/notifications")} />
            {hasRequests && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
            )}
          </div>

          <img
            src={user?.avatar || DEFAULT_AVATAR}
            onClick={() => navigate("/profile")}
            className="w-8 h-8 rounded-full object-cover border cursor-pointer"
          />
        </div>
      </div>
    </nav>
  );
}
