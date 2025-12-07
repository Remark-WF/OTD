// src/components/intropanel.js
import React from "react";
import usePageTracking from "../hooks/usePageTracking";
import SearchBar from "./SearchBar";

function IntroPanel() {
  usePageTracking("intro");

  return (
    <div className="content">
      <SearchBar />

      <h1>Введение</h1>
      <p>
        Контроль качества маркировки — важный этап, обеспечивающий соответствие продукции
        стандартам и требованиям клиентов.
      </p>
      <p>
        Введение описывает общие цели системы контроля, а также ключевые преимущества
        её внедрения в производство.
      </p>

      <img
        src="/pharma_line.gif"   // имя файла из public
        alt="Фармацевтическая производственная линия"
        className="intro-gif"
      />
    </div>
  );
}

export default IntroPanel;
