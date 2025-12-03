import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/sidebar";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import RequireAuth from "./components/RequireAuth";
import MainPanel from "./components/mainpanel";
import IntroPanel from "./components/intropanel";
import PostsPanel from "./components/PostsPanel";
import ApiDocs from "./components/ApiDocs";
import ImageInverter from "./components/ImageInverter";
import StatsPage from "./components/StatsPage";
import ConclusionPanel from "./components/ConclusionPanel";
import "./styles/style.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Navigate to="/intro" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/intro" element={<RequireAuth><IntroPanel /></RequireAuth>} />
          <Route path="/process" element={<RequireAuth><MainPanel /></RequireAuth>} />
          <Route path="/table" element={<RequireAuth><MainPanel /></RequireAuth>} />
          <Route path="/list" element={<RequireAuth><MainPanel /></RequireAuth>} />
          <Route path="/posts" element={<RequireAuth><PostsPanel /></RequireAuth>} />
          <Route path="/api" element={<RequireAuth><ApiDocs /></RequireAuth>} />
          <Route path="/image" element={<RequireAuth><ImageInverter /></RequireAuth>} />
          <Route path="/conclusion" element={<RequireAuth><ConclusionPanel /></RequireAuth>} />
          <Route path="/stats" element={<RequireAuth role="admin"><StatsPage /></RequireAuth>} />

          <Route path="*" element={<Navigate to="/intro" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
