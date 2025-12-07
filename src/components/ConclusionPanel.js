import React from "react";
import usePageTracking  from "../hooks/usePageTracking";
import SearchBar from "./SearchBar";
import useRouteHighlight from "../hooks/useRouteHighlight";

function ConclusionPanel() {
  usePageTracking("conclusion");
  useRouteHighlight();
  
  return (
    <div className="content">
      <SearchBar />
      <h1>Заключение</h1>
      <p>
        Поддержание высокого качества маркировки помогает укрепить доверие клиентов и минимизировать количество
        брака.
      </p>
      <p>
        Современные методы контроля и автоматизации обеспечивают стабильность процессов и точность данных.
      </p>
      <img
        src="/pharm_line_2.gif"   // имя файла из public
        alt="Фармацевтическая производственная линия"
        className="intro-gif"
      />
    </div>
  );
}

export default ConclusionPanel;
