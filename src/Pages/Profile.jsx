import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Bookmark, Layers } from "lucide-react";
import API from "../API/api";
import postAPI from "../API/postApi";
import OpenPost from "../Components/OpenPost";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]); // ✅ ADDED
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const userRes = await API.get("/users/getmyprofile");
        setUser(userRes.data);

        // Fetch User Posts
        const postRes = await postAPI.get(`/user/${userRes.data._id}`);
        setPosts(postRes.data);

        // Fetch Saved Posts (initially or lazy load)
        // Let's lazy load or just load if tab active?
        // Simpler to just load if we want to be safe, or separate effect.
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ✅ FETCH SAVED POSTS WHEN TAB CHANGES
  useEffect(() => {
    if (activeTab === "saved") {
      API.get("/users/saved")
        .then((res) => setSavedPosts(res.data))
        .catch((err) => console.error("Failed to load saved posts"));
    }
  }, [activeTab]);

  if (loading) {
    return (
      <>
        <div className="pt-20 flex justify-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <p className="pt-20 text-center text-red-500">{error}</p>
      </>
    );
  }

  if (!user) return null;

  /* ✅ FIXED COUNT LOGIC (SAFE & CORRECT) */
  const followersCount =
    typeof user.followersCount === "number"
      ? user.followersCount
      : Array.isArray(user.followers)
        ? user.followers.length
        : 0;

  const followingCount =
    typeof user.followingCount === "number"
      ? user.followingCount
      : Array.isArray(user.following)
        ? user.following.length
        : 0;

  const profileImage =
    user.avatar ||
    user.googleAvatar ||
    "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png";

  return (
    <>
      <div className="pt-16 max-w-4xl mx-auto px-4">
        {/* PROFILE HEADER */}
        <div className="flex gap-8 py-8">
          <img
            src={profileImage}
            alt="avatar"
            className="w-24 h-24 md:w-36 md:h-36 rounded-full object-cover border"
          />

          <div>
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-xl font-light">{user.username}</h2>
              <button
                onClick={() => navigate("/edit-profile")}
                className="px-4 py-1.5 bg-gray-200 rounded-lg text-sm font-semibold"
              >
                Edit profile
              </button>
            </div>

            <div className="flex gap-6 mb-4 text-sm">
              <span>
                <b>{posts.length}</b> posts
              </span>
              <span>
                <b>{followersCount}</b> followers
              </span>
              <span>
                <b>{followingCount}</b> following
              </span>
            </div>

            <p className="text-sm whitespace-pre-line">
              {user.bio || "No bio yet"}
            </p>
          </div>
        </div>

        {/* TABS */}
        <div className="border-t flex justify-center">
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-6 py-3 border-t-2 ${activeTab === "posts"
              ? "border-black text-black"
              : "border-transparent text-gray-400"
              }`}
          >
            <Grid size={14} /> POSTS
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={`px-6 py-3 border-t-2 ${activeTab === "saved"
              ? "border-black text-black"
              : "border-transparent text-gray-400"
              }`}
          >
            <Bookmark size={14} /> SAVED
          </button>
        </div>

        {/* POSTS GRID */}
        <div className="grid grid-cols-3 gap-1 md:gap-4 pb-10">
          {activeTab === "posts" &&
            posts.map((post) => {
              const imageSrc =
                Array.isArray(post.images) && post.images.length > 0
                  ? post.images[0]
                  : null;

              return (
                <div
                  key={post._id}
                  className="relative aspect-square bg-gray-100 overflow-hidden cursor-pointer group"
                  onClick={() =>
                    setSelectedPost({
                      ...post,
                      likes: Array.isArray(post.likes) ? post.likes : [],
                      comments: Array.isArray(post.comments)
                        ? post.comments
                        : [],
                    })
                  }
                >
                  {imageSrc && (
                    <img
                      src={imageSrc}
                      alt="post"
                      className="w-full h-full object-cover"
                    />
                  )}

                  {post.images?.length > 1 && (
                    <Layers className="absolute top-2 right-2 text-white w-5 h-5 drop-shadow" />
                  )}
                </div>
              );
            })}

          {activeTab === "posts" && posts.length === 0 && (
            <div className="col-span-3 text-center py-16">
              <Grid className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-xl font-light">No posts yet</p>
            </div>
          )}

          {/* ✅ SAVED POSTS GRID */}
          {activeTab === "saved" &&
            savedPosts.map((post) => {
              const imageSrc =
                Array.isArray(post.images) && post.images.length > 0
                  ? post.images[0]
                  : null;

              return (
                <div
                  key={post._id}
                  className="relative aspect-square bg-gray-100 overflow-hidden cursor-pointer group"
                  onClick={() =>
                    setSelectedPost({
                      ...post,
                      // Ensure user object is populated if backend sent it, otherwise might be partial
                      likes: Array.isArray(post.likes) ? post.likes : [],
                      comments: Array.isArray(post.comments)
                        ? post.comments
                        : [],
                    })
                  }
                >
                  {imageSrc && (
                    <img
                      src={imageSrc}
                      alt="post"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              );
            })}

          {activeTab === "saved" && savedPosts.length === 0 && (
            <div className="col-span-3 text-center py-16">
              <Bookmark className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-xl font-light">No saved posts</p>
            </div>
          )}
        </div>
      </div>

      {selectedPost && (
        <OpenPost
          post={selectedPost}
          currentUserId={user._id}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </>
  );
}
