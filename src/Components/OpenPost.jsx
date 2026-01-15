// import { X, Heart } from "lucide-react";
// import { useState } from "react";
// import postAPI from "../api/postApi";

// export default function OpenPost({ post, currentUserId, onClose }) {
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
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import postAPI from "../api/postApi";

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
  const isOwner = post.user?._id === currentUserId;

  const images = Array.isArray(post.images)
    ? post.images.map(getImageSrc)
    : [];

  /* ❤️ OPTIMISTIC LIKE */
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

  /* 💬 OPTIMISTIC COMMENT */
  const handleComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const temp = {
      _id: Date.now(),
      user: { username: "You" },
      text,
    };

    setComments((p) => [...p, temp]);
    setText("");

    try {
      const res = await postAPI.post(`/${post._id}/comment`, { text });
      setComments(res.data);
    } catch {
      setComments(post.comments || []);
    }
  };

  /* 🗑 DELETE POST */
  const handleDeletePost = async () => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await postAPI.delete(`/${post._id}`);
      onClose();
    } catch (err) {
      console.error("DELETE POST ERROR:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-5xl w-full h-[90vh] flex relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* IMAGE CAROUSEL */}
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
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex((i) => Math.max(i - 1, 0));
                }}
                className="absolute left-4 text-white"
              >
                <ChevronLeft size={32} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex((i) =>
                    Math.min(i + 1, images.length - 1)
                  );
                }}
                className="absolute right-4 text-white"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}
        </div>

        {/* DETAILS */}
        <div className="w-[400px] flex flex-col border-l">
         {/* HEADER */}
<div className="p-4 border-b flex justify-between items-center relative z-50">
  <b>{post.user?.username}</b>

  {isOwner && (
    <div className="relative z-50">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu((prev) => !prev);
        }}
        className="z-50"
      >
        <MoreHorizontal />
      </button>

      {showMenu && (
        <div
          className="absolute right-0 mt-2 bg-white border rounded shadow w-32 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeletePost();
            }}
            className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 flex items-center gap-2"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      )}
    </div>
  )}
</div>

          {/* COMMENTS */}
          <div className="flex-1 p-4 overflow-y-auto">
            {comments.map((c) => (
              <p key={c._id} className="mb-2">
                <b>{c.user?.username}</b> {c.text}
              </p>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="border-t p-3">
            <Heart
              onClick={toggleLike}
              fill={isLiked ? "#ed4956" : "none"}
              stroke={isLiked ? "#ed4956" : "black"}
              className="cursor-pointer"
            />
            <p className="font-semibold text-sm mt-1">
              {likes.length} likes
            </p>

            <form onSubmit={handleComment} className="flex mt-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 border px-2"
                placeholder="Add a comment..."
              />
              <button className="text-blue-500 px-2">Post</button>
            </form>
          </div>
        </div>

        {/* CLOSE */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 text-white"
        >
          <X size={28} />
        </button>
      </div>
    </div>
  );
}
