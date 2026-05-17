import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AxiosProvider } from "./providers/AxiosProvider";
import { ToastProvider } from "./providers/ToastProvider";
import { ChatProvider } from "./providers/ChatProvider";

import { HomePage } from "./pages/HomePage";
import { ChatPage } from "./pages/ChatPage";


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
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ToastProvider>
      </AxiosProvider>
    </BrowserRouter>
  );
};
