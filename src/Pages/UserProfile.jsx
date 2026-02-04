// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { Lock } from "lucide-react";
// import API from "../api/api";
// import Navbar from "../components/Navbar";

// export default function UserProfile() {
//   const { username } = useParams();

//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   /* =========================
//      FETCH USER PROFILE
//   ========================= */
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         setLoading(true);
//         const res = await API.get(`/users/${username}`);
//         setUser(res.data);
//       } catch (err) {
//         console.error("Failed to load profile", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [username]);

//   /* =========================
//      FETCH POSTS (PRIVATE LOGIC)
//   ========================= */
//   useEffect(() => {
//     if (!user) return;

//     // 🔒 Private + not following → no posts
//     if (user.isPrivate && !user.isFollowing) {
//       setPosts([]);
//       return;
//     }

//     const fetchPosts = async () => {
//       try {
//         const res = await API.get(`/posts/user/${user._id}`);
//         setPosts(Array.isArray(res.data) ? res.data : []);
//       } catch (err) {
//         console.error("Failed to load posts", err);
//       }
//     };

//     fetchPosts();
//   }, [user]);

//   /* =========================
//      FOLLOW / UNFOLLOW / REQUEST
//   ========================= */
//   const handleFollow = async () => {
//   try {
//     const res = await API.put(`/users/${user._id}/follow`);

//     if (res.data.status === "followed") {
//       setUser((prev) => ({
//         ...prev,
//         isFollowing: true,
//         isRequested: false,
//         followersCount: prev.followersCount + 1,
//       }));
//     }

//     if (res.data.status === "unfollowed") {
//       setUser((prev) => ({
//         ...prev,
//         isFollowing: false,
//         isRequested: false,
//         followersCount: Math.max(prev.followersCount - 1, 0),
//       }));
//       setPosts([]);
//     }

//     if (res.data.status === "requested") {
//       setUser((prev) => ({
//         ...prev,
//         isRequested: true,
//         isFollowing: false,
//       }));
//     }
//   } catch (error) {
//     console.error("Follow error:", error);
//   }
// };


//   if (loading) {
//     return (
//       <>
//         <Navbar />
//         <p className="mt-20 text-center">Loading...</p>
//       </>
//     );
//   }

//   if (!user) {
//     return (
//       <>
//         <Navbar />
//         <p className="mt-20 text-center text-gray-500">
//           User not found
//         </p>
//       </>
//     );
//   }

//   /* =========================
//      BUTTON STATE
//   ========================= */
//   const buttonText = user.isFollowing
//     ? "Following"
//     : user.isRequested
//     ? "Requested"
//     : "Follow";

//   const buttonClass = user.isFollowing || user.isRequested
//     ? "bg-gray-300 text-black"
//     : "bg-blue-500 text-white";

//   return (
//     <>
//       <Navbar />

//       <div className="pt-20 max-w-5xl mx-auto px-4">
//         {/* PROFILE HEADER */}
//         <div className="flex items-center gap-10">
//           <img
//             src={
//               user.avatar ||
//               "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png"
//             }
//             className="w-32 h-32 rounded-full border object-cover"
//             alt="avatar"
//           />

//           <div>
//             <div className="flex items-center gap-2">
//               <h2 className="text-2xl font-semibold">
//                 {user.username}
//               </h2>
//               {user.isPrivate && (
//                 <Lock size={18} className="text-gray-500" />
//               )}
//             </div>

//             {/* FOLLOW BUTTON */}
//             <div className="flex gap-4 mt-3">
//               <button
//                 onClick={handleFollow}
//                 disabled={user.isRequested}
//                 className={`px-6 py-1.5 rounded-md text-sm font-medium ${buttonClass}`}
//               >
//                 {buttonText}
//               </button>
//             </div>

//             {/* COUNTS */}
//             <div className="flex gap-6 mt-3 text-sm">
//               <span>
//                 <b>{user.followersCount || 0}</b> followers
//               </span>
//               <span>
//                 <b>{user.followingCount || 0}</b> following
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* PRIVATE MESSAGE */}
//         {user.isPrivate && !user.isFollowing && (
//           <div className="mt-12 text-center text-gray-500">
//             <p className="text-lg font-medium">
//               This Account is Private
//             </p>
//             <p className="text-sm mt-1">
//               Follow this account to see their posts.
//             </p>
//           </div>
//         )}

//         {/* POSTS */}
//         {!user.isPrivate || user.isFollowing ? (
//           <div className="grid grid-cols-3 gap-2 mt-8">
//             {posts.map((post) => (
//               <img
//                 key={post._id}
//                 src={post.images?.[0]}
//                 className="aspect-square object-cover"
//                 alt="post"
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import API from "../API/api";
import PostModal from "../Components/PostModal";

export default function UserProfile() {
  const { username } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  const currentUserId = localStorage.getItem("userId");

  /* =========================
     FETCH USER PROFILE
  ========================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/users/${username}`);
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  /* =========================
     FETCH POSTS (PRIVATE LOGIC)
  ========================= */
  useEffect(() => {
    if (!user) return;

    if (user.isPrivate && !user.isFollowing) {
      setPosts([]);
      return;
    }

    const fetchPosts = async () => {
      try {
        const res = await API.get(`/posts/user/${user._id}`);
        setPosts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load posts", err);
      }
    };

    fetchPosts();
  }, [user]);

  /* =========================
     FOLLOW / UNFOLLOW / REQUEST
  ========================= */
  const handleFollow = async () => {
    try {
      const res = await API.put(`/users/${user._id}/follow`);

      if (res.data.status === "followed") {
        setUser((prev) => ({
          ...prev,
          isFollowing: true,
          isRequested: false,
          followersCount: prev.followersCount + 1,
        }));
      }

      if (res.data.status === "unfollowed") {
        setUser((prev) => ({
          ...prev,
          isFollowing: false,
          isRequested: false,
          followersCount: Math.max(prev.followersCount - 1, 0),
        }));
        setPosts([]);
      }

      if (res.data.status === "requested") {
        setUser((prev) => ({
          ...prev,
          isRequested: true,
          isFollowing: false,
        }));
      }
    } catch (error) {
      console.error("Follow error:", error);
    }
  };

  /* =========================
     REMOVE POST FROM UI (AFTER DELETE)
  ========================= */
  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  if (loading) {
    return (
      <>
        <p className="mt-20 text-center">Loading...</p>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <p className="mt-20 text-center text-gray-500">
          User not found
        </p>
      </>
    );
  }

  const buttonText = user.isFollowing
    ? "Following"
    : user.isRequested
      ? "Requested"
      : "Follow";

  const buttonClass =
    user.isFollowing || user.isRequested
      ? "bg-gray-300 text-black"
      : "bg-blue-500 text-white";

  return (
    <>
      <div className="pt-20 max-w-5xl mx-auto px-4">
        {/* PROFILE HEADER */}
        <div className="flex gap-8 py-8">
          <img
            src={
              user.avatar ||
              "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png"
            }
            className="w-24 h-24 md:w-36 md:h-36 rounded-full border object-cover"
            alt="avatar"
          />

          <div>
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-xl font-light">
                {user.username}
              </h2>
              {user.isPrivate && (
                <Lock size={18} className="text-gray-500" />
              )}
            </div>

            <div className="flex gap-3 mb-4">
              <button
                onClick={handleFollow}
                disabled={user.isRequested}
                className={`px-6 py-1.5 rounded-lg text-sm font-semibold ${buttonClass}`}
              >
                {buttonText}
              </button>

              {/* MESSAGE BUTTON */}
              {user.isFollowing && (
                <button
                  onClick={() => navigate("/messages", { state: { userId: user._id } })}
                  className="px-6 py-1.5 bg-gray-200 text-black rounded-lg text-sm font-semibold"
                >
                  Message
                </button>
              )}
            </div>

            <div className="flex gap-6 mb-4 text-sm">
              <span>
                <b>{user.followersCount || 0}</b> followers
              </span>
              <span>
                <b>{user.followingCount || 0}</b> following
              </span>
            </div>

            {/* BIO & NAME */}
            <div className="text-sm">
              {user.name && <div className="font-semibold">{user.name}</div>}
              <p className="whitespace-pre-line">{user.bio}</p>
            </div>
          </div>
        </div>

        {/* PRIVATE MESSAGE */}
        {user.isPrivate && !user.isFollowing && (
          <div className="mt-12 text-center text-gray-500">
            <p className="text-lg font-medium">
              This Account is Private
            </p>
            <p className="text-sm mt-1">
              Follow this account to see their posts.
            </p>
          </div>
        )}

        {/* POSTS */}
        {!user.isPrivate || user.isFollowing ? (
          <div className="grid grid-cols-3 gap-2 mt-8">
            {posts.map((post) => (
              <img
                key={post._id}
                src={post.images?.[0]}
                className="aspect-square object-cover cursor-pointer"
                alt="post"
                onClick={() => setSelectedPost(post)}
              />
            ))}
          </div>
        ) : null}
      </div>

      {/* POST MODAL */}
      {selectedPost !== null && (
        <PostModal
          post={selectedPost}
          currentUserId={currentUserId}
          onClose={() => setSelectedPost(null)}
          onDelete={handlePostDeleted}
        />
      )}
    </>
  );
}
