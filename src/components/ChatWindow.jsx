import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Typography } from "antd";
import MessageInput from "./MessageInput";
import { fetchMessages } from "../redux/slices/messagesSlice";
import { NotificationTwoTone } from "@ant-design/icons";
import ChatHeader from "./ChatHeaders";
import { Content, Header } from "antd/es/layout/layout";

const { Text } = Typography;

export default function ChatWindow() {
  const dispatch = useDispatch();
  const chat = useSelector((s) => s.chats.current);
  const messages = useSelector((s) => s.messages.list);
  const me = useSelector((s) => s.auth.user);
  const users = useSelector((s) => s.users.list);

  const isGroup = chat && !Array.isArray(chat.members);

  useEffect(() => {
    if (chat?.id) dispatch(fetchMessages(chat.id));
  }, [chat, dispatch]);

  if (!chat) {
    return (
      <Card
        style={{
          display: "flex",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <NotificationTwoTone
          style={{ fontSize: 52, display: "flex", justifyContent: "center" }}
        />
        <div>Откройте чат слева, чтобы начать обмен сообщениями.</div>
      </Card>
    );
  }

  const getSenderName = (senderId) => {
    const sender = users.find((u) => u.id === senderId);
    return sender?.name || "Неизвестный";
  };

  return (
    <>
      <Header style={{ background: "#fff" }}>
        <ChatHeader />
      </Header>
      <Content className="content-area">
        <div className="chat-window-container">
          <div className="messages-scroll-area">
            {messages.map((m) => {
              const isMe = m.senderId === me.id;
              const senderName = getSenderName(m.senderId);

              const modifier = isMe ? "mine" : "theirs";
              const timeModifier = isMe ? "mine" : "theirs";
              return (
                <div key={m.id} className={`message-row ${modifier}`}>
                  <div className={`message-content ${modifier}`}>
                    {isGroup && !isMe && (
                      <Text className="sender-name">{senderName}</Text>
                    )}
                    <div className={`message-bubble ${modifier}`}>
                      <div className="message-text">{m.text}</div>
                      <div className={`message-time ${timeModifier}`}>
                        {new Date(m.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <MessageInput chat={chat} />
        </div>
      </Content>
    </>
  );
}
