// src/components/Layout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";

export default function Layout() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="panel-container">
        <Outlet />
      </div>
    </div>
  );
}
