import React from "react";
import { usePageTracking } from "../hooks/usePageTracking"; 

function IntroPanel() {
  
  usePageTracking(1);

  return (
    <div className="content">
      <h1>Введение</h1>
      <p>
        Контроль качества маркировки — важный этап, обеспечивающий соответствие продукции стандартам и
        требованиям клиентов.
      </p>
      <p>
        Введение описывает общие цели системы контроля, а также ключевые преимущества её внедрения в производство.
      </p>
    </div>
  );
}

export default IntroPanel;  