import React from "react";
import ReactDOM from "react-dom/client"; // ✅ ใช้ createRoot
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
