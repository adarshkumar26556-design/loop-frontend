// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import API from "../api/api";
// import postAPI from "../api/postApi";
// import Navbar from "../components/Navbar";

// export default function Profile() {
//   const { username } = useParams();
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const userRes = username
//           ? await API.get(`/${username}`)
//           : await API.get("/users/getmyprofile");


//         setUser(userRes.data);

//         const postRes = await postAPI.get(
//           `/user/${userRes.data._id}`
//         );
//         setPosts(postRes.data);

//       } catch (error) {
//         navigate("/", { replace: true });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [username, navigate]);

//   if (loading) {
//     return <p className="mt-24 text-center">Loading...</p>;
//   }

//   if (!user) {
//     return <p className="mt-24 text-center">User not found</p>;
//   }

//   return (
//     <>
//       <Navbar />

//       <div className="pt-24 max-w-5xl mx-auto px-4">

//         {/* PROFILE HEADER */}
//         <div className="flex flex-col sm:flex-row sm:items-center gap-8">

//           {/* AVATAR */}
//           <div className="flex justify-center sm:justify-start">
//             <img
//               src={
//                 user.avatar ||
//                 "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png"
//               }
//               alt="avatar"
//               className="w-32 h-32 rounded-full border object-cover"
//             />
//           </div>

//           {/* USER INFO */}
//           <div className="flex-1 text-center sm:text-left">

//             <div className="flex flex-col sm:flex-row sm:items-center gap-4">
//               <h2 className="text-2xl font-semibold">
//                 {user.username}
//               </h2>

//               {!username && (
//                 <button
//                   onClick={() => navigate("/edit-profile")}
//                   className="px-4 py-1.5 border rounded text-sm"
//                 >
//                   Edit Profile
//                 </button>
//               )}
//             </div>

//             {/* STATS */}
//             <div className="flex justify-center sm:justify-start gap-8 mt-4 text-sm">
//               <span><b>{posts.length}</b> posts</span>
//               <span><b>{user.followersCount || 0}</b> followers</span>
//               <span><b>{user.followingCount || 0}</b> following</span>
//             </div>

//             {/* BIO */}
//             <p className="mt-4 text-sm text-gray-700 max-w-md mx-auto sm:mx-0">
//               {user.bio || "No bio yet"}
//             </p>
//           </div>
//         </div>

//         {/* POSTS GRID */}
//         <div className="grid grid-cols-3 gap-[2px] mt-12">
//           {posts.map((post) => (
//             <div key={post._id} className="aspect-square bg-gray-100">
//               <img
//                 src={post.image}
//                 alt="post"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../api/api";
// import postAPI from "../api/postApi";
// import Navbar from "../components/Navbar";

// export default function Profile() {
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const userRes = await API.get("/users/getmyprofile");
//         setUser(userRes.data);

//         const postRes = await postAPI.get(`/user/${userRes.data._id}`);
//         setPosts(postRes.data);

//       } catch (err) {
//         setError("Failed to load profile");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   // ⏳ LOADING STATE
//   if (loading) {
//     return (
//       <>
//         <Navbar />
//         <p className="mt-24 text-center">Loading...</p>
//       </>
//     );
//   }

//   // ❌ ERROR STATE
//   if (error) {
//     return (
//       <>
//         <Navbar />
//         <p className="mt-24 text-center text-red-500">{error}</p>
//       </>
//     );
//   }

//   // ❌ SAFETY GUARD (THIS FIXES THE CRASH)
//   if (!user) {
//     return (
//       <>
//         <Navbar />
//         <p className="mt-24 text-center">User not available</p>
//       </>
//     );
//   }

//   // ✅ SAFE IMAGE LOGIC (NO MODEL CHANGE)
//   const profileImage =
//     user.avatar ||
//     user.googleAvatar ||
//     "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png";

//   return (
//     <>
//       <Navbar />

//       <div className="pt-24 max-w-5xl mx-auto px-4">

//         {/* PROFILE HEADER */}
//         <div className="flex flex-col sm:flex-row sm:items-center gap-8">

//           {/* AVATAR */}
//           <div className="flex justify-center sm:justify-start">
//             <img
//               src={profileImage}
//               alt="avatar"
//               className="w-32 h-32 rounded-full border object-cover"
//             />
//           </div>

//           {/* USER INFO */}
//           <div className="flex-1 text-center sm:text-left">

//             <div className="flex flex-col sm:flex-row sm:items-center gap-4">
//               <h2 className="text-2xl font-semibold">
//                 {user.username}
//               </h2>

//               <button
//                 onClick={() => navigate("/edit-profile")}
//                 className="px-4 py-1.5 border rounded text-sm"
//               >
//                 Edit Profile
//               </button>
//             </div>

//             {/* STATS */}
//             <div className="flex justify-center sm:justify-start gap-8 mt-4 text-sm">
//               <span><b>{posts.length}</b> posts</span>
//               <span><b>{user.followersCount || 0}</b> followers</span>
//               <span><b>{user.followingCount || 0}</b> following</span>
//             </div>

//             {/* BIO */}
//             <p className="mt-4 text-sm text-gray-700 max-w-md mx-auto sm:mx-0">
//               {user.bio || "No bio yet"}
//             </p>
//           </div>
//         </div>

//         {/* POSTS GRID */}
//         <div className="grid grid-cols-3 gap-[2px] mt-12">
//           {posts.map((post) => (
//             <div key={post._id} className="aspect-square bg-gray-100">
//               <img
//                 src={post.image}
//                 alt="post"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Grid, Bookmark, Settings, MoreHorizontal } from "lucide-react";
// import API from "../api/api";
// import postAPI from "../api/postApi";
// import Navbar from "../components/Navbar";

// export default function Profile() {
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [activeTab, setActiveTab] = useState("posts");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const userRes = await API.get("/users/getmyprofile");
//         setUser(userRes.data);

//         const postRes = await postAPI.get(`/user/${userRes.data._id}`);
//         setPosts(postRes.data);

//       } catch (err) {
//         setError("Failed to load profile");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   // ⏳ LOADING STATE
//   if (loading) {
//     return (
//       <>
//         <Navbar />
//         <div className="pt-20 flex items-center justify-center min-h-screen">
//           <div className="text-center">
//             <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading...</p>
//           </div>
//         </div>
//       </>
//     );
//   }

//   // ❌ ERROR STATE
//   if (error) {
//     return (
//       <>
//         <Navbar />
//         <div className="pt-20 flex items-center justify-center min-h-screen">
//           <p className="text-red-500">{error}</p>
//         </div>
//       </>
//     );
//   }

//   // ❌ SAFETY GUARD
//   if (!user) {
//     return (
//       <>
//         <Navbar />
//         <div className="pt-20 flex items-center justify-center min-h-screen">
//           <p className="text-gray-600">User not available</p>
//         </div>
//       </>
//     );
//   }

//   // ✅ SAFE IMAGE LOGIC
//   const profileImage =
//     user.avatar ||
//     user.googleAvatar ||
//     "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png";

//   return (
//     <>
//       <Navbar />
      
//       <div className="pt-16 min-h-screen bg-white">
//         <div className="max-w-4xl mx-auto px-4">
//           {/* Profile Section */}
//           <div className="py-8">
//             <div className="flex items-start gap-8 mb-8">
//               {/* Avatar */}
//               <div className="flex-shrink-0">
//                 <div className="w-20 h-20 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-gray-200">
//                   <img
//                     src={profileImage}
//                     alt={user.username}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               </div>

//               {/* Info */}
//               <div className="flex-1 min-w-0">
//                 {/* Username & Actions */}
//                 <div className="flex items-center gap-4 mb-5">
//                   <h2 className="text-xl font-light">{user.username}</h2>
//                   <button 
//                     onClick={() => navigate("/edit-profile")}
//                     className="px-6 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-sm transition-colors"
//                   >
//                     Edit profile
//                   </button>
                  
//                 </div>

//                 {/* Stats - Desktop */}
//                 <div className="hidden md:flex gap-8 mb-5 text-base">
//                   <div>
//                     <span className="font-semibold">{posts.length}</span> posts
//                   </div>
//                   <div className="cursor-pointer hover:text-gray-600">
//                     <span className="font-semibold">{user.followersCount || 0}</span> followers
//                   </div>
//                   <div className="cursor-pointer hover:text-gray-600">
//                     <span className="font-semibold">{user.followingCount || 0}</span> following
//                   </div>
//                 </div>

//                 {/* Bio */}
//                 <div className="text-sm">
//                   <p className="whitespace-pre-line">{user.bio || "No bio yet"}</p>
//                   {user.website && (
//                     <a 
//                       href={`https://${user.website}`}
//                       className="text-blue-900 font-semibold hover:underline"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       {user.website}
//                     </a>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Stats - Mobile */}
//             <div className="flex md:hidden justify-around border-t border-b py-3 text-sm text-center">
//               <div>
//                 <div className="font-semibold">{posts.length}</div>
//                 <div className="text-gray-500">posts</div>
//               </div>
//               <div className="cursor-pointer">
//                 <div className="font-semibold">{user.followersCount || 0}</div>
//                 <div className="text-gray-500">followers</div>
//               </div>
//               <div className="cursor-pointer">
//                 <div className="font-semibold">{user.followingCount || 0}</div>
//                 <div className="text-gray-500">following</div>
//               </div>
//             </div>
//           </div>

//           {/* Tabs */}
//           <div className="border-t">
//             <div className="flex justify-center">
//               <button
//                 onClick={() => setActiveTab("posts")}
//                 className={`flex items-center gap-1.5 px-8 py-3 border-t-2 transition-colors ${
//                   activeTab === "posts"
//                     ? "border-black text-black"
//                     : "border-transparent text-gray-400"
//                 }`}
//               >
//                 <Grid className="w-3 h-3" />
//                 <span className="text-xs font-semibold uppercase tracking-wider">Posts</span>
//               </button>
//               <button
//                 onClick={() => setActiveTab("saved")}
//                 className={`flex items-center gap-1.5 px-8 py-3 border-t-2 transition-colors ${
//                   activeTab === "saved"
//                     ? "border-black text-black"
//                     : "border-transparent text-gray-400"
//                 }`}
//               >
//                 <Bookmark className="w-3 h-3" />
//                 <span className="text-xs font-semibold uppercase tracking-wider">Saved</span>
//               </button>
//             </div>
//           </div>

//           {/* Posts Grid */}
//           <div className="grid grid-cols-3 gap-1 md:gap-4 pb-8">
//             {activeTab === "posts" && posts.length > 0 && posts.map((post) => (
//               <div 
//                 key={post._id} 
//                 className="aspect-square bg-gray-100 cursor-pointer overflow-hidden group relative"
//               >
//                 <img
//                   src={post.image}
//                   alt="post"
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                 />
//                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
//               </div>
//             ))}

//             {activeTab === "posts" && posts.length === 0 && (
//               <div className="col-span-3 py-16 text-center">
//                 <Grid className="w-16 h-16 mx-auto mb-4 text-gray-300" />
//                 <p className="text-2xl font-light mb-2">No posts yet</p>
//                 <p className="text-gray-500 text-sm">When you share photos, they'll appear here</p>
//               </div>
//             )}
            
//             {activeTab === "saved" && (
//               <div className="col-span-3 py-16 text-center">
//                 <Bookmark className="w-16 h-16 mx-auto mb-4 text-gray-300" />
//                 <p className="text-2xl font-light mb-2">No saved posts yet</p>
//                 <p className="text-gray-500 text-sm">Save posts you like to see them here</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Grid, Bookmark, Layers } from "lucide-react";
// import API from "../api/api";
// import postAPI from "../api/postApi";
// import Navbar from "../components/Navbar";

// const BACKEND_URL = "http://localhost:3000";

// export default function Profile() {
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [activeTab, setActiveTab] = useState("posts");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const userRes = await API.get("/users/getmyprofile");
//         setUser(userRes.data);

//         const postRes = await postAPI.get(`/user/${userRes.data._id}`);
//         setPosts(postRes.data);
//       } catch (err) {
//         setError("Failed to load profile");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   if (loading) {
//     return (
//       <>
//         <Navbar />
//         <div className="pt-20 flex justify-center">
//           <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
//         </div>
//       </>
//     );
//   }

//   if (error) {
//     return (
//       <>
//         <Navbar />
//         <p className="pt-20 text-center text-red-500">{error}</p>
//       </>
//     );
//   }

//   if (!user) return null;

//   const profileImage =
//     user.avatar ||
//     user.googleAvatar ||
//     "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png";

//   return (
//     <>
//       <Navbar />

//       <div className="pt-16 max-w-4xl mx-auto px-4">
//         {/* Profile header */}
//         <div className="flex gap-8 py-8">
//           <img
//             src={profileImage}
//             alt="avatar"
//             className="w-24 h-24 md:w-36 md:h-36 rounded-full object-cover border"
//           />

//           <div>
//             <div className="flex items-center gap-4 mb-4">
//               <h2 className="text-xl font-light">{user.username}</h2>
//               <button
//                 onClick={() => navigate("/edit-profile")}
//                 className="px-4 py-1.5 bg-gray-200 rounded-lg text-sm font-semibold"
//               >
//                 Edit profile
//               </button>
//             </div>

//             <div className="flex gap-6 mb-4 text-sm">
//               <span>
//                 <b>{posts.length}</b> posts
//               </span>
//               <span>
//                 <b>{user.followersCount || 0}</b> followers
//               </span>
//               <span>
//                 <b>{user.followingCount || 0}</b> following
//               </span>
//             </div>

//             <p className="text-sm whitespace-pre-line">
//               {user.bio || "No bio yet"}
//             </p>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="border-t flex justify-center">
//           <button
//             onClick={() => setActiveTab("posts")}
//             className={`px-6 py-3 border-t-2 ${
//               activeTab === "posts"
//                 ? "border-black text-black"
//                 : "border-transparent text-gray-400"
//             }`}
//           >
//             <Grid size={14} /> POSTS
//           </button>
//           <button
//             onClick={() => setActiveTab("saved")}
//             className={`px-6 py-3 border-t-2 ${
//               activeTab === "saved"
//                 ? "border-black text-black"
//                 : "border-transparent text-gray-400"
//             }`}
//           >
//             <Bookmark size={14} /> SAVED
//           </button>
//         </div>

//         {/* Posts grid */}
//         <div className="grid grid-cols-3 gap-1 md:gap-4 pb-10">
//           {activeTab === "posts" &&
//             posts.map((post) => (
//               <div
//                 key={post._id}
//                 className="relative aspect-square bg-gray-100 overflow-hidden cursor-pointer group"
//               >
//                 {post.images?.[0] && (
//                   <img
//                     src={`${BACKEND_URL}${post.images[0]}`}
//                     alt="post"
//                     className="w-full h-full object-cover group-hover:scale-105 transition"
//                   />
//                 )}

//                 {/* Multi-image indicator */}
//                 {post.images?.length > 1 && (
//                   <Layers className="absolute top-2 right-2 text-white w-5 h-5 drop-shadow" />
//                 )}
//               </div>
//             ))}

//           {activeTab === "posts" && posts.length === 0 && (
//             <div className="col-span-3 text-center py-16">
//               <Grid className="w-16 h-16 mx-auto text-gray-300 mb-4" />
//               <p className="text-xl font-light">No posts yet</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Grid, Bookmark, Layers } from "lucide-react";
// import API from "../api/api";
// import postAPI from "../api/postApi";
// import Navbar from "../components/Navbar";

// /* 🔥 IMAGE URL NORMALIZER (FINAL FIX) */
// const getImageSrc = (img) => {
//   if (!img || typeof img !== "string") return null;

//   // If already full URL (Cloudinary etc.)
//   if (img.startsWith("http")) return img;

//   // Fix Windows paths
//   const cleaned = img.replace(/\\/g, "/");

//   // Ensure leading slash
//   const finalPath = cleaned.startsWith("/")
//     ? cleaned
//     : `/${cleaned}`;

//   return `http://localhost:3000${finalPath}`;
// };

// export default function Profile() {
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [activeTab, setActiveTab] = useState("posts");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const userRes = await API.get("/users/getmyprofile");
//         setUser(userRes.data);

//         const postRes = await postAPI.get(`/user/${userRes.data._id}`);
//         setPosts(postRes.data);
//       } catch (err) {
//         setError("Failed to load profile");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   /* ⏳ LOADING */
//   if (loading) {
//     return (
//       <>
//         <Navbar />
//         <div className="pt-20 flex justify-center">
//           <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
//         </div>
//       </>
//     );
//   }

//   /* ❌ ERROR */
//   if (error) {
//     return (
//       <>
//         <Navbar />
//         <p className="pt-20 text-center text-red-500">{error}</p>
//       </>
//     );
//   }

//   if (!user) return null;

//   const profileImage =
//     user.avatar ||
//     user.googleAvatar ||
//     "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png";

//   return (
//     <>
//       <Navbar />

//       <div className="pt-16 max-w-4xl mx-auto px-4">
//         {/* PROFILE HEADER */}
//         <div className="flex gap-8 py-8">
//           <img
//             src={profileImage}
//             alt="avatar"
//             className="w-24 h-24 md:w-36 md:h-36 rounded-full object-cover border"
//           />

//           <div>
//             <div className="flex items-center gap-4 mb-4">
//               <h2 className="text-xl font-light">{user.username}</h2>
//               <button
//                 onClick={() => navigate("/edit-profile")}
//                 className="px-4 py-1.5 bg-gray-200 rounded-lg text-sm font-semibold"
//               >
//                 Edit profile
//               </button>
//             </div>

//             <div className="flex gap-6 mb-4 text-sm">
//               <span>
//                 <b>{posts.length}</b> posts
//               </span>
//               <span>
//                 <b>{user.followersCount || 0}</b> followers
//               </span>
//               <span>
//                 <b>{user.followingCount || 0}</b> following
//               </span>
//             </div>

//             <p className="text-sm whitespace-pre-line">
//               {user.bio || "No bio yet"}
//             </p>
//           </div>
//         </div>

//         {/* TABS */}
//         <div className="border-t flex justify-center">
//           <button
//             onClick={() => setActiveTab("posts")}
//             className={`px-6 py-3 border-t-2 ${
//               activeTab === "posts"
//                 ? "border-black text-black"
//                 : "border-transparent text-gray-400"
//             }`}
//           >
//             <Grid size={14} /> POSTS
//           </button>
//           <button
//             onClick={() => setActiveTab("saved")}
//             className={`px-6 py-3 border-t-2 ${
//               activeTab === "saved"
//                 ? "border-black text-black"
//                 : "border-transparent text-gray-400"
//             }`}
//           >
//             <Bookmark size={14} /> SAVED
//           </button>
//         </div>

//         {/* POSTS GRID */}
//         <div className="grid grid-cols-3 gap-1 md:gap-4 pb-10">
//           {activeTab === "posts" &&
//             posts.map((post) => {
//               const imageSrc = getImageSrc(post.images?.[0]);

//               return (
//                 <div
//                   key={post._id}
//                   className="relative aspect-square bg-gray-100 overflow-hidden cursor-pointer group"
//                 >
//                   {/* ✅ RENDER IMG ONLY IF VALID */}
//                   {imageSrc && (
//                     <img
//                       src={imageSrc}
//                       alt="post"
//                       className="w-full h-full object-cover group-hover:scale-105 transition"
//                       onError={(e) => {
//                         e.currentTarget.style.display = "none";
//                       }}
//                     />
//                   )}

//                   {/* MULTI IMAGE ICON */}
//                   {post.images?.length > 1 && (
//                     <Layers className="absolute top-2 right-2 text-white w-5 h-5 drop-shadow" />
//                   )}
//                 </div>
//               );
//             })}

//           {/* EMPTY STATE */}
//           {activeTab === "posts" && posts.length === 0 && (
//             <div className="col-span-3 text-center py-16">
//               <Grid className="w-16 h-16 mx-auto text-gray-300 mb-4" />
//               <p className="text-xl font-light">No posts yet</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }
// import { X, Heart } from "lucide-react";
// import { useState } from "react";
// import postAPI from "../api/postApi";

// const getImageSrc = (img) => {
//   if (!img) return null;
//   if (img.startsWith("http")) return img;
//   return `http://localhost:3000${img.startsWith("/") ? img : "/" + img}`;
// };

// export default function OpenPost({ post, currentUserId, onClose }) {
//   const [likes, setLikes] = useState(post.likes || []);
//   const [comments, setComments] = useState(post.comments || []);
//   const [text, setText] = useState("");

//   const isLiked = likes.includes(currentUserId);

//   // ❤️ LIKE / UNLIKE (PERSISTED)
//   const handleLike = async () => {
//     try {
//       const res = await postAPI.put(`/${post._id}/like`);
//       setLikes(res.data.likes);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // 💬 ADD COMMENT (PERSISTED)
//   const handleComment = async (e) => {
//     e.preventDefault();
//     if (!text.trim()) return;

//     try {
//       const res = await postAPI.post(
//         `/${post._id}/comment`,
//         { text }
//       );
//       setComments(res.data);
//       setText("");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
//       <div className="bg-white w-full max-w-4xl h-[80vh] rounded-lg flex relative overflow-hidden">

//         {/* CLOSE */}
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 z-10"
//         >
//           <X />
//         </button>

//         {/* IMAGE */}
//         <div className="w-1/2 bg-black flex items-center justify-center">
//           <img
//             src={getImageSrc(post.images[0])}
//             alt="post"
//             className="max-w-full max-h-full object-contain"
//           />
//         </div>

//         {/* DETAILS */}
//         <div className="w-1/2 flex flex-col">

//           {/* CAPTION */}
//           <div className="p-4 border-b">
//             <b>{post.user?.username}</b>{" "}
//             <span>{post.caption}</span>
//           </div>

//           {/* COMMENTS */}
//           <div className="flex-1 p-4 overflow-y-auto space-y-2">
//             {comments.map((c, i) => (
//               <p key={i}>
//                 <b>{c.user?.username}</b> {c.text}
//               </p>
//             ))}
//           </div>

//           {/* ACTIONS */}
//           <div className="p-4 border-t">
//             <div className="flex items-center gap-3 mb-2">
//               <Heart
//                 onClick={handleLike}
//                 className={`cursor-pointer ${
//                   isLiked ? "fill-red-500 text-red-500" : ""
//                 }`}
//               />
//               <span className="text-sm font-semibold">
//                 {likes.length} likes
//               </span>
//             </div>

//             {/* ADD COMMENT */}
//             <form onSubmit={handleComment} className="flex gap-2">
//               <input
//                 value={text}
//                 onChange={(e) => setText(e.target.value)}
//                 placeholder="Add a comment..."
//                 className="flex-1 border rounded px-3 py-1"
//               />
//               <button
//                 type="submit"
//                 className="text-blue-500 font-semibold"
//               >
//                 Post
//               </button>
//             </form>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Bookmark, Layers } from "lucide-react";
import API from "../api/api";
import postAPI from "../api/postApi";
import Navbar from "../components/Navbar";
import OpenPost from "../Components/OpenPost";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
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

        const postRes = await postAPI.get(`/user/${userRes.data._id}`);
        setPosts(postRes.data);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* LOADING */
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-20 flex justify-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
        </div>
      </>
    );
  }

  /* ERROR */
  if (error) {
    return (
      <>
        <Navbar />
        <p className="pt-20 text-center text-red-500">{error}</p>
      </>
    );
  }

  if (!user) return null;

  const profileImage =
    user.avatar ||
    user.googleAvatar ||
    "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png";

  return (
    <>
      <Navbar />

      {/* ✅ MAIN CONTAINER */}
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
                <b>{user.followersCount || 0}</b> followers
              </span>
              <span>
                <b>{user.followingCount || 0}</b> following
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
            className={`px-6 py-3 border-t-2 ${
              activeTab === "posts"
                ? "border-black text-black"
                : "border-transparent text-gray-400"
            }`}
          >
            <Grid size={14} /> POSTS
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={`px-6 py-3 border-t-2 ${
              activeTab === "saved"
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
        </div>
      </div>

      {/* ✅ OPEN POST MODAL */}
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

