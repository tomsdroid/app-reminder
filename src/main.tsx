// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// portalRoot
const portalRoot = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(portalRoot).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
