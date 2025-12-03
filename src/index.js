import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Находим элемент <div id="root"> в public/index.html
const root = ReactDOM.createRoot(document.getElementById("root"));

// Отрисовываем React-приложение внутри него
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
