// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Profile from "./Pages/Profile";
// import EditProfile from "./Pages/EditProfile";
// import CreatePost from "./Pages/CreatePost"
// import Login from "./Authentication/Login";
// import Register from "./Authentication/Register";
// import UserProfile from "./Pages/UserProfile";
// import GoogleSuccess from "./Pages/GoogleSuccess";


// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login/>} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/edit-profile" element={<EditProfile />} />
//          <Route path="/profile" element={<Profile />} />
//         <Route path="/profile/:username" element={<Profile />} />
//         <Route path="/user/:username" element={<UserProfile />} />

//         {/* Redirect any unknown route */}
//         <Route path="create" element={<CreatePost/>} />
//          <Route path="/google-success" element={<GoogleSuccess />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useEffect } from "react";

// import Profile from "./Pages/Profile";
// import EditProfile from "./Pages/EditProfile";
// import CreatePost from "./Pages/CreatePost";
// import Login from "./Authentication/Login";
// import Register from "./Authentication/Register";
// import UserProfile from "./Pages/UserProfile";
// import GoogleSuccess from "./Pages/GoogleSuccess";
// import ProtectedRoute from "./ProtectedRoute";
// import Home from "./Pages/Home";
// import FollowRequests from "./Pages/FollowRequests";

// import socket from "./socket";

// export default function App() {
//   useEffect(() => {
//     const userId = localStorage.getItem("userId");
//     if (userId) {
//       socket.emit("join", userId);
//     }
//   }, []);

//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public */}
//         <Route path="/" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/google-success" element={<GoogleSuccess />} />
//         <Route path="/user/:username" element={<UserProfile />} />
//         <Route path="/users/:username" element={<UserProfile />} />

//         {/* Protected */}
//         <Route element={<ProtectedRoute />}>
//           <Route path="/home" element={<Home />} />
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/edit-profile" element={<EditProfile />} />
//           <Route path="/create" element={<CreatePost />} />
//           <Route path="/follow-requests" element={<FollowRequests />} />
//         </Route>

//         {/* Fallback */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import socket from "./socket";

import Layout from "./Components/Layout"; // ✅ IMPORT LAYOUT
import Profile from "./Pages/Profile";
import EditProfile from "./Pages/EditProfile";
import CreatePost from "./Pages/CreatePost";
import Login from "./Authentication/Login";
import Register from "./Authentication/Register";
import UserProfile from "./Pages/UserProfile";
import GoogleSuccess from "./Pages/GoogleSuccess";
import ProtectedRoute from "./ProtectedRoute";
import Home from "./Pages/Home";
import Search from "./Pages/Search";
import FollowRequests from "./Pages/FollowRequests";
import Notifications from "./Pages/Notifications";
import Messages from "./Pages/Messages";

export default function App() {
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      socket.emit("join", userId);
      console.log("✅ Joined socket room:", userId);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/google-success" element={<GoogleSuccess />} />

        {/* WRAP PROTECTED ROUTES WITH LAYOUT */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/follow-requests" element={<FollowRequests />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/user/:username" element={<UserProfile />} /> {/* ✅ MOVED INSIDE */}
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
