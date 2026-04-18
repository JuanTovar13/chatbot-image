import { useNavigate } from "react-router-dom";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  useTeachable,
} from "../providers/TeachableProvider";
import { CameraBlockedScreen } from "../components/CameraBlockedScreen";

export const TeachablePage = () => {
  const { predictions, cameraBlocked, loading, canvasRef } = useTeachable();
  const navigate = useNavigate();

  const topPrediction = predictions.reduce(
    (best, p) => (p.probability > best.probability ? p : best),
    { className: "", probability: 0 },
  );

  if (cameraBlocked) {
    return <CameraBlockedScreen />;
  }

  return (
    <div
      class="h-svh flex flex-col overflow-hidden"
      style={{ background: "var(--color-bg)" }}
    >
      <header
        class="flex items-center gap-3 px-6 py-4 border-b"
        style={{
          borderColor: "var(--color-border)",
          background: "var(--color-bg-subtle)",
        }}
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
              "linear-gradient(135deg, var(--color-accent), var(--color-success))",
          }}
        >
          Teachable Machine
        </h1>
      </header>

      <div class="flex-1 flex items-center justify-center px-6 py-8 overflow-y-auto">
        {loading ? (
          <div class="flex flex-col items-center gap-4">
            <div
              class="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
              style={{
                borderColor: "var(--color-accent)",
                borderTopColor: "transparent",
              }}
            />
            <p class="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Cargando modelo y cámara...
            </p>
          </div>
        ) : (
          <div class="flex gap-8 items-start">
            <canvas
              ref={canvasRef}
              class="rounded-2xl"
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            />

            <div class="flex flex-col gap-4" style={{ width: 500 }}>
              <div
                class="px-6 py-3 rounded-xl text-2xl font-bold text-center"
                style={{
                  background: "var(--color-accent)",
                  color: "var(--color-bg)",
                }}
              >
                {topPrediction.className} —{" "}
                {(topPrediction.probability * 100).toFixed(0)}%
              </div>

              <div class="space-y-3">
                {predictions.map((p) => (
                  <div key={p.className}>
                    <div class="flex justify-between mb-1">
                      <span
                        class="text-sm font-medium"
                        style={{ color: "var(--color-text)" }}
                      >
                        {p.className}
                      </span>
                      <span
                        class="text-sm"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {(p.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div
                      class="h-3 rounded-full overflow-hidden"
                      style={{ background: "var(--color-surface)" }}
                    >
                      <div
                        class="h-full rounded-full transition-all duration-200"
                        style={{
                          width: `${p.probability * 100}%`,
                          background:
                            p.className === topPrediction.className
                              ? "var(--color-accent)"
                              : "var(--color-text-muted)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
