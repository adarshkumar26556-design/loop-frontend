import { MoreVertical, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import API from "../API/api";

export default function PostModal({
  post,
  onClose,
  onDelete,
  currentUserId,
}) {
  const [showMenu, setShowMenu] = useState(false);

  if (!post) return null;

  // ✅ SAFE CHECK
  const isOwner =
    currentUserId &&
    (post.user === currentUserId ||
      post.user?._id === currentUserId ||
      post.user === currentUserId.toString());

  const handleDelete = async () => {
    const ok = window.confirm("Delete this post?");
    if (!ok) return;

    try {
      await API.delete(`/posts/${post._id}`);
      onDelete(post._id);
      onClose();
    } catch (err) {
      alert("Failed to delete post");
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="font-semibold">Post</span>

          <div className="flex items-center gap-3 relative">
            {isOwner && (
              <>
                <MoreVertical
                  className="cursor-pointer"
                  onClick={() => setShowMenu((p) => !p)}
                />
                {showMenu && (
                  <div className="absolute right-0 top-6 bg-white border rounded shadow text-sm">
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 text-red-500 hover:bg-gray-100 w-full text-left"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
            <X className="cursor-pointer" onClick={onClose} />
          </div>
        </div>

        {/* IMAGE */}
        <img
          src={post.images?.[0]}
          className="w-full h-[70vh] object-cover bg-black"
          alt="post"
        />
      </div>
    </div>,
    document.body
  );
}
