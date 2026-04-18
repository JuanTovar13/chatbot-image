# AI LLM — Chat AI + Teachable Machine

Aplicación web con dos herramientas de inteligencia artificial:

1. **Chat AI** — Chatbot potenciado por Groq (LLaMA 3.3 70B). Envía preguntas y recibe respuestas en tiempo real. Todo el historial se guarda en base de datos.
2. **Teachable Machine** — Clasificación de poses en tiempo real usando la cámara. Utiliza un modelo entrenado en [Teachable Machine](https://teachablemachine.withgoogle.com/train) con la librería `@teachablemachine/pose`.

## Stack

| Capa | Tecnologías |
|------|-------------|
| **Client** | Preact, Vite, Tailwind CSS v4, Axios, React Router DOM v7 |
| **Server** | Express v5, TypeScript, PostgreSQL (pg), Groq SDK |
| **Monorepo** | npm workspaces con `concurrently` |

## Modelos de IA

### Chat AI — Groq (LLaMA 3.3 70B Versatile)

El chatbot usa el modelo `llama-3.3-70b-versatile` a través del [Groq SDK](https://console.groq.com). Las respuestas se generan en el servidor y se guardan en PostgreSQL junto con la pregunta del usuario.

- Obtener API key en: https://console.groq.com

### Teachable Machine — Pose Model

El modelo de poses se entrena en [Teachable Machine](https://teachablemachine.withgoogle.com/train) y se exporta como URL. El cliente carga el modelo directamente desde esa URL y clasifica poses en tiempo real usando la cámara del navegador.

**Cómo crear el modelo:**
1. Ir a https://teachablemachine.withgoogle.com/train
2. Seleccionar **Pose Project**
3. Entrenar las clases deseadas usando la cámara
4. Exportar el modelo y copiar la URL generada
5. Pegar la URL en `client/.env` como `VITE_TEACHABLE_MODEL_URL`

## Instalación

```bash
git clone <repo-url>
cd ai-llm
npm install          # instala root + client + server (via postinstall)
```

### Variables de entorno

Copia los archivos de ejemplo y completa los valores:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

**Server** (`server/.env`):
```
PORT=3000
NODE_ENV=development
DB_HOST=
DB_PORT=6543
DB_USER=
DB_PASSWORD=
DB_NAME=postgres
GROQ_API_KEY=           # obtener en console.groq.com
```

**Client** (`client/.env`):
```
VITE_API_URL=                      # solo para producción, en dev usa el proxy de Vite
VITE_TEACHABLE_MODEL_URL=          # URL del modelo exportado de Teachable Machine
```

## Desarrollo

```bash
npm run dev              # server (3000) + client (3001) en paralelo
npm run dev:server       # solo server
npm run dev:client       # solo client
```

## Base de datos

### `public.bot_messages`

Almacena todas las preguntas y respuestas del chat.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK generado automáticamente |
| content | TEXT | Contenido del mensaje |
| role | TEXT | `'user'` o `'assistant'` |
| parent_id | UUID \| NULL | FK → bot_messages. Las respuestas del assistant referencian la pregunta del user |
| created_at | TIMESTAMPTZ | Fecha de creación |

La tabla se crea automáticamente al iniciar el server (`initDb` en `config/database.ts`).

## API

### `GET /api/chatbot`
Retorna todos los mensajes ordenados por `created_at ASC`.

### `POST /api/chatbot`
```json
// Request
{ "question": "¿Qué es TypeScript?" }

// Response (201)
{
  "question": { "id": "...", "content": "¿Qué es TypeScript?", "role": "user", "parent_id": null, "created_at": "..." },
  "answer": { "id": "...", "content": "TypeScript es...", "role": "assistant", "parent_id": "<question.id>", "created_at": "..." }
}
```

## Arquitectura del proyecto

```
ai-llm/
├── package.json                  # scripts: dev, postinstall
├── server/
│   └── src/
│       ├── app.ts                # Express app + routes
│       ├── config/               # database, groq, env vars
│       ├── middlewares/           # error handling (@hapi/boom)
│       └── features/
│           └── chatbot/          # router → controller → service → types
└── client/
    └── src/
        ├── app.tsx               # rutas: / → Home, /chat → Chat, /teachable → Teachable
        ├── components/           # CameraBlockedScreen
        ├── providers/            # AxiosProvider, ToastProvider, ChatProvider, TeachableProvider
        └── pages/                # HomePage, ChatPage, TeachablePage
```
