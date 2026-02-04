import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import postAPI from "../api/postApi";
import API from "../api/api";
import CommentModal from "../Components/CommentModal";
import LikesListModal from "../Components/LikesListModal";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLikesModal, setShowLikesModal] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);



  const currentUserId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    fetchSuggestions();
  }, []);

  /* =========================
     FETCH POSTS (INSTAGRAM LOGIC)
  ========================= */
  const fetchPosts = async () => {
    try {
      const res = await postAPI.get("/");

      const filteredPosts = Array.isArray(res.data)
        ? res.data.filter((post) => {
          // ✅ PUBLIC ACCOUNT → ALWAYS SHOW
          if (!post.user?.isPrivate) return true;

          // 🔒 PRIVATE ACCOUNT → ONLY FOLLOWERS (FIXED)
          return post.user?.followers?.some(
            (f) =>
              f === currentUserId ||
              f?._id === currentUserId ||
              f?.toString?.() === currentUserId
          );
        })
        : [];

      setPosts(filteredPosts);
    } catch (error) {
      console.error("Fetch posts error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FETCH SUGGESTIONS
  ========================= */
  const fetchSuggestions = async () => {
    try {
      const res = await API.get("/users/suggestions");
      setSuggestions(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Fetch suggestions error:", error);
    }
  };

  /* =========================
     FOLLOW FROM SUGGESTIONS
  ========================= */
  const handleFollowSuggestion = async (userId) => {
    try {
      const res = await API.put(`/users/${userId}/follow`);

      setSuggestions((prev) =>
        prev.map((u) =>
          u._id === userId
            ? {
              ...u,
              isFollowing: res.data.status === "followed",
              isRequested: res.data.status === "requested",
            }
            : u
        )
      );
    } catch (error) {
      console.error("Follow suggestion error:", error);
    }
  };

  /* =========================
     LIKE / UNLIKE
  ========================= */
  const handleLike = async (postId) => {
    try {
      // Optimistic Update
      setPosts((prev) =>
        prev.map((p) => {
          if (p._id === postId) {
            const isLiked = p.likes?.some(id => id.toString() === currentUserId);
            return {
              ...p,
              likes: isLiked
                ? p.likes.filter(id => id.toString() !== currentUserId)
                : [...(p.likes || []), currentUserId]
            };
          }
          return p;
        })
      );

      const res = await postAPI.put(`/${postId}/like`);

      // Re-sync with server response to be safe
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likes: res.data.likes } : p
        )
      );
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  /* =========================
     IN-FEED COMMENT
  ========================= */
  const [commentTexts, setCommentTexts] = useState({});
  const [savedPostIds, setSavedPostIds] = useState([]); // ✅ STATE FOR SAVED POSTS

  useEffect(() => {
    fetchSavedPosts(); // ✅ FETCH SAVED ON MOUNT
  }, []);

  const fetchSavedPosts = async () => {
    try {
      const res = await API.get("/users/getmyprofile"); // Usually profile has savedPosts array
      // Or if there is a specific endpoint for just IDs. 
      // The getMyProfile usually returns the full user object including savedPosts
      if (res.data.savedPosts) {
        setSavedPostIds(res.data.savedPosts);
      }
    } catch (error) {
      console.error("Fetch saved error", error);
    }
  };

  const handleSave = async (postId) => {
    try {
      // Optimistic update
      const isSaved = savedPostIds.includes(postId);
      setSavedPostIds(prev => isSaved ? prev.filter(id => id !== postId) : [...prev, postId]);

      await API.put(`/users/${postId}/save`);
    } catch (error) {
      console.error("Save failed", error);
      // Revert if needed (optional)
    }
  };

  const handleCommentChange = (postId, text) => {
    setCommentTexts((prev) => ({ ...prev, [postId]: text }));
  };

  const handlePostComment = async (e, postId) => {
    e.preventDefault();
    const text = commentTexts[postId];
    if (!text?.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await postAPI.post(`/${postId}/comments`, { text }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Clear input
      setCommentTexts((prev) => ({ ...prev, [postId]: "" }));

      // Update only the specific post with new comments
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p._id === postId ? { ...p, comments: res.data } : p
        )
      );
    } catch (err) {
      console.error("Comment failed", err);
    }
  };

  /* =========================
     TIME AGO HELPER
  ========================= */
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + " YEARS AGO";
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + " MONTHS AGO";
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + " DAYS AGO";
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + " HOURS AGO";
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + " MINUTES AGO";
    return "JUST NOW";
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center gap-10 md:pt-8 px-4">
        {/* ================= FEED ================= */}
        <div className="max-w-xl w-full pb-20">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p>No posts yet</p>
            </div>
          ) : (
            posts.map((post) => {
              const isLiked = post.likes?.some(
                (id) => id && id.toString() === currentUserId
              );

              return (
                <div key={post._id} className="bg-white border-b mb-4">
                  {/* HEADER */}
                  <div className="flex items-center justify-between p-3">
                    <div
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() =>
                        navigate(`/user/${post.user?.username}`)
                      }
                    >
                      <img
                        src={
                          post.user?.avatar ||
                          "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png"
                        }
                        className="w-8 h-8 rounded-full object-cover border"
                        alt="avatar"
                      />
                      <span className="font-semibold text-sm">
                        {post.user?.username}
                      </span>
                    </div>
                    <MoreHorizontal size={20} />
                  </div>

                  {/* IMAGE - Double Tap to Like */}
                  <div
                    className="relative w-full bg-black cursor-pointer"
                    onDoubleClick={() => handleLike(post._id)}
                  >
                    <img
                      src={post.images?.[0]}
                      alt="post"
                      className="w-full object-cover max-h-[500px]"
                    />
                  </div>

                  {/* ACTIONS */}
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex gap-4">
                        <button onClick={() => handleLike(post._id)}>
                          <Heart
                            size={26}
                            className={`transition-colors duration-200 ${isLiked
                              ? "text-red-500 fill-red-500"
                              : "text-black hover:text-gray-500"
                              }`}
                          />
                        </button>

                        <MessageCircle
                          size={26}
                          className="cursor-pointer hover:text-gray-500"
                          onClick={() => setSelectedPost(post)}
                        />

                        <Send size={26} className="hover:text-gray-500" />
                      </div>
                      <Bookmark
                        size={26}
                        className={`cursor-pointer transition-colors duration-200 ${savedPostIds.includes(post._id) ? "fill-black text-black" : "hover:text-gray-500"
                          }`}
                        onClick={() => handleSave(post._id)}
                      />
                    </div>

                    <p className="font-semibold text-sm mb-2">
                      {post.likes?.length || 0} likes
                    </p>

                    {post.caption && (
                      <p className="text-sm mb-1">
                        <span className="font-semibold mr-2">
                          {post.user?.username}
                        </span>
                        {post.caption}
                      </p>
                    )}

                    {/* View Comments Link */}
                    {post.comments?.length > 0 && (
                      <p
                        className="text-gray-500 text-sm cursor-pointer mb-1"
                        onClick={() => setSelectedPost(post)}
                      >
                        View all {post.comments.length} comments
                      </p>
                    )}

                    {/* Timestamp */}
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-3">
                      {timeAgo(post.createdAt)}
                    </p>

                    {/* Inline Comment Input */}
                    <form
                      className="border-t pt-3 flex items-center gap-2"
                      onSubmit={(e) => handlePostComment(e, post._id)}
                    >
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="flex-1 text-sm outline-none bg-transparent"
                        value={commentTexts[post._id] || ""}
                        onChange={(e) => handleCommentChange(post._id, e.target.value)}
                      />
                      {commentTexts[post._id] && (
                        <button
                          type="submit"
                          className="text-blue-500 font-semibold text-sm"
                        >
                          Post
                        </button>
                      )}
                    </form>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ================= SUGGESTIONS ================= */}
        <div className="hidden lg:block w-80">
          <p className="text-sm font-semibold text-gray-500 mb-4">
            Suggestions for you
          </p>

          {suggestions.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between mb-4"
            >
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate(`/user/${user.username}`)}
              >
                <img
                  src={
                    user.avatar ||
                    "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png"
                  }
                  className="w-8 h-8 rounded-full object-cover border"
                  alt="avatar"
                />
                <span className="text-sm font-semibold">
                  {user.username}
                </span>
              </div>

              <button
                onClick={() => handleFollowSuggestion(user._id)}
                className={`text-sm font-semibold ${user.isFollowing || user.isRequested
                  ? "text-gray-400"
                  : "text-blue-500"
                  }`}
              >
                {user.isFollowing
                  ? "Following"
                  : user.isRequested
                    ? "Requested"
                    : "Follow"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* COMMENT MODAL */}
      {
        selectedPost && (
          <CommentModal
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
            onPostUpdate={(updatedPost) => {
              setPosts((prev) =>
                prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
              );
              setSelectedPost(updatedPost);
            }}
          />
        )
      }

      {/* LIKES MODAL */}
      {
        showLikesModal && (
          <LikesListModal
            postId={showLikesModal}
            onClose={() => setShowLikesModal(null)}
          />
        )
      }
    </>
  );
}
