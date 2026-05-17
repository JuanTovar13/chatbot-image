import { useNavigate } from "react-router-dom";

const cards = [
  {
    title: "Chat AI",
    description: "Habla con nuestro modelo de lenguaje avanzado para obtener respuestas rápidas y precisas a tus preguntas.",
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
          Guru AI
        </h1>
        <p class="text-lg" style={{ color: "var(--color-text-secondary)" }}>
          El gurú de la realidad: respuestas sorprendentes a tus preguntas
        </p>
      </div>

      <div class=" max-w-2xl">
        {cards.map((card, i) => (
          <button
            key={card.path}
            onClick={() => navigate(card.path)}
            class="group relative overflow-hidden rounded-2xl p-px cursor-pointer text-left animate-fade-in"
            style={{ animationDelay: `${(i + 1) * 120}ms`, animationFillMode: "backwards" }}
          >
            <div
              class={`absolute inset-0 bg-linear-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />

            <div
              class="relative rounded-2xl p-8 h-full transition-all duration-300 group-hover:-translate-y-0.5"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                class={`inline-flex p-3 rounded-xl mb-5 bg-linear-to-br ${card.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}
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
                class="mt-6 flex items-center gap-1.5 text-sm font-medium opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300"
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
