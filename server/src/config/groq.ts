import Groq from "groq-sdk";
import { GROQ_API_KEY } from "./index";

export const groqClient = new Groq({ apiKey: GROQ_API_KEY });
