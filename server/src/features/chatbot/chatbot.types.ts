export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  parent_id: string | null;
  user_id: string;
  created_at: string;
}

export interface SendMessageResponse {
  question: ChatMessage;
  answer: ChatMessage;
}

export interface CreateMessageDTO {
  question: string;
  user_id: string;
}
