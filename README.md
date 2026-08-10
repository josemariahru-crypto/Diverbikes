# Diverbikes Challenge V4

Aplicación demostrativa con 3 experiencias activas y 30 pruebas.

## Incluye
- Cumpleaños, Familias y Corporate/Team Building.
- GPS + geovallas + modo demo.
- OpenStreetMap / Leaflet.
- Voz: lectura de misiones con SpeechSynthesis y respuestas por micrófono cuando el navegador soporta Web Speech Recognition.
- Competición: rivales simulados, puesto, diferencias y alertas.
- Fotos y vídeos con validación IA REAL cuando se despliega el backend.
- Para vídeo, el navegador extrae 3 fotogramas y los envía al validador multimodal.
- La IA no identifica personas ni infiere atributos sensibles.

## Desplegar en Vercel
1. Sube esta carpeta a un repositorio GitHub.
2. Importa el repositorio en Vercel.
3. En Vercel > Settings > Environment Variables añade:
   OPENAI_API_KEY = tu clave
   OPENAI_MODEL = gpt-5 (opcional)
4. Deploy.

No pongas la clave de OpenAI en `index.html` ni en GitHub.

## Validación IA
`/api/validate-media` usa la Responses API con entradas `input_image`.
Las fotos se envían como data URL. Los vídeos se muestrean localmente en 3 fotogramas para una validación visual razonable del reto.

## Voz
La lectura de audio usa la síntesis de voz del dispositivo. Para una voz de marca más natural se puede añadir un endpoint TTS con OpenAI posteriormente.
