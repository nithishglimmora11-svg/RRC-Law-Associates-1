require('dotenv').config();

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing from .env');
  }

  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });

  const response = await ai.interactions.create({
    model: 'gemini-3.8-flash',
    input: 'Reply with exactly: Gemini API connection successful.'
  });

  console.log('Gemini response:', response.output_text);
}

main().catch((error) => {
  console.error('Gemini test failed.');
  console.error('Error name:', error.name || 'Unknown');
  console.error('HTTP status:', error.status || 'Unavailable');
  console.error('Message:', error.message || 'No details available');
  process.exitCode = 1;
});
