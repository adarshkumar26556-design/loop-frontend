// import { X, Heart } from "lucide-react";
// import { useState } from "react";
// import postAPI from "../api/postApi";

import API from "../API/api";
//   if (!post) return null;

//   // 🔥 SAFE NORMALIZATION
//   const initialLikes = Array.isArray(post.likes) ? post.likes : [];
//   const initialComments = Array.isArray(post.comments) ? post.comments : [];

//   const [likes, setLikes] = useState(initialLikes);
//   const [comments, setComments] = useState(initialComments);
//   const [text, setText] = useState("");

//   const isLiked = likes.includes(currentUserId);

//   const handleLike = async () => {
//     const res = await postAPI.put(`/${post._id}/like`);
//     setLikes(res.data.likes || []);
//   };

//   const handleComment = async (e) => {
//     e.preventDefault();
//     if (!text.trim()) return;

//     const res = await postAPI.post(
//       `/${post._id}/comment`,
//       { text }
//     );

//     setComments(res.data || []);
//     setText("");
//   };

//   return (
//     <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
//       <div className="bg-white w-full max-w-4xl h-[80vh] rounded-lg flex relative">

//         <button onClick={onClose} className="absolute top-3 right-3">
//           <X />
//         </button>

//         <div className="w-1/2 bg-black flex items-center justify-center">
//           <img
//             src={post.images[0]}
//             className="max-w-full max-h-full object-contain"
//           />
//         </div>

//         <div className="w-1/2 flex flex-col">
//           <div className="p-4 border-b">
//             <b>{post.user?.username}</b> {post.caption}
//           </div>

//           <div className="flex-1 p-4 overflow-y-auto">
//             {comments.map((c, i) => (
//               <p key={i}>
//                 <b>{c.user?.username}</b> {c.text}
//               </p>
//             ))}
//           </div>

//           <div className="p-4 border-t">
//             <div className="flex items-center gap-3 mb-2">
//               <Heart
//                 onClick={handleLike}
//                 className={`cursor-pointer ${
//                   isLiked ? "fill-red-500 text-red-500" : ""
//                 }`}
//               />
//               <span>{likes.length} likes</span>
//             </div>

//             <form onSubmit={handleComment} className="flex gap-2">
//               <input
//                 value={text}
//                 onChange={(e) => setText(e.target.value)}
//                 className="flex-1 border px-3 py-1"
//                 placeholder="Add a comment..."
//               />
//               <button className="text-blue-500">Post</button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import {
  X,
  Heart,
  Bookmark,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import postAPI from "../API/postApi";

/* IMAGE NORMALIZER */
const getImageSrc = (img) => {
  if (!img) return null;
  if (img.startsWith("http")) return img;
  return `http://localhost:3000${img.startsWith("/") ? img : "/" + img}`;
};

export default function OpenPost({ post, currentUserId, onClose }) {
  if (!post) return null;

  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [text, setText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [index, setIndex] = useState(0);

  const isLiked = likes.includes(currentUserId);

  const images = Array.isArray(post.images)
    ? post.images.map(getImageSrc)
    : [];

  const isOwner =
    currentUserId &&
    (post.user?._id === currentUserId ||
      post.user === currentUserId ||
      post.user?._id?.toString() === currentUserId ||
      post.user?.toString() === currentUserId);

  /* ❤️ LIKE */
  const toggleLike = async () => {
    setLikes((prev) =>
      prev.includes(currentUserId)
        ? prev.filter((id) => id !== currentUserId)
        : [...prev, currentUserId]
    );

    try {
      const res = await postAPI.put(`/${post._id}/like`);
      setLikes(res.data.likes || []);
    } catch {
      setLikes(post.likes || []);
    }
  };

  /* 💬 COMMENT */
  const handleComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const temp = {
      _id: Date.now(),
      user: { username: "posting..." },
      text,
    };

    setComments((p) => [...p, temp]);
    setText("");

    try {
      const res = await postAPI.post(`/${post._id}/comments`, { text });
      setComments(res.data);
    } catch {
      setComments(post.comments || []);
    }
  };

  /* ❤️ LIKE COMMENT */
  const handleLikeComment = async (commentId) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c._id === commentId) {
          const isLiked = c.likes?.includes(currentUserId);
          return {
            ...c,
            likes: isLiked
              ? c.likes.filter((id) => id !== currentUserId)
              : [...(c.likes || []), currentUserId],
          };
        }
        return c;
      })
    );

    try {
      const token = localStorage.getItem("token");
      await postAPI.put(`/${post._id}/comments/${commentId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Like comment failed", error);
    }
  };

  /* 💾 SAVE POST */
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Check if saved
    API.get("/users/getmyprofile").then((res) => {
      if (res.data.savedPosts && res.data.savedPosts.includes(post._id)) {
        setIsSaved(true);
      }
    });
  }, [post._id]);

  const handleSave = async () => {
    try {
      // Optimistic
      setIsSaved((prev) => !prev);
      await API.put(`/users/${post._id}/save`);
    } catch {
      setIsSaved((prev) => !prev);
    }
  };

  /* 🗑 DELETE POST */
  const handleDeletePost = async () => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await postAPI.delete(`/${post._id}`);
      onClose();
      window.location.reload();
    } catch (err) {
      console.error("DELETE POST ERROR:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-6xl h-[90vh] flex overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* LEFT: IMAGE */}
        <div
          className="flex-1 bg-black flex items-center justify-center relative"
          onDoubleClick={toggleLike}
        >
          {images[index] && (
            <img
              src={images[index]}
              className="max-h-full max-w-full object-contain"
              alt="post"
            />
          )}

          {images.length > 1 && (
            <>
              <button
                onClick={() => setIndex((i) => Math.max(i - 1, 0))}
                className="absolute left-4 text-white/70 hover:text-white"
              >
                <ChevronLeft size={30} />
              </button>
              <button
                onClick={() =>
                  setIndex((i) => Math.min(i + 1, images.length - 1))
                }
                className="absolute right-4 text-white/70 hover:text-white"
              >
                <ChevronRight size={30} />
              </button>
            </>
          )}
        </div>

        {/* RIGHT: DETAILS */}
        <div className="w-[400px] md:w-[500px] flex flex-col bg-white border-l">
          {/* HEADER */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={
                  post.user?.avatar ||
                  "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png"
                }
                className="w-8 h-8 rounded-full object-cover border"
              />
              <span className="font-semibold text-sm">
                {post.user?.username}
              </span>
            </div>

            {isOwner && (
              <div className="relative">
                <MoreHorizontal
                  className="cursor-pointer"
                  onClick={() => setShowMenu(!showMenu)}
                />
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                    <button
                      onClick={handleDeletePost}
                      className="w-full text-left px-4 py-3 text-red-500 hover:bg-gray-50 text-sm font-medium"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setShowMenu(false)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* COMMENTS */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {post.caption && (
              <div className="flex gap-3">
                <img
                  src={post.user?.avatar}
                  className="w-8 h-8 rounded-full border"
                />
                <div className="text-sm">
                  <span className="font-semibold mr-2">
                    {post.user?.username}
                  </span>
                  {post.caption}
                </div>
              </div>
            )}

            {comments.map((c, i) => {
              const isLiked = c.likes?.includes(currentUserId);
              return (
                <div key={i} className="flex justify-between items-start group">
                  <div className="flex gap-3">
                    <img
                      src={c.user?.avatar || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"}
                      className="w-8 h-8 rounded-full border object-cover"
                    />
                    <div className="text-sm">
                      <p>
                        <span className="font-semibold mr-2">
                          {c.user?.username || "User"}
                        </span>
                        {c.text}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>{new Date(c.createdAt || Date.now()).toLocaleDateString()}</span>
                        {c.likes?.length > 0 && (
                          <span>{c.likes.length} likes</span>
                        )}
                        <button className="font-semibold">Reply</button>
                      </div>
                    </div>
                  </div>

                  <Heart
                    size={14}
                    className={`cursor-pointer mt-1 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-gray-600"}`}
                    onClick={() => handleLikeComment(c._id)}
                  />
                </div>
              )
            })}
          </div>

          {/* FOOTER */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between mb-2">
              <Heart
                size={26}
                onClick={toggleLike}
                className={`cursor-pointer ${isLiked
                  ? "fill-red-500 text-red-500"
                  : "text-black hover:text-gray-500"
                  }`}
              />
              <Bookmark
                size={26}
                onClick={handleSave}
                className={`cursor-pointer hover:text-gray-500 ${isSaved ? "fill-black text-black" : ""
                  }`}
              />
            </div>

            <div className="font-semibold text-sm">
              {likes.length} likes
            </div>
          </div>

          {/* ADD COMMENT */}
          <form
            onSubmit={handleComment}
            className="border-t p-3 flex items-center"
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 outline-none text-sm"
              placeholder="Add a comment..."
            />
            <button
              type="submit"
              disabled={!text.trim()}
              className="text-blue-500 font-semibold text-sm disabled:opacity-50 ml-2"
            >
              Post
            </button>
          </form>
        </div>
      </div>

      {/* CLOSE */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white"
      >
        <X size={30} />
      </button>
    </div>
  );
}
