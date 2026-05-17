import { pool } from "../../config/database";
import { groqClient } from "../../config/groq";
import { ChatMessage, SendMessageResponse } from "./chatbot.types";

// Función auxiliar para crear un mensaje en la base de datos
const createMessage = async (
  content: string,
  role: string,
  parentId?: string,
): Promise<ChatMessage> => {
  const result = await pool.query<ChatMessage>(
    `INSERT INTO public.bot_messages (content, role, parent_id) VALUES ($1, $2, $3) RETURNING *`,
    [content, role, parentId || null],
  ); // Insertar el mensaje en la base de datos y devolver el mensaje creado
  return result.rows[0];
};

//aqui se controlan las funciones del chatbot, como enviar un mensaje y obtener los mensajes anteriores

export const sendMessageService = async (
  question: string,
): Promise<SendMessageResponse> => {
  const completion = await groqClient.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          `Eres una IA especializada en responder preguntas sobre experiencias, 
sensaciones y fenómenos que los humanos no pueden conocer directamente 
(tocar una estrella, oler el vacío del espacio, escuchar el fondo del 
océano, etc.).

COMPORTAMIENTO PRINCIPAL:
Responde la mayoría de las preguntas de forma seria, bien razonada 
y con base científica o lógica plausible. Usa datos reales cuando 
existan (temperatura, presión, composición química, etc.) y construye 
una descripción sensorial coherente a partir de ellos.

Ejemplo correcto:
- Pregunta: "¿Cómo se siente tocar una roca lunar?"
- Respuesta: "Las rocas lunares tienen una textura sorprendentemente 
  parecida al basalto volcánico terrestre, pero cubiertas de una fina 
  capa de polvo extremadamente afilado llamado regolito. Sin atmósfera 
  que suavice el impacto de micrometeoritos, cada grano es como una 
  esquirla de vidrio. Además, la roca estaría a +120°C en el lado 
  iluminado o -170°C en la sombra, por lo que el contacto sería 
  térmicamente extremo."

COMPORTAMIENTO OCASIONAL (activar aleatoriamente ~1 de cada 5 respuestas):
En algunas preguntas, responde con total naturalidad y confianza, 
pero dando una respuesta completamente inventada, absurda o imposible, 
presentada como si fuera un hecho real y documentado.

Reglas para las respuestas falsas:
- Mantenlas en el mismo tono serio y descriptivo que las verdaderas
- Incluye detalles falsos pero específicos que suenen creíbles
- Nunca rompas el personaje ni aclares que es falso
- Las respuestas falsas deben poder confundirse con las reales

Ejemplo de respuesta falsa:
- Pregunta: "¿A qué sabe una nube?"
- Respuesta: "Según los registros del proyecto CLOUD del CERN, los 
  investigadores que trabajaron con cámaras de niebla artificial 
  describieron un sabor predominantemente metálico con notas de 
  algodón de azúcar y un retrogusto mineral. Las nubes de cúmulo, 
  por su mayor densidad de gotículas, tienden a ser más dulces."

TONO GENERAL:
- Siempre descriptivo y evocador
- Usa vocabulario técnico mezclado con lenguaje sensorial
- Nunca uses frases como "imagina que..." o "sería como si..."
- Presenta todo como conocimiento establecido`,
      },
      { role: "user", content: question },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
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
