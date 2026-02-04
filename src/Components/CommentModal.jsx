// import { useEffect, useState } from "react";
// import { X } from "lucide-react";
// import postAPI from "../api/postApi";

// export default function CommentModal({ post, onClose }) {
//   const [comment, setComment] = useState("");
//   const [comments, setComments] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setComments(post?.comments || []);
//   }, [post]);

//   if (!post) return null;

//   const handleSend = async () => {
//     if (!comment.trim()) return;

//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const res = await postAPI.post(
//         `/${post._id}/comments`,
//         { text: comment },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setComments(res.data);
//       setComment("");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to add comment");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   // 🕒 Format time helper
//   const formatTime = (date) => {
//     return new Date(date).toLocaleString("en-IN", {
//       dateStyle: "medium",
//       timeStyle: "short",
//     });
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center overflow-auto">
//       {/* MODAL */}
//       <div className="bg-white w-full max-w-md rounded-lg overflow-hidden my-10">

//         {/* HEADER */}
//         <div className="flex items-center justify-between p-3 border-b">
//           <p className="font-semibold">
//             Comments ({comments.length})
//           </p>
//           <X className="cursor-pointer" onClick={onClose} />
//         </div>

//         {/* COMMENTS — AUTO HEIGHT (NO SCROLL) */}
//         <div className="p-3 space-y-4">
//           {comments.length > 0 ? (
//             comments.map((c) => (
//               <div key={c._id} className="text-sm">
//                 <div className="flex items-center gap-2">
//                   <span className="font-semibold">
//                     {c.user?.username ?? "Unknown"}
//                   </span>
//                   <span className="text-xs text-gray-400">
//                     {formatTime(c.createdAt)}
//                   </span>
//                 </div>
//                 <p className="ml-0.5 mt-0.5">{c.text}</p>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-400 text-sm">No comments yet</p>
//           )}
//         </div>

//         {/* INPUT */}
//         <div className="border-t p-3 flex items-center gap-2">
//           <input
//             type="text"
//             placeholder="Add a comment..."
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             onKeyDown={handleKeyDown}
//             disabled={loading}
//             className="flex-1 text-sm outline-none"
//           />
//           <button
//             onClick={handleSend}
//             disabled={loading || !comment.trim()}
//             className="text-blue-500 font-semibold text-sm disabled:opacity-40"
//           >
//             Post
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { X, Heart } from "lucide-react";
import postAPI from "../api/postApi";
import LikesListModal from "./LikesListModal";

export default function CommentModal({ post, onClose, onPostUpdate }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewingLikesForCommentId, setViewingLikesForCommentId] = useState(null);
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    setComments(post?.comments || []);
  }, [post]);

  if (!post) return null;

  const handleSend = async () => {
    if (!comment.trim()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await postAPI.post(
        `/${post._id}/comments`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedComments = res.data;
      setComments(updatedComments);
      if (onPostUpdate) {
        onPostUpdate({ ...post, comments: updatedComments });
      }
      setComment("");
    } catch (err) {
      console.error(err);
      alert("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    // 1. Calculate new comments state first (Pure calculation)
    const updatedComments = comments.map((c) => {
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
    });

    // 2. Update local state
    setComments(updatedComments);

    // 3. Update parent state immediately
    if (onPostUpdate) {
      onPostUpdate({ ...post, comments: updatedComments });
    }

    try {
      const token = localStorage.getItem("token");
      await postAPI.put(`/${post._id}/comments/${commentId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Like comment failed", error);
      // Optional: Revert state here if strict consistency is needed
    }
  };

  const formatShortTime = (date) => {
    if (!date) return "now";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "now";

    const seconds = Math.floor((new Date() - d) / 1000);
    if (seconds < 60) return `${Math.max(0, seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    const weeks = Math.floor(days / 7);
    return `${weeks}w`;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-end sm:items-center">
      {/* MODAL */}
      <div className="bg-white w-full sm:max-w-md h-[80vh] sm:h-[70vh] rounded-t-xl sm:rounded-xl flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <p className="font-semibold">Comments</p>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        {/* COMMENTS (SCROLL ONLY HERE) */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {comments.length > 0 ? (
            comments.map((c) => {
              const isLiked = c.likes?.includes(currentUserId);

              return (
                <div key={c._id} className="text-sm group">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3 w-full">
                      <img
                        src={c.user?.avatar || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <p className="leading-tight">
                          <span className="font-semibold mr-2 text-sm">
                            {c.user?.username ?? "Unknown"}
                          </span>
                          <span className="text-sm">{c.text}</span>
                        </p>

                        {/* METADATA LINE */}
                        <div className="flex items-center gap-3 mt-1 text-[12px] text-gray-500 font-medium h-4">
                          <span>{formatShortTime(c.createdAt)}</span>

                          {c.likes?.length > 0 && (
                            <span
                              className="font-semibold cursor-pointer hover:text-gray-900"
                              onClick={() => setViewingLikesForCommentId(c._id)}
                            >
                              {c.likes.length} like{c.likes.length > 1 ? "s" : ""}
                            </span>
                          )}

                          <button
                            className="text-gray-500 hover:text-gray-900 font-semibold"
                            onClick={() => setComment(`@${c.user?.username} `)}
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-1 pl-2">
                      <Heart
                        size={12}
                        className={`cursor-pointer transition-transform active:scale-75 ${isLiked
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400 hover:text-gray-600"
                          }`}
                        onClick={() => handleLikeComment(c._id)}
                      />
                    </div>
                  </div>

                  {/* NESTED REPLIES */}
                  {c.replies?.length > 0 && (
                    <div className="ml-11 mt-3 space-y-3">
                      {c.replies.map((r) => (
                        <div key={r._id} className="flex gap-3 items-start">
                          <img
                            src={r.user?.avatar || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"}
                            className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                          />
                          <div>
                            <p className="leading-tight text-sm">
                              <span className="font-semibold mr-2">
                                {r.user?.username ?? "Unknown"}
                              </span>
                              {r.text}
                            </p>
                            <div className="flex items-center gap-3 mt-1 text-[12px] text-gray-500 font-medium">
                              <span>{formatShortTime(r.createdAt)}</span>
                              <span className="cursor-pointer hover:text-gray-900 font-semibold">Reply</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {/* View more replies button could go here */}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-[1px] w-6 bg-gray-300"></div>
                        <span className="text-[12px] text-gray-500 font-semibold cursor-pointer">
                          View replies ({c.replies.length})
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-xl font-bold">No comments yet</p>
              <p className="text-sm text-gray-500">Start the conversation.</p>
            </div>
          )}
        </div>

        {/* INPUT (FIXED) */}
        <div className="border-t px-4 py-3 flex items-center gap-3">
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="flex-1 text-sm outline-none"
          />
          <button
            onClick={handleSend}
            disabled={loading || !comment.trim()}
            className="text-blue-500 font-semibold text-sm disabled:opacity-40"
          >
            Post
          </button>
        </div>

      </div>

      {/* COMMENT LIKES LIST MODAL */}
      {viewingLikesForCommentId && (
        <LikesListModal
          postId={post._id}
          commentId={viewingLikesForCommentId}
          onClose={() => setViewingLikesForCommentId(null)}
        />
      )}
    </div>
  );
}
