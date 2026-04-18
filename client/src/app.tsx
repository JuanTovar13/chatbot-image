import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AxiosProvider } from "./providers/AxiosProvider";
import { ToastProvider } from "./providers/ToastProvider";
import { ChatProvider } from "./providers/ChatProvider";
import { TeachableProvider } from "./providers/TeachableProvider";
import { HomePage } from "./pages/HomePage";
import { ChatPage } from "./pages/ChatPage";
import { TeachablePage } from "./pages/TeachablePage";

export const App = () => {
  return (
    <BrowserRouter>
      <AxiosProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/chat"
              element={
                <ChatProvider>
                  <ChatPage />
                </ChatProvider>
              }
            />
            <Route
              path="/teachable"
              element={
                <TeachableProvider>
                  <TeachablePage />
                </TeachableProvider>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ToastProvider>
      </AxiosProvider>
    </BrowserRouter>
  );
};
