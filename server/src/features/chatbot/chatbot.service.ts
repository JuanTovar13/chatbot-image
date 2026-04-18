import { pool } from "../../config/database";
import { groqClient } from "../../config/groq";
import { ChatMessage, SendMessageResponse } from "./chatbot.types";

const createMessage = async (
  content: string,
  role: string,
  parentId?: string,
): Promise<ChatMessage> => {
  const result = await pool.query<ChatMessage>(
    `INSERT INTO public.bot_messages (content, role, parent_id) VALUES ($1, $2, $3) RETURNING *`,
    [content, role, parentId || null],
  );
  return result.rows[0];
};

export const sendMessageService = async (
  question: string,
): Promise<SendMessageResponse> => {
  const completion = await groqClient.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Tu eres un asistente o chat-bot. Responde de manera concisa y amigable.",
      },
      { role: "user", content: question },
    ],
    model: "llama-3.3-70b-versatile",
  });

  const answerContent =
    completion.choices[0]?.message?.content ?? "No response from model";

  const questionMsg = await createMessage(question, "user");

  const answerMsg = await createMessage(
    answerContent,
    "assistant",
    questionMsg.id,
  );

  return { question: questionMsg, answer: answerMsg };
};

export const getMessagesService = async (): Promise<ChatMessage[]> => {
  const result = await pool.query<ChatMessage>(
    `SELECT * FROM public.bot_messages ORDER BY created_at ASC`,
  );
  return result.rows;
};
