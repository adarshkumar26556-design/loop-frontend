import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";

export default function FollowRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    API.get("/users/follow-requests").then((res) =>
      setRequests(res.data)
    );
  }, []);

  const respond = async (id, action) => {
    await API.post("/users/follow-requests/respond", {
      requesterId: id,
      action,
    });

    setRequests(requests.filter((r) => r._id !== id));
  };

  return (
    <>
      <Navbar />
      <div className="pt-20 max-w-md mx-auto px-4">
        <h2 className="text-xl font-semibold mb-4">
          Follow Requests
        </h2>

        {requests.length === 0 && (
          <p className="text-gray-500">No requests</p>
        )}

        {requests.map((u) => (
          <div
            key={u._id}
            className="flex items-center justify-between py-3 border-b"
          >
            <div className="flex items-center gap-3">
              <img
                src={u.avatar}
                className="w-10 h-10 rounded-full"
              />
              <span className="font-medium">
                {u.username}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => respond(u._id, "accept")}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
              >
                Accept
              </button>
              <button
                onClick={() => respond(u._id, "reject")}
                className="px-3 py-1 bg-gray-300 rounded text-sm"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
