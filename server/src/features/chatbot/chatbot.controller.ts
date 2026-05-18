import { Request, Response, NextFunction } from "express";
import Boom from "@hapi/boom";
import { sendMessageService, getMessagesService } from "./chatbot.service";

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { question, user_id } = req.body;

  if (!question || typeof question !== "string" || !question.trim()) {
    throw Boom.badRequest("question is required and must be a non-empty string");
  }

  if (!user_id || typeof user_id !== "string") {
    throw Boom.badRequest("user_id is required");
  }

  const message = await sendMessageService(question.trim(), user_id);
  res.status(201).json(message);
};

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { user_id } = req.query;

  if (!user_id || typeof user_id !== "string") {
    throw Boom.badRequest("user_id query param is required");
  }

  const messages = await getMessagesService(user_id);
  res.json(messages);
}; // Controlador para manejar las rutas relacionadas con el chatbot, como enviar un mensaje y obtener los mensajes anteriores
