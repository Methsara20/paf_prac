import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter } from "react-router-dom";  
import { Toaster } from "react-hot-toast";  
import AppRoutes from "./config/Routes.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppRoutes/>
      <Toaster position="top-right"/>
    </BrowserRouter>
  </StrictMode>
);