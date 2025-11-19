import React, { useState } from "react";
import { Card, Input, Button, Typography, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { loginByPhone } from "../redux/slices/authSlice";
import "../styles/Login.css";

export default function Login() {
  const dispatch = useDispatch();
  const status = useSelector((s) => s.auth.status);
  const [phone, setPhone] = useState("");

  const submit = () => {
    if (!phone.trim()) return;
    dispatch(loginByPhone(phone.trim()));
  };

  return (
    <div className="login-page-container">
      <Card className="login-card">
        <Space direction="vertical" className="login-space">
          <Typography.Title level={4} style={{ margin: 0 }}>
            Вход через номер телефона
          </Typography.Title>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="996225000000"
          />
          <div className="button-right">
            <Button
              type="primary"
              loading={status === "loading"}
              onClick={submit}
            >
              Вход
            </Button>
          </div>
        </Space>
      </Card>
    </div>
  );
}
