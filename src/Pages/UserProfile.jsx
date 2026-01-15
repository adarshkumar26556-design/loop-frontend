import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import API from "../api/api";
import Navbar from "../components/Navbar";

export default function UserProfile() {
  const { username } = useParams();

  const [user, setUser] = useState(null);
  const [isAllowed, setIsAllowed] = useState(true);
  const [loading, setLoading] = useState(true);

  const loggedInUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get(`/users/${username}`);

        // ✅ SAFE for ALL backend formats
        const fetchedUser = res.data?.user ?? res.data;

        if (!fetchedUser) {
          setUser(null);
          return;
        }

        setUser(fetchedUser);

        // 🔐 PRIVATE ACCOUNT CHECK (SAFE)
        if (fetchedUser.isPrivate === true) {
          const isFollower = fetchedUser.followers?.some(
            (f) =>
              f === loggedInUserId ||
              f?._id === loggedInUserId
          );

          setIsAllowed(!!isFollower);
        } else {
          setIsAllowed(true);
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  if (loading) {
    return (
      <>
        <Navbar />
        <p className="mt-20 text-center">Loading...</p>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <p className="mt-20 text-center text-gray-500">
          User not found
        </p>
      </>
    );
  }

  const isFollower = user.followers?.some(
    (f) =>
      f === loggedInUserId ||
      f?._id === loggedInUserId
  );

  const isRequested = user.followRequests?.includes(
    loggedInUserId
  );

  const handleFollow = async () => {
    const res = await API.put(`/users/${user._id}/follow`);

    if (res.data.status === "followed") {
      setUser({
        ...user,
        followers: [...user.followers, loggedInUserId],
      });
      setIsAllowed(true);
    }

    if (res.data.status === "unfollowed") {
      setUser({
        ...user,
        followers: user.followers.filter(
          (f) =>
            f !== loggedInUserId &&
            f?._id !== loggedInUserId
        ),
      });
      setIsAllowed(false);
    }

    if (res.data.status === "requested") {
      setUser({
        ...user,
        followRequests: [
          ...(user.followRequests || []),
          loggedInUserId,
        ],
      });
    }
  };

  return (
    <>
      <Navbar />

      <div className="pt-20 max-w-5xl mx-auto px-4">
        {/* PROFILE HEADER */}
        <div className="flex items-center gap-10">
          <img
            src={
              user.avatar ||
              "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png"
            }
            className="w-32 h-32 rounded-full border object-cover"
          />

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold">
                {user.username}
              </h2>
              {user.isPrivate && (
                <Lock size={18} className="text-gray-500" />
              )}
            </div>

            <div className="flex gap-4 mt-3">
              <button
                onClick={handleFollow}
                className={`px-6 py-1.5 rounded-md text-sm font-medium ${
                  isFollower
                    ? "bg-gray-300"
                    : isRequested
                    ? "bg-gray-200 text-gray-500"
                    : "bg-blue-500 text-white"
                }`}
              >
                {isFollower
                  ? "Following"
                  : isRequested
                  ? "Requested"
                  : "Follow"}
              </button>
            </div>

            <div className="flex gap-6 mt-3 text-sm">
              <span>
                <b>{user.followers?.length || 0}</b> followers
              </span>
              <span>
                <b>{user.following?.length || 0}</b> following
              </span>
            </div>
          </div>
        </div>

        {/* PRIVATE MESSAGE */}
        {!isAllowed && (
          <div className="mt-12 text-center text-gray-500">
            <p className="text-lg font-medium">
              This Account is Private
            </p>
            <p className="text-sm mt-1">
              Follow this account to see their posts.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
