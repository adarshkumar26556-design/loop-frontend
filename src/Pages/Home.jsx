import { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import postAPI from "../api/postApi";
import Navbar from "../components/Navbar";
import CommentModal from "../Components/CommentModal";


export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await postAPI.get("/");
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Fetch posts error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await postAPI.put(`/${postId}/like`);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likes: res.data.likes } : p
        )
      );
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-400">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-xl mx-auto pb-20 mt-14">
        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p>No posts yet</p>
          </div>
        ) : (
          posts.map((post) => {
            const isLiked = post.likes?.some(
              (id) => id.toString() === currentUserId
            );

            return (
              <div key={post._id} className="bg-white border-b mb-4">
                {/* HEADER */}
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                      {post.user?.username?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="font-semibold text-sm">
                      {post.user?.username || "User"}
                    </span>
                  </div>
                  <MoreHorizontal size={20} />
                </div>

                {/* IMAGE */}
                <div className="relative w-full bg-black">
                  {post.images?.length > 0 ? (
                    <img
                      src={post.images[0]}
                      alt="post"
                      className="w-full object-cover max-h-96"
                    />
                  ) : (
                    <div className="w-full h-96 flex items-center justify-center text-white">
                      No Image
                    </div>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-4">
                      <button onClick={() => handleLike(post._id)}>
                        <Heart
                          key={isLiked ? "liked" : "unliked"}
                          size={24}
                          className={
                            isLiked ? "text-red-500 fill-red-500" : ""
                          }
                          fill={isLiked ? "currentColor" : "none"}
                        />
                      </button>

                      <MessageCircle
                        size={24}
                        className="cursor-pointer"
                        onClick={() => setSelectedPost(post)}
                      />

                      <Send size={24} />
                    </div>
                    <Bookmark size={24} />
                  </div>

                  <p className="font-semibold text-sm mb-2">
                    {post.likes?.length || 0} likes
                  </p>

                  {post.caption && (
                    <p className="text-sm mb-2">
                      <span className="font-semibold mr-2">
                        {post.user?.username}
                      </span>
                      {post.caption}
                    </p>
                  )}

                  {post.comments?.length > 0 && (
                    <button
                      className="text-sm text-gray-400"
                      onClick={() => setSelectedPost(post)}
                    >
                      View all {post.comments.length} comments
                    </button>
                  )}

                  <p className="text-xs text-gray-400 uppercase mt-1">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* COMMENT MODAL */}
      {selectedPost && (
        <CommentModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </>
  );
}
