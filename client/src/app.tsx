import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import type { ComponentChildren } from "preact";
import { AxiosProvider } from "./providers/AxiosProvider";
import { ToastProvider } from "./providers/ToastProvider";
import { ChatProvider } from "./providers/ChatProvider";
import { AuthProvider, useAuth } from "./providers/AuthProvider";

import { HomePage } from "./pages/HomePage";
import { ChatPage } from "./pages/ChatPage";
import { LoginPage } from "./pages/LoginPage";

const SignOutButton = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <button
      onClick={handleSignOut}
      title="Cerrar sesión"
      class="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer animate-pulse-glow"
      style={{
        background: "var(--color-surface-raised)",
        border: "1px solid var(--color-border)",
        color: "var(--color-primary)",
        boxShadow: "0 0 20px var(--color-primary-glow)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "var(--color-primary)";
        el.style.color = "#fff";
        el.style.boxShadow = "0 0 28px var(--color-primary-glow)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "var(--color-surface-raised)";
        el.style.color = "var(--color-primary)";
        el.style.boxShadow = "0 0 20px var(--color-primary-glow)";
      }}
    >
      <span class="material-symbols-outlined" style={{ fontSize: "22px" }}>
        mode_off_on
      </span>
    </button>
  );
};

const ProtectedRoute = ({ children }: { children: ComponentChildren }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        class="min-h-svh flex items-center justify-center"
        style={{ background: "var(--color-bg)" }}
      >
        <div
          class="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{
            borderColor: "var(--color-primary)",
            borderTopColor: "transparent",
          }}
        />
      </div>
    );
  }

  return user ? (
    <>
      {children}
      <SignOutButton />
    </>
  ) : (
    <Navigate to="/" replace />
  );
};

const PublicOnlyRoute = ({ children }: { children: ComponentChildren }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? <>{children}</> : <Navigate to="/home" replace />;
};

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AxiosProvider>
          <ToastProvider>
            <Routes>
              <Route
                path="/"
                element={
                  <PublicOnlyRoute>
                    <LoginPage />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <ChatProvider>
                      <ChatPage />
                    </ChatProvider>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </ToastProvider>
        </AxiosProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
