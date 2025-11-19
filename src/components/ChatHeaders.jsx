
import React from "react";
import { useSelector } from "react-redux";
import { Typography, Space } from "antd";
import { MessageOutlined, GroupOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function ChatHeader() {
  const chat = useSelector((s) => s.chats.current);
  const me = useSelector((s) => s.auth.user);
  const users = useSelector((s) => s.users.list);

  if (!chat) {
    return;
  }

  const isGroup = !Array.isArray(chat.members);
  let chatTitle = "Чат";
  let Icon = MessageOutlined;

  if (isGroup) {
    chatTitle = chat.members?.title || "Группа без названия";
    Icon = GroupOutlined;
  } else {
    const otherId = chat.members?.find((id) => id !== me.id);
    const otherUser = users.find((u) => u.id === otherId);
    chatTitle = otherUser?.name || "Неизвестный контакт";
  }

  return (
    <Space size="middle" style={{ padding: "0 24px" }}>
      <Icon style={{ fontSize: "20px", color: "#1890ff" }} />
      <Title level={4} style={{ margin: 0 }}>
        {chatTitle}
      </Title>
      {isGroup && (
        <Text type="secondary" style={{ marginLeft: 8 }}>
          ({chat.members.users.length} участников)
        </Text>
      )}
    </Space>
  );
}
