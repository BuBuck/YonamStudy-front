import { createRoot } from "react-dom/client";

import { AuthProvider } from "./contexts/auth/AuthProvider.jsx";

import App from "./App.jsx";

import "./styles/globals.css";

createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <App />
    </AuthProvider>
);
