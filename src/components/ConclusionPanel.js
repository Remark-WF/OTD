import React from "react";
import { usePageTracking } from "../hooks/usePageTracking";

function ConclusionPanel() {
  usePageTracking(2);
  return (
    <div className="content">
      <h1>Заключение</h1>
      <p>
        Поддержание высокого качества маркировки помогает укрепить доверие клиентов и минимизировать количество
        брака.
      </p>
      <p>
        Современные методы контроля и автоматизации обеспечивают стабильность процессов и точность данных.
      </p>
    </div>
  );
}

export default ConclusionPanel;
