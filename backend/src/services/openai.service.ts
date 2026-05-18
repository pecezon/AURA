import OpenAI from 'openai';

export class OpenAIService {
  private openai: OpenAI | null = null;

  constructor() {
    try {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || "",
        timeout: 45 * 1000, // 45 seconds timeout
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

  async generateCourse(
    topic: string,
    courseType: string,
    duration: string,
    applicableNorms: { id: string; code: string; title: string }[]
  ): Promise<any> {
    if (!this.openai || !process.env.OPENAI_API_KEY) {
      throw new Error("Servicio de OpenAI no configurado o sin API Key.");
    }

    const normsList = applicableNorms.map(n => `- ${n.code}: ${n.title}`).join("\n");

    const systemPrompt = `Eres un experto en capacitación técnica y seguridad industrial para Sempra Infraestructura. 
Tu tarea es generar la estructura y contenido detallado de un curso de capacitación enfocado en personal de campo.
El tono debe ser altamente profesional, técnico, práctico y enfocado en la seguridad y prevención de riesgos.

Debes responder ÚNICAMENTE con un objeto JSON válido que cumpla exactamente con la siguiente estructura:

{
  "title": "Título del curso",
  "description": "Descripción general del curso",
  "duration": "Duración en horas (ej. '4')",
  "courseType": "Tipo de curso (ej. 'TECHNICAL')",
  "applicableNorms": ["ID de la normativa 1", "ID de la normativa 2"],
  "modules": [
    {
      "title": "Título del módulo",
      "description": "Descripción del módulo",
      "duration": "Duración estimada (ej. '1 hora')",
      "contents": [
        {
          "title": "Título de la sección de lectura",
          "type": "READING",
          "content": "Texto instructivo altamente detallado y técnico (mínimo 2 o 3 párrafos completos)."
        },
        {
          "title": "Evaluación rápida del módulo",
          "type": "QUIZ",
          "content": "{\\"question\\":\\"Pregunta sobre el módulo\\",\\"options\\":[\\"Opción A\\",\\"Opción B\\",\\"Opción C\\",\\"Opción D\\"],\\"correctAnswer\\":0}"
        }
      ]
    }
  ]
}

Requisitos adicionales:
1. Genera exactamente de 3 a 5 módulos para el curso.
2. Cada módulo debe tener al menos 1 contenido tipo "READING" con información técnica y sustancial, y exactamente 1 contenido tipo "QUIZ" al final para evaluar el aprendizaje del módulo.
3. El contenido debe estar adaptado para personal de campo de Sempra Infraestructura (e.g. manejo de gasoductos, compresión, válvulas de alta presión, LOTO, seguridad eléctrica, espacios confinados).
4. Integra de forma natural y explícita las siguientes normativas aplicables si se proporcionaron:
${normsList || "Ninguna normativa específica proporcionada."}
5. No incluyas explicaciones de Markdown, ni bloques de código triple comilla. Tu respuesta debe ser puramente el objeto JSON crudo listo para ser parseado.`;

    const userPrompt = `Genera un curso sobre el tema: "${topic}" de tipo "${courseType}" con una duración de "${duration}" horas.
Normativas seleccionadas a incorporar (IDs a devolver en applicableNorms): ${JSON.stringify(applicableNorms.map(n => n.id))}`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const resultText = response.choices[0].message.content || "{}";
    return JSON.parse(resultText);
  }
}
