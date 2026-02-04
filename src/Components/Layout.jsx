import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout() {
    return (
        <div className="flex min-h-screen bg-white">
            {/* SIDEBAR - VISIBLE ON DESKTOP */}
            <Sidebar />

            {/* NAVBAR - VISIBLE ON MOBILE */}
            <div className="md:hidden">
                <Navbar />
            </div>

            {/* CONTENT AREA */}
            <main className="flex-1 md:ml-[245px] w-full min-h-screen">
                <Outlet />
            </main>
        </div>
    );
}
