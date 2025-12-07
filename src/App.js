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
          {/* редирект с корня */}
          <Route path="/" element={<Navigate to="/intro" replace />} />

          {/* публичные страницы */}
          <Route path="/intro" element={<IntroPanel />} />
          <Route path="/process" element={<MainPanel />} />
          <Route path="/table" element={<MainPanel />} />
          <Route path="/list" element={<MainPanel />} />
          <Route path="/conclusion" element={<ConclusionPanel />} />

          {/* аутентификация */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* функциональные страницы – требуют авторизации пользователя */}
          <Route
            path="/posts"
            element={
              <RequireAuth>
                <PostsPanel />
              </RequireAuth>
            }
          />
          <Route
            path="/api"
            element={
              <RequireAuth>
                <ApiDocs />
              </RequireAuth>
            }
          />
          <Route
            path="/image"
            element={
              <RequireAuth>
                <ImageInverter />
              </RequireAuth>
            }
          />

          {/* статистика – только для admin */}
          <Route
            path="/stats"
            element={
              <RequireAuth role="admin">
                <StatsPage />
              </RequireAuth>
            }
          />

          {/* все неизвестные маршруты -> intro */}
          <Route path="*" element={<Navigate to="/intro" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
