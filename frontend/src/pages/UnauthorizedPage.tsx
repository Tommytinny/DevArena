import React from "react";
import { Navigate } from "react-router-dom";

export default function Unauthorized() {
  return <Navigate to="/login" />;
};
