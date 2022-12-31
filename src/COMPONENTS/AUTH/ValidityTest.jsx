import React from "react";
import { useNavigate } from "react-router-dom";

export default function ValidityTest({ children }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const navigate = useNavigate();
  React.useEffect(() => {
    if (
      !token ||
      !user ||
      !token.startsWith("Bearer ") ||
      !user.toUpperCase() !== !user.toLowerCase()
    ) {
      navigate("/");
    }
  }, [navigate, token, user]);

  return children;
}
