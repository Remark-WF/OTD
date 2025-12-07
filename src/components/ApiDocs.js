// src/components/ApiDocs.jsx
import React from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import usePageTracking from "../hooks/usePageTracking";
import SearchBar from "./SearchBar";
import useRouteHighlight from "../hooks/useRouteHighlight";

export default function ApiDocs() {
  usePageTracking("api");
  useRouteHighlight(); 
  const SPEC_URL =
    process.env.REACT_APP_OPENAPI_URL || "http://localhost:8000/openapi.json";

  return (
    <main className="content">
      <SearchBar />

      <div className="api-docs">
        <h2 className="hover-head">API документация</h2>
        <SwaggerUI url={SPEC_URL} />
      </div>
    </main>
  );
}
