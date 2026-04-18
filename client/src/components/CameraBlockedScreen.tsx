export const CameraBlockedScreen = () => (
  <div
    class="h-svh flex flex-col items-center justify-center gap-6 px-6"
    style={{ background: "var(--color-bg)" }}
  >
    <div
      class="p-5 rounded-2xl"
      style={{ background: "rgba(244, 63, 94, 0.12)" }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        class="w-14 h-14"
        style={{ color: "var(--color-danger)" }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 0 1-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-.409-7.409-7.409"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 4.5 20.25 19.5"
        />
      </svg>
    </div>
    <h2 class="text-xl font-semibold" style={{ color: "var(--color-text)" }}>
      Cámara no disponible
    </h2>
    <p
      class="text-sm max-w-sm text-center"
      style={{ color: "var(--color-text-secondary)" }}
    >
      Habilita el acceso a la cámara en la configuración de tu navegador y
      presiona Reintentar
    </p>
    <button
      onClick={() => globalThis.location.reload()}
      class="px-6 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200"
      style={{
        background: "var(--color-accent)",
        color: "var(--color-bg)",
      }}
    >
      Reintentar
    </button>
  </div>
);
