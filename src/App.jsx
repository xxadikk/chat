import React from "react";
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import Chat from "./pages/Chat";

export default function App() {
  const user = useSelector((s) => s.auth.user);
  return user ? <Chat /> : <Login />;
}
