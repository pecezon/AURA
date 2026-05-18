import OpenAI from 'openai';

export class OpenAIService {
  private openai: OpenAI | null = null;

  constructor() {
    try {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || "",
      });
    } catch (e) {
      console.error("OpenAI initialization error:", e);
    }
  }

  async analyzeBehavior(eventsJson: string): Promise<string> {
    if (!this.openai || !process.env.OPENAI_API_KEY) {
      return "Análisis conductual no disponible (API Key no configurada).";
    }
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Eres un experto en seguridad industrial evaluando una simulación. El usuario busca peligros en una imagen. Analiza el siguiente JSON de eventos (clics y remociones) y describe la confianza y posibles áreas de mejora del trabajador en no más de 3 oraciones. Considera que remover marcadores (REMOVE_PIN) indica indecisión."
          },
          {
            role: "user",
            content: eventsJson
          }
        ],
        max_tokens: 150
      });

      return response.choices[0].message.content || "Análisis no disponible.";
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      return "Análisis conductual no disponible por error en el servicio AI.";
    }
  }
}
