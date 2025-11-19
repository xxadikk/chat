import { Button, Input, Modal } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createChat } from "../api/chat";
import { fetchChats } from "../redux/slices/chatsSlice";
import { PlusOutlined } from "@ant-design/icons";

const GroupCreate = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const me = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();

  const create = async () => {
    if (!title.trim()) return;
    await createChat({
      type: "group",
      title: title.trim(),
      adminId: me.id,
      users: [me.id],
    });
    setTitle("");
    dispatch(fetchChats());
  };
  return (
    <>
      <Button block style={{ marginBottom: 12 }} onClick={() => setOpen(true)}>
        <PlusOutlined />
      </Button>
      <Modal
        title="Greate group"
        open={open}
        onOk={create}
        onCancel={() => setOpen(false)}
      >
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Group name"
        />
      </Modal>
    </>
  );
};

export default GroupCreate;
