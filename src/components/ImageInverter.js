// src/components/ImageInverter.jsx
import React, { useState } from "react";
import { invertImage } from "../api/client";
import { usePageTracking } from "../hooks/usePageTracking";

export default function ImageInverter() {
  usePageTracking(6);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setResultUrl(null);
    setErr("");
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setErr("");
    try {
      const blob = await invertImage(file);          // POST /invert-image
      setResultUrl(URL.createObjectURL(blob));       // показываем PNG
    } catch (e) {
      setErr(e.message || "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content">
      <div className="image-inverter">
        <h2>Инвертирование изображения (FastAPI)</h2>

        <form onSubmit={onSubmit}>
          <input type="file" accept="image/*" onChange={onFileChange} />
          <button type="submit" disabled={!file || loading}>
            {loading ? "Обработка..." : "Инвертировать"}
          </button>
        </form>

        {err && <p className="note">{err}</p>}

        <div className="images-preview">
          {preview && (
            <>
              <h4>Оригинал</h4>
              <img src={preview} alt="original" />
              <div className="divider" />
            </>
          )}

          {resultUrl && (
            <>
              <h4>Инвертированное</h4>
              <img src={resultUrl} alt="inverted" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
