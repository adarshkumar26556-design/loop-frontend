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
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Profile from "./Pages/Profile";
import EditProfile from "./Pages/EditProfile";
import CreatePost from "./Pages/CreatePost";
import Login from "./Authentication/Login";
import Register from "./Authentication/Register";
import UserProfile from "./Pages/UserProfile";
import GoogleSuccess from "./Pages/GoogleSuccess";
import ProtectedRoute from "./ProtectedRoute";
import Home from "./Pages/Home";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/google-success" element={<GoogleSuccess />} />
        <Route path="/user/:username" element={<UserProfile />} />
        <Route path="/users/:username" element={<UserProfile />} />
        {/* Protected */}
        <Route element={<ProtectedRoute />}>
         <Route path="/home" element={<Home />} />    
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/create" element={<CreatePost />} />
        </Route>

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
