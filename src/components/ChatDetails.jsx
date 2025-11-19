import React, { useState } from "react";
import {
  Drawer,
  Typography,
  Avatar,
  Divider,
  Tag,
  Button,
  List,
  Modal,
  Select,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { toggleDetails, patchChat } from "../redux/slices/chatsSlice";
import {
  UserOutlined,
  GroupOutlined,
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const getOtherUser = (chat, me, users) => {
  if (Array.isArray(chat.members)) {
    const otherId = chat.members.find((id) => id !== me?.id);
    return users.find((u) => u.id === otherId);
  }
  return null;
};

export default function ChatDetails() {
  const dispatch = useDispatch();
  const { isDetailsOpen, current: currentChat } = useSelector((s) => s.chats);
  const { user: me } = useSelector((s) => s.auth);
  const users = useSelector((s) => s.users.list);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  if (!currentChat) return null;

  const isGroup = !Array.isArray(currentChat.members);
  const details = isGroup
    ? currentChat.members
    : getOtherUser(currentChat, me, users);
  const group = isGroup ? details : null;
  const groupUsers = group
    ? group.users.map((id) => users.find((u) => u.id === id))
    : [];
  const isCurrentUserAdmin = group?.adminId === me.id;

  const handleGroupPatch = (newUsersList) => {
    if (!isGroup || !isCurrentUserAdmin) return;

    const updatedMembers = {
      ...currentChat.members,
      users: newUsersList,
    };

    dispatch(
      patchChat({
        id: currentChat.id,
        patch: { members: updatedMembers },
      })
    );
  };
  const handleRemoveUser = (userId) => {
    const newUsers = details.users.filter((id) => id !== userId);
    handleGroupPatch(newUsers);
  };

  const availableUsersToAdd = isGroup
    ? users.filter((u) => !group.users.includes(u.id))
    : [];

  const handleAddUsers = () => {
    if (selectedUsers.length === 0) return;

    const newUsersList = [...group.users, ...selectedUsers];
    handleGroupPatch(newUsersList);

    setSelectedUsers([]);
    setIsAddUserModalOpen(false);
  };

  const onClose = () => {
    dispatch(toggleDetails(false));
  };

  if (!isGroup) {
    const other = details;
    if (!other) return null;
    return (
      <Drawer
        title="Сведения о пользователе"
        placement="right"
        onClose={onClose}
        open={isDetailsOpen}
      >
        <Avatar size={64} src={other.avatar} icon={<UserOutlined />} /> 
        <Title level={3} style={{ marginTop: 8 }}>
          {other.name}
        </Title>
        <Divider />
        <Text strong>Телефон:</Text>
        <Text copyable>{other.phone}</Text>
        <br />
        <Text strong>Компания:</Text>
        <Text>{other.company?.name || "Нет данных"}</Text>
      </Drawer>
    );
  }

  return (
    <Drawer
      title={`Настройки группы: ${group.title}`}
      placement="right"
      onClose={onClose}
      open={isDetailsOpen}
    >
      <Avatar size={64} icon={<GroupOutlined />} />
      <Title level={3} style={{ marginTop: 8 }}>
        {group.title}
      </Title>
      <Text type="secondary">
        Администратор: {users.find((u) => u.id === group.adminId)?.name}
      </Text>
      <Divider orientation="left">Участники ({groupUsers.length})</Divider>
      {isCurrentUserAdmin && (
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => setIsAddUserModalOpen(true)}
          style={{ marginBottom: 16 }}
          block
        >
          Добавить участников
        </Button>
      )}
      <List
        dataSource={groupUsers}
        renderItem={(u) => (
          <List.Item
            actions={
              isCurrentUserAdmin && u.id !== me.id
                ? [
                    <Button
                      key="remove"
                      type="text"
                      danger
                      icon={<CloseOutlined />}
                      onClick={() => handleRemoveUser(u.id)}
                    />,
                  ]
                : []
            }
          >
            <List.Item.Meta
              avatar={<Avatar src={u.avatar} />}
              title={u.name}
              description={u.id === me.id ? <Tag color="blue">Вы</Tag> : null}
            />
          </List.Item>
        )}
      />
      <Modal
        title={`Добавить участников в "${group.title}"`}
        open={isAddUserModalOpen}
        onCancel={() => setIsAddUserModalOpen(false)}
        onOk={handleAddUsers}
        okText="Добавить"
        cancelText="Отмена"
        okButtonProps={{ disabled: selectedUsers.length === 0 }}
      >
        <Select
          mode="multiple"
          placeholder="Выберите пользователей для добавления"
          style={{ width: "100%" }}
          onChange={setSelectedUsers}
          value={selectedUsers}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {availableUsersToAdd.map((u) => (
            <Select.Option key={u.id} value={u.id}>
              {u.name} ({u.phone})
            </Select.Option>
          ))}
        </Select>
        <Text type="secondary" style={{ marginTop: 8, display: "block" }}>
          Выбрано: {selectedUsers.length}
        </Text>
      </Modal>
    </Drawer>
  );
}
