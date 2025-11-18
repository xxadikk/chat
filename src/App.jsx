import React from "react";
import { useSelector } from "react-redux";
import ChatPage from "./pages/Chat";
import Login from "./pages/Login";

export default function App() {
  const user = useSelector((s) => s.auth.user);
  return user ? <ChatPage /> : <Login />;
}
