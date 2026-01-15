// import { useEffect, useRef, useState } from "react";
// import API from "../api/api";
// import Navbar from "../components/Navbar";
// import { Navigate } from "react-router-dom";

// export default function EditProfile() {
//   const [username, setUsername] = useState("");
//   const [bio, setBio] = useState("");
//   const [password, setPassword] = useState("");
//   const [avatar, setAvatar] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState("");

//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const res = await API.get("/getmyprofile");

//       setUsername(res.data.username || "");
//       setBio(res.data.bio || "");
//       setAvatar(
//         res.data.avatar?.trim()
//           ? res.data.avatar
//           : "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png"
//       );
//     };

//     fetchProfile();
//   }, []);

//   /* =========================
//      AVATAR UPLOAD
//   ========================= */
//   const handleAvatarChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     try {
//       setLoading(true);

//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("upload_preset", "YOUR_UPLOAD_PRESET"); // 🔴 CHANGE THIS
//       formData.append("cloud_name", "YOUR_CLOUD_NAME");       // 🔴 CHANGE THIS

//       const res = await fetch(
//         "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       const data = await res.json();

//       // preview instantly
//       setAvatar(data.secure_url);

//       // save avatar to backend
//       await API.put("/update-profile", {
//         avatar: data.secure_url,
//       });

//       setSuccess("Profile picture updated");
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =========================
//      UPDATE PROFILE
//   ========================= */
//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     setSuccess("");
//     setLoading(true);

//     await API.put("/update-profile", {
//       username,
//       bio,
//       password,
//     });

//     setPassword("");
//     setSuccess("Profile updated successfully");
//     setLoading(false);
//   };

//   return (
//     <>
//       <Navbar />

//       <div className="pt-20 min-h-screen flex items-center justify-center bg-white">
//         <div className="w-[420px] text-center">

//           {/* Avatar */}
//           <img
//             src={avatar}
//             alt="avatar"
//             className="w-24 h-24 mx-auto rounded-full object-cover"
//           />

//           {/* Change Picture */}
//           <p
//             onClick={() => fileInputRef.current.click()}
//             className="text-sm text-gray-500 mt-2 cursor-pointer"
//           >
//             Change Picture
//           </p>

//           {/* Hidden file input */}
//           <input
//             type="file"
//             accept="image/*"
//             ref={fileInputRef}
//             onChange={handleAvatarChange}
//             className="hidden"
//           />

//           {/* Form */}
//           <form
//             onSubmit={handleUpdate}
//             className="mt-10 space-y-5 text-left"
//           >
//             <div>
//               <label className="block text-sm text-gray-500 mb-1">
//                 username
//               </label>
//               <input
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className="w-full h-10 border rounded px-3 text-sm"
//               />
//             </div>

//             <div>
//               <label className="block text-sm text-gray-500 mb-1">
//                 bio
//               </label>
//               <input
//                 value={bio}
//                 onChange={(e) => setBio(e.target.value)}
//                 className="w-full h-10 border rounded px-3 text-sm"
//               />
//             </div>

//             <div>
//               <label className="block text-sm text-gray-500 mb-1">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full h-10 border rounded px-3 text-sm"
//               />
//             </div>

//             {success && (
//               <p className="text-green-600 text-sm text-center">
//                 {success}
//               </p>
//             )}

//             <button
//               disabled={loading}
//               className="w-full h-10 border rounded text-sm font-medium hover:bg-gray-100"
//             >
//               {loading ? "Updating..." : "Update"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }
// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Camera, Check } from "lucide-react";
// import API from "../api/api";
// import Navbar from "../components/Navbar";

// export default function EditProfile() {
//   const navigate = useNavigate();
  
//   const [username, setUsername] = useState("");
//   const [bio, setBio] = useState("");
//   const [password, setPassword] = useState("");
//   const [avatar, setAvatar] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [success, setSuccess] = useState(false);

//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await API.get("/users/getmyprofile");
//         setUsername(res.data.username || "");
//         setBio(res.data.bio || "");
//         setAvatar(
//           res.data.avatar || 
//           res.data.googleAvatar ||
//           "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png"
//         );
//       } catch (error) {
//         console.error("Failed to fetch profile:", error);
//       }
//     };

//     fetchProfile();
//   }, []);

//   /* =========================
//      AVATAR UPLOAD
//   ========================= */
//   const handleAvatarChange = async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   // Validate file size (max 5MB)
//   if (file.size > 5 * 1024 * 1024) {
//     alert("Image size should be less than 5MB");
//     return;
//   }

//   try {
//     setUploading(true);

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", "vanish_uploads"); // 👈 Replace with your preset name from Step 1

//     const res = await fetch(
//       "https://api.cloudinary.com/v1_1/dppagnjoe/image/upload",
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     if (!res.ok) throw new Error("Upload failed");

//     const data = await res.json();

//     // Preview instantly
//     setAvatar(data.secure_url);

//     // Save avatar to backend
//     await API.put("/users/update-profile", {
//       avatar: data.secure_url,
//     });

//   } catch (error) {
//     console.error("Avatar upload error:", error);
//     alert("Failed to upload image. Please try again.");
//   } finally {
//     setUploading(false);
//   }
// };

//   /* =========================
//      UPDATE PROFILE
//   ========================= */
//   const handleUpdate = async (e) => {
//     e.preventDefault();
    
//     if (!username.trim()) {
//       alert("Username is required");
//       return;
//     }

//     try {
//       setLoading(true);

//       const updateData = {
//         username: username.trim(),
//         bio: bio.trim(),
//       };

//       // Only include password if user entered one
//       if (password.trim()) {
//         updateData.password = password;
//       }

//       await API.put("/users/update-profile", updateData);

//       // Show success message
//       setSuccess(true);

//       // Redirect to profile after 1.5 seconds
//       setTimeout(() => {
//         navigate("/profile", { replace: true });
//       }, 1500);

//     } catch (error) {
//       console.error("Update error:", error);
//       alert(error.response?.data?.message || "Failed to update profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Navbar />

//       <div className="pt-16 min-h-screen bg-white">
//         <div className="max-w-2xl mx-auto px-4 py-8">
          
//           {/* Header */}
//           <div className="flex items-center justify-between mb-8 pb-4 border-b">
//             <h1 className="text-xl font-semibold">Edit Profile</h1>
//             <button
//               onClick={() => navigate("/profile")}
//               className="text-sm text-gray-600 hover:text-gray-900"
//             >
//               Cancel
//             </button>
//           </div>

//           {/* Success Message */}
//           {success && (
//             <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
//               <Check className="w-5 h-5 text-green-600" />
//               <p className="text-green-700 font-medium">Profile updated successfully!</p>
//             </div>
//           )}

//           {/* Avatar Section */}
//           <div className="flex items-center gap-6 mb-8 pb-8 border-b">
//             <div className="relative">
//               <img
//                 src={avatar}
//                 alt="avatar"
//                 className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
//               />
//               {uploading && (
//                 <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
//                   <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 </div>
//               )}
//               <button
//                 onClick={() => fileInputRef.current?.click()}
//                 disabled={uploading}
//                 className="absolute bottom-0 right-0 p-2 bg-white rounded-full border-2 border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
//               >
//                 <Camera className="w-4 h-4 text-gray-700" />
//               </button>
//             </div>

//             <div className="flex-1">
//               <h3 className="font-semibold text-lg mb-1">{username || "Username"}</h3>
//               <button
//                 onClick={() => fileInputRef.current?.click()}
//                 disabled={uploading}
//                 className="text-sm text-blue-600 hover:text-blue-700 font-semibold disabled:opacity-50"
//               >
//                 {uploading ? "Uploading..." : "Change profile photo"}
//               </button>
//             </div>

//             <input
//               type="file"
//               accept="image/*"
//               ref={fileInputRef}
//               onChange={handleAvatarChange}
//               className="hidden"
//             />
//           </div>

//           {/* Form */}
//           <form onSubmit={handleUpdate} className="space-y-6">
            
//             {/* Username */}
//             <div className="flex items-start gap-8">
//               <label className="w-32 pt-2 text-right text-sm font-semibold">
//                 Username
//               </label>
//               <div className="flex-1">
//                 <input
//                   type="text"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
//                   placeholder="Enter username"
//                   required
//                 />
//                 <p className="text-xs text-gray-500 mt-2">
//                   Username can only contain letters, numbers, underscores and periods
//                 </p>
//               </div>
//             </div>

//             {/* Bio */}
//             <div className="flex items-start gap-8">
//               <label className="w-32 pt-2 text-right text-sm font-semibold">
//                 Bio
//               </label>
//               <div className="flex-1">
//                 <textarea
//                   value={bio}
//                   onChange={(e) => setBio(e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 resize-none"
//                   placeholder="Tell us about yourself"
//                   rows={3}
//                   maxLength={150}
//                 />
//                 <p className="text-xs text-gray-500 mt-2 text-right">
//                   {bio.length}/150
//                 </p>
//               </div>
//             </div>

//             {/* Password */}
//             <div className="flex items-start gap-8">
//               <label className="w-32 pt-2 text-right text-sm font-semibold">
//                 New Password
//               </label>
//               <div className="flex-1">
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
//                   placeholder="Leave blank to keep current password"
//                 />
//                 <p className="text-xs text-gray-500 mt-2">
//                   Only fill this if you want to change your password
//                 </p>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="flex items-center gap-8 pt-4">
//               <div className="w-32"></div>
//               <button
//                 type="submit"
//                 disabled={loading || uploading}
//                 className="px-8 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? (
//                   <span className="flex items-center gap-2">
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     Updating...
//                   </span>
//                 ) : (
//                   "Submit"
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Check } from "lucide-react";
import API from "../api/api";
import Navbar from "../components/Navbar";

export default function EditProfile() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isPrivate, setIsPrivate] = useState(false); // ✅ ADDED
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/getmyprofile");
        setUsername(res.data.username || "");
        setBio(res.data.bio || "");
        setIsPrivate(res.data.isPrivate || false); // ✅ LOAD VALUE
        setAvatar(
          res.data.avatar ||
          res.data.googleAvatar ||
          "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png"
        );
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  /* =========================
     AVATAR UPLOAD
  ========================= */
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "vanish_uploads");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dppagnjoe/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();

      setAvatar(data.secure_url);

      await API.put("/users/update-profile", {
        avatar: data.secure_url,
      });
    } catch (error) {
      console.error("Avatar upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  /* =========================
     UPDATE PROFILE
  ========================= */
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      alert("Username is required");
      return;
    }

    try {
      setLoading(true);

      const updateData = {
        username: username.trim(),
        bio: bio.trim(),
        isPrivate, // ✅ SAVE VALUE
      };

      if (password.trim()) {
        updateData.password = password;
      }

      await API.put("/users/update-profile", updateData);

      setSuccess(true);

      setTimeout(() => {
        navigate("/profile", { replace: true });
      }, 1500);
    } catch (error) {
      console.error("Update error:", error);
      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="pt-16 min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b">
            <h1 className="text-xl font-semibold">Edit Profile</h1>
            <button
              onClick={() => navigate("/profile")}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <p className="text-green-700 font-medium">
                Profile updated successfully!
              </p>
            </div>
          )}

          {/* Avatar Section */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b">
            <div className="relative">
              <img
                src={avatar}
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
              {uploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 p-2 bg-white rounded-full border-2 border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              >
                <Camera className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">
                {username || "Username"}
              </h3>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="text-sm text-blue-600 font-semibold disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Change profile photo"}
              </button>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* Form */}
          <form onSubmit={handleUpdate} className="space-y-6">

            {/* Username */}
            <div className="flex items-start gap-8">
              <label className="w-32 pt-2 text-right text-sm font-semibold">
                Username
              </label>
              <div className="flex-1">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>

            {/* Bio */}
            <div className="flex items-start gap-8">
              <label className="w-32 pt-2 text-right text-sm font-semibold">
                Bio
              </label>
              <div className="flex-1">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  maxLength={150}
                  className="w-full px-4 py-2 border rounded-lg resize-none"
                />
              </div>
            </div>

            {/* 🔐 Account Privacy */}
            <div className="flex items-center gap-8">
              <label className="w-32 text-right text-sm font-semibold">
                Account
              </label>
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Private Account</p>
                  <p className="text-xs text-gray-500">
                    Only approved followers can see your posts
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPrivate(!isPrivate)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    isPrivate ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      isPrivate ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Password */}
            <div className="flex items-start gap-8">
              <label className="w-32 pt-2 text-right text-sm font-semibold">
                New Password
              </label>
              <div className="flex-1">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-8 pt-4">
              <div className="w-32"></div>
              <button
                type="submit"
                disabled={loading || uploading}
                className="px-8 py-2 bg-blue-500 text-white rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? "Updating..." : "Submit"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}
