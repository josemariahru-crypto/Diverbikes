import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido"
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({
      error: "OPENAI_API_KEY no configurada"
    });
  }

  try {
    const {
      kind,
      task,
      criteria,
      images
    } = req.body || {};

    if (
      !task ||
      !Array.isArray(criteria) ||
      !Array.isArray(images) ||
      images.length === 0
    ) {
      return res.status(400).json({
        error: "Faltan datos para validar la prueba"
      });
    }

    const criteriaText = criteria
      .map((criterion, index) => `${index + 1}. ${criterion}`)
      .join("\n");

    const prompt = `
Eres el Game Master visual de Diverbikes Challenge.

Debes comprobar si la foto o los fotogramas del vídeo cumplen REALMENTE la prueba solicitada.

PRUEBA:
${task}

CRITERIOS OBLIGATORIOS:
${criteriaText}

REGLAS:
- Sé estricto pero razonable.
- La prueba solo es válida si se cumplen TODOS los criterios visibles.
- No identifiques a ninguna persona.
- No intentes averiguar nombres, identidad, raza, religión, salud u otros atributos sensibles.
- No des por cumplido un criterio si no puedes verlo con suficiente claridad.
- Si hay varios fotogramas de vídeo, evalúalos conjuntamente.
- Si la acción parece peligrosa, indica que no es válida.
- Responde en español.
`;

    const content = [
      {
        type: "input_text",
        text: prompt
      },
      ...images.slice(0, 4).map((imageUrl) => ({
        type: "input_image",
        image_url: imageUrl,
        detail: "auto"
      }))
    ];

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5",
      input: [
        {
          role: "user",
          content
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "diverbikes_validation",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              valid: {
                type: "boolean"
              },
              confidence: {
                type: "integer",
                minimum: 0,
                maximum: 100
              },
              feedback: {
                type: "string"
              },
              checks: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    criterion: {
                      type: "string"
                    },
                    pass: {
                      type: "boolean"
                    },
                    note: {
                      type: "string"
                    }
                  },
                  required: [
                    "criterion",
                    "pass",
                    "note"
                  ]
                }
              }
            },
            required: [
              "valid",
              "confidence",
              "feedback",
              "checks"
            ]
          }
        }
      }
    });

    const result = JSON.parse(response.output_text);

    return res.status(200).json(result);

  } catch (error) {
    console.error("Diverbikes validation error:", error);

    return res.status(500).json({
      error: "No se pudo validar la prueba con IA"
    });
  }
}
