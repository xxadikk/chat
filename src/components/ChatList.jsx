import React from "react";
import { List, Avatar, Button, Typography } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  getOrCreateChat,
  setCurrent,
  toggleDetails,
} from "../redux/slices/chatsSlice";
import { fetchMessages } from "../redux/slices/messagesSlice";
import { InfoCircleOutlined, GroupOutlined } from "@ant-design/icons";

const getChatInfo = (chat, me, users) => {
  const isGroupFormat =
    !Array.isArray(chat.members) && typeof chat.members === "object";
  if (!isGroupFormat) {
    const otherId = chat.members.find((id) => id !== me?.id);
    const other = users.find((u) => u.id === otherId);

    return {
      title: other?.name || "Неизвестный Пользователь",
      avatarSrc: other?.avatar || "https://i.pravatar.cc/150",
      avatarIcon: other?.avatar ? null : null,
      description: "Личный чат",
      isGroup: false,
    };
  }
  const members = chat.members;

  return {
    title: members.title || "Группа",
    avatarSrc: members.avatar,
    avatarIcon: members.avatar ? null : <GroupOutlined />,
    description: `Группа (${members.users?.length || 0} уч.)`,
    isGroup: true,
  };
};

export default function ChatList() {
  const dispatch = useDispatch();
  const users = useSelector((s) => s.users.list);
  const chats = useSelector((s) => s.chats.list);
  const currentChatId = useSelector((s) => s.chats.current?.id);
  const me = useSelector((s) => s.auth.user);

  const visibleChats = chats.filter((chat) => {
    if (!me) return false;

    if (Array.isArray(chat.members)) {
      return chat.members.includes(me.id);
    }

    if (chat.members && typeof chat.members === "object") {
      return (
        Array.isArray(chat.members.users) && chat.members.users.includes(me.id)
      );
    }

    return false;
  });

  const availableUsers = users.filter((user) => user.id !== me?.id);

  const onSelectChat = (chat) => {
    dispatch(fetchMessages(chat.id));
    dispatch(setCurrent(chat));
  };

  const onSelectContact = async (contact) => {
    if (!me) return;
    const chat = await dispatch(
      getOrCreateChat({ userId: me.id, otherId: contact.id })
    ).unwrap();

    dispatch(fetchMessages(chat.id));
  };

  const onShowDetails = (chat) => {
    if (chat.id !== currentChatId) {
      dispatch(setCurrent(chat));
    }
    dispatch(toggleDetails(true));
  };

  return (
    <>
      <List
        className="chat-list"
        header={<Typography.Text strong>Чаты и группы</Typography.Text>}
        dataSource={visibleChats}
        renderItem={(chat) => {
          const info = getChatInfo(chat, me, users);
          const isSelected = chat.id === currentChatId;

          const itemClassName = `chat-list-item ${
            isSelected ? "is-selected" : ""
          }`;
          return (
            <List.Item
              key={chat.id}
              className={itemClassName}
              actions={[
                <Button
                  key="details"
                  onClick={() => onShowDetails(chat)}
                  type="text"
                  icon={<InfoCircleOutlined />}
                ></Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={info.avatarSrc} icon={info.avatarIcon} />}
                title={info.title}
                description={info.description}
                onClick={() => onSelectChat(chat)}
                style={{ cursor: "pointer" }}
              />
            </List.Item>
          );
        }}
      />
      <div style={{ padding: "8px 16px", borderTop: "1px solid #f0f0f0" }}>
        <Typography.Text strong>
          Контакты ({availableUsers.length})
        </Typography.Text>
      </div>

      <List
        className="contact-list"
        dataSource={availableUsers}
        renderItem={(contact) => {
          const isSelected = contact.id === currentChatId;

          return (
            <List.Item
              key={contact.id}
              style={{ cursor: "pointer" }}
              onClick={() => onSelectContact(contact)}
            >
              <List.Item.Meta
                avatar={<Avatar src={contact.avatar} />}
                title={contact.name}
                description={contact.company?.name || "Без компании"}
              />
            </List.Item>
          );
        }}
      />
    </>
  );
}
