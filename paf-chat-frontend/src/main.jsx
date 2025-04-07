import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {BrowserRouter} from "react-router";
import AppRoutes from "./config/routes.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppRoutes/>
    </BrowserRouter>
  </StrictMode>
);
