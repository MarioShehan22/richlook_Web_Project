import { useEffect, useRef, useState } from "react";
import { sendChatMessage } from "../api/chat";
import "../style/chatWidget.css";

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    // Persist messages across pages/refresh
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem("richlook_chat_msgs");
        return saved
            ? JSON.parse(saved)
            : [{ role: "bot", content: "👋 Hi! How can we help?" }];
    });

    const listRef = useRef(null);

    useEffect(() => {
        localStorage.setItem("richlook_chat_msgs", JSON.stringify(messages));
        // auto scroll
        requestAnimationFrame(() => {
            if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
        });
    }, [messages, open]);

    const send = async () => {
        const msg = text.trim();
        if (!msg || loading) return;

        setMessages((m) => [...m, { role: "user", content: msg }]);
        setText("");
        setLoading(true);

        try {
            const { reply } = await sendChatMessage(msg);
            setMessages((m) => [...m, { role: "bot", content: reply }]);
        } catch (e) {
            setMessages((m) => [
                ...m,
                { role: "bot", content: e?.response?.data?.message || "Chat failed. Please try again." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const clearChat = () => {
        const init = [{ role: "bot", content: "👋 Hi! How can we help?" }];
        setMessages(init);
        localStorage.setItem("richlook_chat_msgs", JSON.stringify(init));
    };

    return (
        <>
            {/* Floating Button */}
            <button
                className="rl-chat-fab"
                onClick={() => setOpen((v) => !v)}
                aria-label="Open chat"
            >
                {open ? "×" : "💬"}
            </button>

            {/* Chat Window */}
            {open && (
                <div className="rl-chat-window shadow">
                    <div className="rl-chat-header">
                        <div>
                            <div className="rl-chat-title">RichLook Assistant</div>
                            <div className="rl-chat-subtitle">Ask about products & orders</div>
                        </div>
                        <div className="rl-chat-actions">
                            <button className="rl-chat-link" onClick={clearChat} type="button">
                                Clear
                            </button>
                            <button className="rl-chat-close" onClick={() => setOpen(false)} type="button">
                                ×
                            </button>
                        </div>
                    </div>

                    <div className="rl-chat-body" ref={listRef}>
                        {messages.map((m, i) => (
                            <div key={i} className={`rl-chat-row ${m.role === "user" ? "me" : "bot"}`}>
                                <div className="rl-chat-bubble">{m.content}</div>
                            </div>
                        ))}
                        {loading && (
                            <div className="rl-chat-row bot">
                                <div className="rl-chat-bubble">Typing…</div>
                            </div>
                        )}
                    </div>

                    <div className="rl-chat-footer">
                        <input
                            className="rl-chat-input"
                            placeholder="Type a message…"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && send()}
                        />
                        <button className="rl-chat-send" onClick={send} disabled={loading}>
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
