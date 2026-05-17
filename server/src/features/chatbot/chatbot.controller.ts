import { Request, Response, NextFunction } from "express";
import Boom from "@hapi/boom";
import { sendMessageService, getMessagesService } from "./chatbot.service";

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { question } = req.body; // Validar que la pregunta sea una cadena no vacía

  if (!question || typeof question !== "string" || !question.trim()) {
    throw Boom.badRequest(
      "question is required and must be a non-empty string",
    );
  } // Eliminar espacios en blanco al inicio y al final de la pregunta

  const message = await sendMessageService(question.trim()); // Enviar la pregunta al servicio y obtener la respuesta
  res.status(201).json(message); // Devolver la respuesta al cliente con un código de estado 201 (Created)
};

export const getMessages = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const messages = await getMessagesService();
  res.json(messages);
}; // Controlador para manejar las rutas relacionadas con el chatbot, como enviar un mensaje y obtener los mensajes anteriores
