import { createContext } from "preact";
import { useContext, useState, useEffect } from "preact/hooks";
import type { ComponentChildren } from "preact";
import { useAxios } from "./AxiosProvider";
import { useToast } from "./ToastProvider";
import type { ChatMessage, SendMessageResponse } from "../types";

const TEMP_ID_PREFIX = "temp-";

interface ChatContextType {
  messages: ChatMessage[];
  loading: boolean;
  sending: boolean;
  sendMessage: (question: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: ComponentChildren }) => {
  const axios = useAxios();
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get<ChatMessage[]>("/api/chatbot");
      setMessages(data);
    } catch (error) {
      showToast((error as Error).message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const sendMessage = async (question: string) => {
    const tempId = `${TEMP_ID_PREFIX}${Date.now()}`;
    const optimistic: ChatMessage = {
      id: tempId,
      content: question,
      role: "user",
      parent_id: null,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimistic]);
    setSending(true);

    try {
      const { data } = await axios.post<SendMessageResponse>("/api/chatbot", {
        question,
      });
      setMessages((prev) =>
        prev
          .map((m) => (m.id === tempId ? data.question : m))
          .concat(data.answer),
      );
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      showToast((err as Error).message, "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, loading, sending, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
};
