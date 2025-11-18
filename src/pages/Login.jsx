import React, { useState } from "react";
import { Card, Input, Button, Typography, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { loginByPhone } from "../redux/slices/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const status = useSelector((s) => s.auth.status);
  const [phone, setPhone] = useState("");

  const submit = () => {
    if (!phone.trim()) return;
    dispatch(loginByPhone(phone.trim()));
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card style={{ width: 360 }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Sign in by phone
          </Typography.Title>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+996771000000"
          />
          <Button
            type="primary"
            loading={status === "loading"}
            onClick={submit}
          >
            Enter
          </Button>
        </Space>
      </Card>
    </div>
  );
}
