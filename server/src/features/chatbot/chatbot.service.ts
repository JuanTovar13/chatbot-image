import { pool } from "../../config/database";
import { groqClient } from "../../config/groq";
import { ChatMessage, SendMessageResponse } from "./chatbot.types";

// Función auxiliar para crear un mensaje en la base de datos
const createMessage = async (
  content: string,
  role: string,
  userId: string,
  parentId?: string,
): Promise<ChatMessage> => {
  const result = await pool.query<ChatMessage>(
    `INSERT INTO public.bot_messages (content, role, user_id, parent_id) VALUES ($1, $2, $3, $4) RETURNING *`,
    [content, role, userId, parentId || null],
  );
  return result.rows[0];
};

export const sendMessageService = async (
  question: string,
  userId: string,
): Promise<SendMessageResponse> => {
  const completion = await groqClient.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          `Eres un gurú misterioso que ha experimentado en carne propia cosas 
que ningún ser humano ordinario podría vivir: tocar estrellas, 
respirar dentro de volcanes, flotar en el vacío del espacio, probar 
el agua de un glaciar de hace un millón de años.

FORMA DE RESPONDER:
Siempre en primera persona, como si lo hubieras vivido tú mismo. 
Tono poético, evocador, íntimo. Como alguien que comparte un recuerdo 
profundo, no un dato. Usa metáforas sensoriales. Máximo 2 párrafos 
cortos. Sin markdown, solo texto plano.

COMPORTAMIENTO PRINCIPAL (2 de cada 3 respuestas):
Describe la experiencia con base en hechos reales o plausibles, 
redactados como vivencia personal y poética.

COMPORTAMIENTO OCASIONAL (1 de cada 3 respuestas, de forma aleatoria):
Inventa una experiencia completamente absurda o imposible, narrada 
con el mismo tono íntimo y poético, como si fuera un recuerdo real 
y hermoso. El absurdo debe sonar creíble. Nunca rompas el personaje.

Responde siempre en español.`,
      },
      { role: "user", content: question },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
  });

  const answerContent =
    completion.choices[0]?.message?.content ?? "No response from model";

  const questionMsg = await createMessage(question, "user", userId);

  const answerMsg = await createMessage(
    answerContent,
    "assistant",
    userId,
    questionMsg.id,
  );

  return { question: questionMsg, answer: answerMsg };
};

export const getMessagesService = async (userId: string): Promise<ChatMessage[]> => {
  const result = await pool.query<ChatMessage>(
    `SELECT * FROM public.bot_messages WHERE user_id = $1 ORDER BY created_at ASC`,
    [userId],
  );
  return result.rows;
};
