/* src/main.jsx */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

document.title = "Panel Financiero - Carnicería";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);