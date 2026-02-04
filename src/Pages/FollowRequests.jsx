import { useEffect, useState } from "react";
import { User, X, Check } from "lucide-react";
import API from "../API/api"; // Ensure you have this configured
import { useNavigate } from "react-router-dom";

export default function FollowRequests() {
  const [requests, setRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
    fetchSuggestions();
  }, []);

  /* =========================
     FETCH DATA
  ========================= */
  const fetchRequests = async () => {
    try {
      const res = await API.get("/users/follow-requests");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const res = await API.get("/users/suggestions");
      setSuggestions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     HANDLERS
  ========================= */
  const handleConfirm = async (userId) => {
    try {
      await API.post("/users/follow-requests/respond", {
        requesterId: userId,
        action: "accept",
      });
      setRequests((prev) => prev.filter((r) => r._id !== userId));
    } catch (err) {
      console.error("Failed to confirm", err);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await API.post("/users/follow-requests/respond", {
        requesterId: userId,
        action: "reject", // Backend expects 'reject' for delete/decline
      });
      setRequests((prev) => prev.filter((r) => r._id !== userId));
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const handleFollowSuggestion = async (userId) => {
    // Implement follow logic similar to other pages
    try {
      await API.put(`/users/${userId}/follow`);
      // Optimistic remove from list
      setSuggestions((prev) => prev.filter(u => u._id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4 mt-8">
      {/* REQUESTS SECTION */}
      <h2 className="font-bold text-xl mb-6">Follow Requests</h2>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-10 text-gray-500 border rounded-lg bg-gray-50 mb-10">
          <User size={48} className="mx-auto mb-3 text-gray-300" />
          <p>No pending follow requests.</p>
        </div>
      ) : (
        <div className="space-y-4 mb-10">
          {requests.map((user) => (
            <div key={user._id} className="flex items-center justify-between">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate(`/user/${user.username}`)}
              >
                <img
                  src={
                    user.avatar ||
                    "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png"
                  }
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-sm">{user.username}</h3>
                  <p className="text-gray-500 text-sm">{user.name}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleConfirm(user._id)}
                  className="bg-[#0095f6] text-white px-5 py-1.5 rounded-lg text-sm font-semibold hover:bg-[#1877f2]"
                >
                  Confirm
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="bg-gray-100 text-black px-5 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUGGESTIONS SECTION */}
      <h3 className="font-bold text-lg mb-4 text-gray-700">Suggested for you</h3>
      <div className="space-y-4">
        {suggestions.map((user) => (
          <div key={user._id} className="flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate(`/user/${user.username}`)}
            >
              <img
                src={
                  user.avatar ||
                  "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png"
                }
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-sm">{user.username}</h3>
                <p className="text-gray-500 text-xs">Suggested for you</p>
              </div>
            </div>
            <button
              onClick={() => handleFollowSuggestion(user._id)}
              className="bg-[#0095f6] text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-[#1877f2]"
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
