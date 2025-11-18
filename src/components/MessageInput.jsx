import React, { useState } from "react";
import { Input } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { pushLocal, sendNewMessage } from "../redux/slices/messagesSlice";

export default function MessageInput({ chat }) {
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const me = useSelector((s) => s.auth.user);

  const send = async () => {
    const body = text.trim();
    if (!body) return;
    const msg = {
      chatId: chat.id,
      senderId: me.id,
      text: body,
      createdAt: new Date().toISOString(),
    };
    await dispatch(sendNewMessage(msg));
    setText("");
  };

  return (
    <div style={{ paddingTop: 8 }}>
      <Input.Search
        value={text}
        onChange={(e) => setText(e.target.value)}
        onSearch={send}
        enterButton="Send"
        placeholder="Type a message..."
      />
    </div>
  );
}
