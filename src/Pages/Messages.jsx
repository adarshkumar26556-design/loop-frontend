import { useEffect, useState } from "react";
import ChatSidebar from "../Components/ChatSidebar";
import ChatWindow from "../Components/ChatWindow";
import API from "../API/api";
import socket from "../socket";

export default function Messages() {
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Fetch current user and conversations
    useEffect(() => {
        fetchCurrentUser();
        fetchConversations();
    }, []);

    // Socket listener for incoming messages
    useEffect(() => {
        socket.on("receive_message", (newMsg) => {
            // Update messages if chat is open
            if (selectedUser && (newMsg.sender._id === selectedUser._id || newMsg.sender === selectedUser._id)) {
                setMessages((prev) => [...prev, newMsg]);
            }
            // Update conversation list
            fetchConversations(); // Hacky strictly speaking, but ensures up to date list
        });

        return () => {
            socket.off("receive_message");
        };
    }, [selectedUser]);

    const fetchCurrentUser = async () => {
        try {
            const res = await API.get("/users/getmyprofile");
            setCurrentUser(res.data);
        } catch { }
    };

    const fetchConversations = async () => {
        try {
            const res = await API.get("/messages/conversations");
            setConversations(res.data);
        } catch { }
    };

    // Select User & Fetch History
    useEffect(() => {
        if (!selectedUser) return;

        const fetchHistory = async () => {
            setLoading(true);
            try {
                const res = await API.get(`/messages/${selectedUser._id}`);
                setMessages(res.data);
            } catch {
                console.log("Failed to load messages");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [selectedUser]);

    const sendMessage = async (text, file) => {
        if (!selectedUser) return;

        // Optimistic update
        const tempMsg = {
            text: text || "",
            image: file ? URL.createObjectURL(file) : null,
            sender: currentUser?._id, // Assume self
            recipient: selectedUser._id,
            createdAt: new Date().toISOString()
        };
        setMessages((prev) => [...prev, tempMsg]);

        try {
            const formData = new FormData();
            formData.append("recipientId", selectedUser._id);
            if (text) formData.append("text", text);
            if (file) formData.append("image", file); // Must match middleware

            await API.post("/messages", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            // Refresh conversation list to show latest message
            fetchConversations();
        } catch (err) {
            console.error("Failed to send", err);
        }
    };

    return (
        <div className="h-screen pt-14 md:pt-0 bg-white flex flex-col md:ml-0">
            <div className="flex-1 w-full flex border-gray-200 overflow-hidden h-full">
                <ChatSidebar
                    conversations={conversations}
                    currentUser={currentUser}
                    onSelectUser={setSelectedUser}
                    selectedUserId={selectedUser?._id}
                />
                <ChatWindow
                    user={selectedUser}
                    messages={messages}
                    onSendMessage={sendMessage}
                    loading={loading}
                    onBack={() => setSelectedUser(null)}
                />
            </div>
        </div>
    );
}
