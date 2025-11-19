import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveUser } from "../redux/slices/usersSlice";
import { setUser } from "../redux/slices/authSlice";
import { Avatar, Button, Input, Modal } from "antd";
import { EditOutlined } from "@ant-design/icons";

const ProfileEdit = () => {
  const me = useSelector((s) => s.auth.user);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(me.name || "");
  const [company, setCompany] = useState(me?.company?.name || "");
  const dispatch = useDispatch();

  const save = async () => {
    const updateCompany = {
      ...(me.company || {}),
      name: company,
    };
    const patchData = {
      name: name,
      company: updateCompany,
    };
    const res = await dispatch(
      saveUser({ id: me.id, patch: patchData })
    ).unwrap();
    dispatch(setUser(res));
    setOpen(false);
  };
  return (
    <>
      <Button
        block
        onClick={() => {
          setName(me?.name || "");
          setCompany(me?.company?.name || "");
          setOpen(true);
        }}
      >
        <EditOutlined />
      </Button>

      <Modal
        title="Edit profile"
        open={open}
        onOk={save}
        onCancel={() => setOpen(false)}
      >
        <div className="profile-modal-fields">
          <Avatar src={me?.avatar} />
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <Input.TextArea
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company Name"
        />
      </Modal>
    </>
  );
};

export default ProfileEdit;
