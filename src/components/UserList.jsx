import React from "react";
import { List, Avatar, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { getOrCreateChat } from "../redux/slices/chatsSlice";
import { fetchMessages } from "../redux/slices/messagesSlice";

export default function UserList() {
  const dispatch = useDispatch();
  const users = useSelector((s) => s.users.list);
  const me = useSelector((s) => s.auth.user);

  const onStartChat = async (other) => {
    const result = await dispatch(
      getOrCreateChat({ userId: me.id, otherId: other.id })
    ).unwrap();
    dispatch(fetchMessages(result.id));
  };

  const recommended = users.filter((u) => u.id !== me?.id);

  return (
    <List
      header="Recommended"
      dataSource={recommended}
      renderItem={(u) => (
        <List.Item
          actions={[
            <Button onClick={() => onStartChat(u)} type="primary">
              Message
            </Button>,
          ]}
        >
          <List.Item.Meta
            avatar={<Avatar src={u.avatar} />}
            title={u.name}
            description={u.company?.name}
          />
        </List.Item>
      )}
    />
  );
}
