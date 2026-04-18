import { useState, useRef, useEffect } from "preact/hooks";
import { useNavigate } from "react-router-dom";
import { useChat } from "../providers/ChatProvider";

export const ChatPage = () => {
  const { messages, loading, sending, sendMessage } = useChat();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sending) return;
    setInput("");
    sendMessage(trimmed);
  };

  return (
    <div class="h-svh flex flex-col overflow-hidden" style={{ background: "var(--color-bg)" }}>
      <header
        class="flex items-center gap-3 px-6 py-4 border-b"
        style={{ borderColor: "var(--color-border)", background: "var(--color-bg-subtle)" }}
      >
        <button
          onClick={() => navigate("/")}
          class="p-2 rounded-lg transition-colors duration-200 cursor-pointer"
          style={{ color: "var(--color-text-secondary)" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background =
              "var(--color-surface-hover)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "transparent")
          }
        >
          <svg viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <h1
          class="text-lg font-semibold bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
          }}
        >
          Chat AI
        </h1>
      </header>

      <div class="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {loading ? (
          <div class="flex justify-center pt-20">
            <div
              class="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "var(--color-primary)", borderTopColor: "transparent" }}
            />
          </div>
        ) : messages.length === 0 ? (
          <div class="flex flex-col items-center justify-center pt-20 animate-fade-in">
            <div
              class="p-4 rounded-2xl mb-4"
              style={{ background: "var(--color-primary-light)" }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                class="w-10 h-10"
                style={{ color: "var(--color-primary)" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                />
              </svg>
            </div>
            <p class="text-lg font-medium" style={{ color: "var(--color-text)" }}>
              Inicia la conversación
            </p>
            <p class="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
              Escribe tu pregunta abajo
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              class={`max-w-3xl mx-auto flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              <div
                class={`max-w-[80%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "rounded-2xl rounded-br-md"
                    : "rounded-2xl rounded-bl-md"
                }`}
                style={
                  msg.role === "user"
                    ? {
                        background: "var(--color-primary-deep)",
                        color: "var(--color-text)",
                      }
                    : {
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text)",
                      }
                }
              >
                {msg.content}
              </div>
            </div>
          ))
        )}

        {sending && (
          <div class="max-w-3xl mx-auto flex justify-start">
            <div
              class="px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-2"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <span class="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    class="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      background: "var(--color-text-muted)",
                      animationDelay: `${i * 150}ms`,
                    }}
                  />
                ))}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        class="px-4 py-4 border-t"
        style={{ borderColor: "var(--color-border)", background: "var(--color-bg-subtle)" }}
      >
        <div class="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onInput={(e) => setInput((e.target as HTMLInputElement).value)}
            placeholder="Escribe tu pregunta..."
            disabled={sending}
            class="flex-1 px-4 py-3 rounded-xl text-sm transition-colors duration-200"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            }}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            class="px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "var(--color-primary)",
              color: "var(--color-bg)",
            }}
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
};
