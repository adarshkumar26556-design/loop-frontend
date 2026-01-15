import { useEffect, useState } from "react";
import { X } from "lucide-react";
import postAPI from "../api/postApi";

export default function CommentModal({ post, onClose }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments(res.data);
      setComment("");
    } catch (err) {
      console.error(err);
      alert("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  // 🕒 Format time helper
  const formatTime = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center overflow-auto">
      {/* MODAL */}
      <div className="bg-white w-full max-w-md rounded-lg overflow-hidden my-10">

        {/* HEADER */}
        <div className="flex items-center justify-between p-3 border-b">
          <p className="font-semibold">
            Comments ({comments.length})
          </p>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        {/* COMMENTS — AUTO HEIGHT (NO SCROLL) */}
        <div className="p-3 space-y-4">
          {comments.length > 0 ? (
            comments.map((c) => (
              <div key={c._id} className="text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {c.user?.username ?? "Unknown"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatTime(c.createdAt)}
                  </span>
                </div>
                <p className="ml-0.5 mt-0.5">{c.text}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No comments yet</p>
          )}
        </div>

        {/* INPUT */}
        <div className="border-t p-3 flex items-center gap-2">
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
    </div>
  );
}
