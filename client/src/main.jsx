import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import Editor from "./pages/Editor";
import Library from "./pages/Library";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/editor/:id" element={<Editor />} />
        <Route path="/library" element={<Library />} />
      </Routes>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1a1a19",
            color: "#faf9f5",
            border: "1px solid rgba(176, 174, 165, 0.2)",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "13px"
          },
          success: {
            iconTheme: {
              primary: "#788c5d",
              secondary: "#141413"
            }
          },
          error: {
            iconTheme: {
              primary: "#d97757",
              secondary: "#141413"
            }
          }
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
