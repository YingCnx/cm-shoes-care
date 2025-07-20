import React from "react";
import ReactDOM from "react-dom/client"; // ✅ ใช้ createRoot
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'; // ถ้ามี custom css

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);



<head>
  <link href="https://fonts.googleapis.com/css2?family=Prompt&display=swap" rel="stylesheet" />
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CM SHOES CARE ระบบจัดการร้านซักเกิบแอนด์สปา</title>
</head>
