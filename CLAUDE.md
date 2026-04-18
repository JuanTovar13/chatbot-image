# AI LLM — Chat AI + Teachable Machine

## Stack

- **Client**: Preact + Vite + Tailwind CSS v4 + Axios + React Router DOM v7 (via preact/compat)
- **Server**: Express v5 + TypeScript + PostgreSQL (via pg) + Groq SDK
- **Monorepo**: root `package.json` with `concurrently`

## Commands

```bash
npm install          # installs root deps + triggers postinstall (client + server)
npm run dev          # runs server (port 3000) + client (port 3001) in parallel
npm run dev:server   # server only (nodemon, port 3000)
npm run dev:client   # client only (vite, port 3001)
```

## Environment Variables

### Server (`server/.env`)
```
PORT=3000
NODE_ENV=development
DB_HOST=
DB_PORT=6543
DB_USER=
DB_PASSWORD=
DB_NAME=postgres
GROQ_API_KEY=
```

### Client (`client/.env`)
```
VITE_API_URL=        # production only, dev uses vite proxy
```

## Architecture

### Server

```
server/src/
  app.ts                          # Express app, routes, middleware, initDb + listen
  config/
    index.ts                      # env vars: PORT, NODE_ENV, DB_*, GROQ_API_KEY
    database.ts                   # pg Pool + initDb() — creates bot_messages table
    groq.ts                       # Groq client instance
  middlewares/
    errorsMiddleware.ts           # @hapi/boom error handling
  features/
    chatbot/
      chatbot.router.ts           # GET /, POST /
      chatbot.controller.ts       # validates question input
      chatbot.service.ts          # calls Groq SDK, saves messages to DB, fetches history
      chatbot.types.ts            # ChatMessage, SendMessageResponse, CreateMessageDTO
```

**Pattern**: each feature has router → controller → service → types. Controllers validate input, services hold business logic and SQL queries.

**Routes mounted in app.ts**:
- `/api/chatbot` → chatbot.router

**Database**: PostgreSQL via Supabase (connection only, no Supabase client). No auth required.

### Database Schema

```sql
CREATE TABLE IF NOT EXISTS public.bot_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  role TEXT NOT NULL,
  parent_id UUID REFERENCES public.bot_messages(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

- `role`: `'user'` for questions, `'assistant'` for Groq responses
- `parent_id`: assistant messages reference the user message they reply to

### API Endpoints

#### Chatbot
- `GET /api/chatbot` — list all messages ordered by created_at ASC
- `POST /api/chatbot` — `{ question: string }` → inserts user message, calls Groq (llama-3.3-70b-versatile), inserts assistant message with parent_id, returns `{ question: ChatMessage, answer: ChatMessage }`

### Client

```
client/src/
  main.tsx                         # render
  app.tsx                          # BrowserRouter > AxiosProvider > ToastProvider > Routes
                                   # Routes: / → HomePage, /chat → ChatProvider > ChatPage
  types.ts                         # ChatMessage, SendMessageResponse
  providers/
    AxiosProvider.tsx              # axios instance with error interceptor
    ToastProvider.tsx              # toast notifications (success/error/info) with auto-dismiss
    ChatProvider.tsx               # chat state: messages, loading, sending, sendMessage()
  pages/
    HomePage.tsx                   # two cards: Chat AI (/chat) + Teachable Machine (/teachable)
    ChatPage.tsx                   # full chat UI with fixed header/input, scrollable message area
```

### ChatProvider (core logic)

**State**: `messages`, `loading`, `sending`

**Functions**:
- `fetchMessages()` — GET /api/chatbot on mount
- `sendMessage(question)` — optimistic update (adds temp user message immediately), POST /api/chatbot, replaces temp with real question + appends answer. On error, removes temp message.

### Message rendering

Each `ChatMessage` is rendered individually:
- `role: 'user'` → right-aligned bubble (indigo)
- `role: 'assistant'` → left-aligned bubble (surface)
- While `sending`, bouncing dots appear on the left

## Conventions

- Use `export const X = () =>` for all components, providers, and hooks
- One component per file
- Preact: use `preact/hooks`, `preact/compat` for React-compatible libraries (react-router-dom)
- CSS: Tailwind CSS v4 with CSS variables (primary: indigo #818CF8, accent: cyan #22D3EE)
- HTTP errors: `@hapi/boom` on the server
- No auth — all endpoints are public
