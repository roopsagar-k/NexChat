import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./hooks/ThemeProvider";
import AuthPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider } from "./hooks/AuthProvider";
import HomePage from "./pages/HomePage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/sonner";
import { SocketProvider } from "./context/SocketProvider";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <SocketProvider>
            <Routes>
              <Route path="/" element={<AuthPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster />
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
