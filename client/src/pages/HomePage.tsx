import { useNavigate } from "react-router-dom";

const cards = [
  {
    title: "Chat AI",
    description: "Conversa con un modelo de lenguaje potenciado por Groq",
    path: "/chat",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        class="w-10 h-10"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
        />
      </svg>
    ),
    gradient: "from-[var(--color-primary)] to-[var(--color-accent)]",
  },
  {
    title: "Teachable Machine",
    description: "Entrena un modelo para identificar género con tu cámara",
    path: "/teachable",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        class="w-10 h-10"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
        />
      </svg>
    ),
    gradient: "from-[var(--color-accent)] to-[var(--color-success)]",
  },
] as const;

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div class="min-h-svh flex flex-col items-center justify-center px-6 py-12">
      <div class="animate-fade-in text-center mb-16">
        <h1
          class="text-6xl font-bold tracking-tight mb-3 bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
          }}
        >
          AI Lab
        </h1>
        <p class="text-lg" style={{ color: "var(--color-text-secondary)" }}>
          Elige una herramienta para comenzar
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {cards.map((card, i) => (
          <button
            key={card.path}
            onClick={() => navigate(card.path)}
            class="group relative overflow-hidden rounded-2xl p-px cursor-pointer text-left animate-fade-in"
            style={{ animationDelay: `${(i + 1) * 120}ms`, animationFillMode: "backwards" }}
          >
            <div
              class={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />

            <div
              class="relative rounded-2xl p-8 h-full transition-all duration-300 group-hover:translate-y-[-2px]"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                class={`inline-flex p-3 rounded-xl mb-5 bg-gradient-to-br ${card.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}
                style={{ color: "var(--color-bg)" }}
              >
                {card.icon}
              </div>

              <h2 class="text-xl font-semibold mb-2" style={{ color: "var(--color-text)" }}>
                {card.title}
              </h2>
              <p class="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                {card.description}
              </p>

              <div
                class="mt-6 flex items-center gap-1.5 text-sm font-medium opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all duration-300"
                style={{ color: "var(--color-primary)" }}
              >
                Comenzar
                <svg viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
