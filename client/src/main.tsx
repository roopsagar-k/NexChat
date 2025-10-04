import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

createRoot(document.getElementById("root")!).render(<App />); 
