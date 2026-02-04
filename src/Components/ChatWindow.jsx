import { useRef, useEffect, useState } from "react";
import { Image, Heart, Smile } from "lucide-react";

export default function ChatWindow({ user, messages, onSendMessage, loading }) {
    const [text, setText] = useState("");
    const endRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onSendMessage(null, file);
        }
    };

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSendMessage(text, null);
        setText("");
    }

    if (!user) {
        return (
            <div className="flex-1 flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="w-24 h-24 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-light">Your Messages</h2>
                    <p className="text-gray-400 text-sm mt-2">Send private photos and messages to a friend.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-white h-full">
            {/* Header */}
            <div className="border-b p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src={user.avatar || "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png"}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-semibold">{user.username}</span>
                </div>
                <div className="flex items-center gap-4 text-gray-500 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => {
                    const isOwn = msg.sender?._id === user._id ? false : true; // logic: if sender is the other user, it's incoming (left). If sender is me, outgoing (right).
                    // Actually, let's pass currentUserId to be safe or rely on logic I used in messageController.
                    // Oh wait, my logic above assumes "user" prop is the OTHER user.
                    // If msg.sender._id matches user._id (the other user), then it is incoming.
                    const isIncoming = msg.sender?._id === user._id || msg.sender === user._id;

                    return (
                        <div key={idx} className={`flex ${isIncoming ? "justify-start" : "justify-end"}`}>
                            {isIncoming && (
                                <img
                                    src={user.avatar || "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png"}
                                    alt="avatar"
                                    className="w-7 h-7 rounded-full object-cover mr-2 self-end"
                                />
                            )}
                            <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${isIncoming
                                ? "bg-gray-100 text-black border border-gray-200"
                                : "bg-gray-100 text-black"
                                }`}>
                                {msg.image ? (
                                    <img src={msg.image} alt="attachment" className="rounded-lg max-w-full" />
                                ) : (
                                    msg.text
                                )}
                            </div>
                        </div>
                    );
                })}
                <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="p-4 m-4 border rounded-full flex items-center gap-3">
                <Smile className="text-gray-500 cursor-pointer" />
                <form onSubmit={handleSend} className="flex-1">
                    <input
                        type="text"
                        placeholder="Message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full outline-none text-sm"
                    />
                </form>
                {text.length > 0 ? (
                    <button onClick={handleSend} className="text-blue-500 font-semibold text-sm">Send</button>
                ) : (
                    <>
                        <input
                            type="file"
                            hidden
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                        <Image
                            className="text-gray-500 cursor-pointer"
                            onClick={() => fileInputRef.current.click()}
                        />
                        <Heart className="text-gray-500 cursor-pointer" />
                    </>
                )}
            </div>
        </div >
    );
}
