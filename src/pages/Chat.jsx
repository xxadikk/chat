import React, { useEffect } from "react";
import { Layout, List, Avatar, Button, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../redux/slices/usersSlice";
import { getChats } from "../api/chat";
import { setList } from "../redux/slices/chatsSlice";
import { logout } from "../redux/slices/authSlice";
import UserList from "../components/UserList";
import ChatWindow from "../components/ChatWindow";

const { Sider, Content, Header } = Layout;

export default function ChatPage() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  useEffect(() => {
    dispatch(fetchUsers());
    (async () => {
      const list = await getChats();
      dispatch(setList(list));
    })();
  }, [dispatch]);

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider width={300} theme="light" style={{ padding: 12 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <div>
            <Avatar src={user?.avatar} />
            <Typography.Text style={{ marginLeft: 8 }}>
              {user?.name}
            </Typography.Text>
          </div>
          <Button danger onClick={() => dispatch(logout())}>
            Logout
          </Button>
        </div>
        <UserList />
      </Sider>
      <Layout>
        <Header style={{ background: "#fff" }} />
        <Content style={{ padding: 12 }}>
          <ChatWindow />
        </Content>
      </Layout>
    </Layout>
  );
}
