// src/components/ApiDocs.jsx
import React from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { usePageTracking } from "../hooks/usePageTracking";

export default function ApiDocs() {
  usePageTracking(5);
  const SPEC_URL = process.env.REACT_APP_OPENAPI_URL || "http://localhost:8000/openapi.json";
  return (
    <div className="content">            {/* твоя область контента */}
      <div className="api-docs">         {/* наш контейнер со стилями ниже */}
        <h2 className="hover-head">API документация</h2>
        <SwaggerUI url={SPEC_URL} />
      </div>
    </div>
  );
}
