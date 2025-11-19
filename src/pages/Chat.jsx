import React, { useEffect } from "react";
import { Layout, Avatar, Button, Typography, Popover } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../redux/slices/usersSlice";
import { fetchChats } from "../redux/slices/chatsSlice";
import { logout } from "../redux/slices/authSlice";
import UserList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import ProfileEdit from "../components/ProfileEdit";
import GroupCreate from "../components/GroupCreate";
import ChatDetails from "../components/ChatDetails";
import { LogoutOutlined } from "@ant-design/icons";
import "../styles/ChatLayout.css";
import "../styles/ChatComponents.css";

const { Sider, Content, Header } = Layout;

export default function Chat() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchChats());
  }, [dispatch]);

  return (
    <Layout className="chat-page-layout">
      <Sider width={300} theme="light" className="sider-content">
        <div className="header-controls">
          <div>
            <Avatar src={user?.avatar} />
            <Typography.Text className="profile-name">
              {user?.name}
            </Typography.Text>
          </div>
          <div>
            <ProfileEdit />
          </div>
          <div>
            <GroupCreate />
          </div>
          <Popover content="Выйти">
            <Button danger onClick={() => dispatch(logout())}>
              <LogoutOutlined />
            </Button>
          </Popover>
        </div>
        <UserList />
      </Sider>
      <Layout>
        <ChatWindow />
      </Layout>
      <ChatDetails />
    </Layout>
  );
}
