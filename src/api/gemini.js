// Gemini API utility
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

let lastRequestTime = 0;
const MIN_INTERVAL = 1100; // 1.1 seconds between requests (60 RPM safety)

export async function sendToGemini({ prompt, content, isImage = false }) {
  // Throttle requests in-memory
  const now = Date.now();
  if (now - lastRequestTime < MIN_INTERVAL) {
    throw new Error('Please wait a moment before trying again.');
  }
  lastRequestTime = now;

  let requestBody;
  if (isImage) {
    requestBody = {
      contents: [
        { parts: [
          { text: prompt },
          { inlineData: { mimeType: 'image/png', data: content } }
        ] }
      ]
    };
  } else {
    requestBody = {
      contents: [
        { parts: [ { text: prompt + '\n' + content } ] }
      ]
    };
  }
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });
  if (res.status === 429) {
    throw new Error('rate limit reached - try in 1 minute');
  }
  if (!res.ok) {
    throw new Error('error: ' + res.statusText);
  }
  const data = await res.json();
  // Parse the response to get the generated text
  const result = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return result;
} 


