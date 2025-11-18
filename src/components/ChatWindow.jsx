import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card } from "antd";
import MessageInput from "./MessageInput";
import { fetchMessages } from "../redux/slices/messagesSlice";

export default function ChatWindow() {
  const dispatch = useDispatch();
  const chat = useSelector((s) => s.chats.current);
  const messages = useSelector((s) => s.messages.list);
  const me = useSelector((s) => s.auth.user);

  useEffect(() => {
    if (chat) dispatch(fetchMessages(chat.id));
  }, [chat, dispatch]);

  if (!chat) {
    return <Card>Open a chat from the left to start messaging.</Card>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "80vh" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              display: "flex",
              justifyContent: m.senderId === me.id ? "flex-end" : "flex-start",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                maxWidth: "65%",
                background: m.senderId === me.id ? "#e6f7ff" : "#fff",
                padding: "2px auto",
                borderRadius: 6,
              }}
            >
              <div style={{ fontSize: 12, color: "#555" }}>
                {/* {m.senderId === me.id ? "You" : "Them"} */}
              </div>
              <div style={{ marginTop: 6 }}>{m.text}</div>
              <div style={{ fontSize: 10, color: "#888", marginTop: 6 }}>
                {new Date(m.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>
      <MessageInput chat={chat} />
    </div>
  );
}
