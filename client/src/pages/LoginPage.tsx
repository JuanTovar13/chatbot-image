import { useState } from "preact/hooks";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { useToast } from "../providers/ToastProvider";

const FIREBASE_MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "Correo o contraseña incorrectos.",
  "auth/user-not-found": "No existe una cuenta con ese correo.",
  "auth/wrong-password": "Contraseña incorrecta.",
  "auth/email-already-in-use": "Ya existe una cuenta con ese correo.",
  "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
  "auth/invalid-email": "El formato del correo no es válido.",
  "auth/too-many-requests": "Demasiados intentos. Intenta más tarde.",
  "auth/popup-closed-by-user": "Ventana cerrada antes de completar el inicio de sesión.",
};

const friendlyError = (err: unknown) => {
  const code = (err as { code?: string })?.code ?? "";
  return FIREBASE_MESSAGES[code] ?? "Ocurrió un error. Intenta de nuevo.";
};

type Mode = "login" | "register";

export const LoginPage = () => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const isLogin = mode === "login";
  const busy = loading || googleLoading;

  const switchMode = (next: Mode) => {
    setMode(next);
    setEmail("");
    setPassword("");
    setConfirm("");
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    if (!isLogin) {
      if (password !== confirm) {
        showToast("Las contraseñas no coinciden.", "error");
        return;
      }
      if (password.length < 6) {
        showToast("La contraseña debe tener al menos 6 caracteres.", "error");
        return;
      }
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmail(email.trim(), password);
      } else {
        await signUpWithEmail(email.trim(), password);
        showToast("¡Cuenta creada exitosamente!", "success");
      }
      navigate("/home");
    } catch (err) {
      showToast(friendlyError(err), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      navigate("/home");
    } catch (err) {
      showToast(friendlyError(err), "error");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div
      class="min-h-svh flex items-center justify-center px-4"
      style={{ background: "var(--color-bg)" }}
    >
      {/* Glow blobs */}
      <div
        class="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--color-primary) 0%, transparent 70%)",
        }}
      />
      <div
        class="pointer-events-none fixed bottom-0 right-0 w-[400px] h-[300px] rounded-full opacity-10 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--color-accent) 0%, transparent 70%)",
        }}
      />

      <div class="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div class="text-center mb-8">
          <h1
            class="text-5xl font-bold tracking-tight mb-2 bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
            }}
          >
            Guru AI
          </h1>
          <p class="text-sm" style={{ color: "var(--color-text-muted)" }}>
            {isLogin
              ? "Inicia sesión para acceder al gurú de la realidad"
              : "Crea tu cuenta y empieza a explorar"}
          </p>
        </div>

        {/* Mode toggle tabs */}
        <div
          class="flex rounded-xl p-1 mb-6"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          {(["login", "register"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              disabled={busy}
              class="flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
              style={
                mode === m
                  ? {
                      background:
                        "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))",
                      color: "#fff",
                      boxShadow: "0 0 16px var(--color-primary-glow)",
                    }
                  : { color: "var(--color-text-muted)" }
              }
            >
              {m === "login" ? "Iniciar sesión" : "Registrarse"}
            </button>
          ))}
        </div>

        {/* Card */}
        <div
          class="rounded-2xl p-8"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "0 0 40px rgba(0,0,0,0.6), 0 0 80px rgba(255,0,127,0.05)",
          }}
        >
          {/* Google button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={busy}
            class="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed mb-6"
            style={{
              background: "var(--color-surface-raised)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            }}
            onMouseEnter={(e) => {
              if (!busy)
                (e.currentTarget as HTMLElement).style.borderColor =
                  "var(--color-text-muted)";
            }}
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor =
                "var(--color-border)")
            }
          >
            {googleLoading ? (
              <span
                class="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin inline-block"
                style={{
                  borderColor: "var(--color-text-muted)",
                  borderTopColor: "transparent",
                }}
              />
            ) : (
              <svg viewBox="0 0 24 24" class="w-5 h-5" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            {isLogin ? "Continuar con Google" : "Registrarse con Google"}
          </button>

          {/* Divider */}
          <div class="flex items-center gap-3 mb-6">
            <div class="flex-1 h-px" style={{ background: "var(--color-border)" }} />
            <span class="text-xs" style={{ color: "var(--color-text-muted)" }}>
              o con correo
            </span>
            <div class="flex-1 h-px" style={{ background: "var(--color-border)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} class="space-y-4">
            <div class="space-y-1.5">
              <label
                class="block text-xs font-medium"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
                placeholder="tu@correo.com"
                required
                disabled={busy}
                class="w-full px-4 py-3 rounded-xl text-sm transition-colors duration-200 disabled:opacity-50"
                style={{
                  background: "var(--color-bg-subtle)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                }}
              />
            </div>

            <div class="space-y-1.5">
              <label
                class="block text-xs font-medium"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                placeholder="••••••••"
                required
                disabled={busy}
                class="w-full px-4 py-3 rounded-xl text-sm transition-colors duration-200 disabled:opacity-50"
                style={{
                  background: "var(--color-bg-subtle)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                }}
              />
            </div>

            {!isLogin && (
              <div class="space-y-1.5 animate-fade-in">
                <label
                  class="block text-xs font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  value={confirm}
                  onInput={(e) => setConfirm((e.target as HTMLInputElement).value)}
                  placeholder="••••••••"
                  required
                  disabled={busy}
                  class="w-full px-4 py-3 rounded-xl text-sm transition-colors duration-200 disabled:opacity-50"
                  style={{
                    background: "var(--color-bg-subtle)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text)",
                  }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={busy || !email.trim() || !password || (!isLogin && !confirm)}
              class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed mt-2 animate-pulse-glow"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))",
                color: "#fff",
              }}
            >
              {loading && (
                <span
                  class="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin inline-block"
                  style={{ borderColor: "#fff", borderTopColor: "transparent" }}
                />
              )}
              {isLogin ? "Iniciar sesión" : "Crear cuenta"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
