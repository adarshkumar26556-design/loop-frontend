import { useEffect, useState } from "react";
import { Home, PlusSquare, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const DEFAULT_AVATAR =
  "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");

useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const fetchUser = async () => {
    try {
      const res = await API.get("/users/getmyprofile");
      setUser(res.data);
    } catch (err) {
      console.log("Navbar profile fetch failed");
    }
  };

  fetchUser();
}, []);


  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/profile/${search}`);
    setSearch("");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* LOGO */}
        <h1
          onClick={() => navigate("/profile")}
          className="text-xl font-bold cursor-pointer"
        >
          LOOP
        </h1>

        {/* SEARCH */}
        <form onSubmit={handleSearch} className="hidden md:block">
          <input
            type="text"
            placeholder="Search users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#efefef] text-sm px-4 py-1.5 rounded-md outline-none w-64"
          />
        </form>

        {/* ICONS */}
        <div className="flex items-center gap-5">
          <Home
            size={22}
            className="cursor-pointer"
            onClick={() => navigate("/home")}
          />

          <PlusSquare
            size={22}
            className="cursor-pointer"
            onClick={() => navigate("/create")}
          />

          <Heart size={22} className="cursor-pointer" />

          {/* AVATAR */}
          <img
            src={
              user?.avatar && user.avatar.trim() !== ""
                ? user.avatar
                : DEFAULT_AVATAR
            }
            alt="avatar"
            onClick={() => navigate("/profile")}
            className="w-8 h-8 rounded-full object-cover border bg-gray-100 cursor-pointer"
          />
        </div>

      </div>
    </nav>
  );
}
