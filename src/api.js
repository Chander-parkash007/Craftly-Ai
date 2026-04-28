const GROQ_KEY = process.env.REACT_APP_GROQ_API_KEY;

// Enhanced logging for debugging (especially on Vercel)
console.log('=== Craftly AI - API Configuration ===');
console.log('Environment:', process.env.NODE_ENV);
console.log('Groq key loaded:', GROQ_KEY ? 'YES (' + GROQ_KEY.substring(0, 8) + '...)' : 'NO - KEY MISSING');
console.log('Key length:', GROQ_KEY ? GROQ_KEY.length : 0);
console.log('Key starts with gsk_:', GROQ_KEY ? GROQ_KEY.startsWith('gsk_') : false);

// Check if API key is valid (not placeholder)
const isValidKey = GROQ_KEY && 
                   GROQ_KEY !== 'paste_your_groq_key_here' && 
                   GROQ_KEY.length > 20 && 
                   GROQ_KEY.startsWith('gsk_');

console.log('API key is valid:', isValidKey);
console.log('=====================================');

// Groq for vision (image detection) - fast and free
async function detectWithGroq(imageBase64, mediaType) {
  if (!isValidKey) {
    throw new Error('API key not configured. Please add your Groq API key to the .env file.');
  }

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_KEY}`
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { 
              url: `data:${mediaType || 'image/jpeg'};base64,${imageBase64}`
            }
          },
          {
            type: 'text',
            text: `Analyze this image and list all craft materials, recyclables, or household items that could be used for DIY crafts. Return ONLY a JSON array in this exact format: [{"name":"item name","emoji":"appropriate emoji"}]. Be specific and practical.`
          }
        ]
      }],
      max_tokens: 500,
      temperature: 0.3
    })
  });

  if (!res.ok) {
    const errData = await res.json();
    console.error('Groq API error response:', errData);
    throw new Error(errData.error?.message || 'Groq vision API error');
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

// Groq for text generation (craft ideas)
async function generateWithGroq(prompt) {
  if (!isValidKey) {
    throw new Error('API key not configured. Please add your Groq API key to the .env file.');
  }

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are a creative DIY craft expert. Always respond with valid JSON only. No markdown, no explanation, no code blocks - just pure JSON array.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 3000,
      temperature: 0.9
    })
  });

  if (!res.ok) {
    const errData = await res.json();
    console.error('Groq API error response:', errData);
    throw new Error(errData.error?.message || 'Groq generation API error');
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

export async function detectMaterials(imageBase64, mediaType) {
  try {
    const text = await detectWithGroq(imageBase64, mediaType);
    console.log('Groq vision response:', text);
    const materials = tryParseJSON(text) || extractMaterialsFromText(text);
    if (materials && materials.length > 0) {
      console.log('Detected materials:', materials);
      return materials;
    }
  } catch (err) {
    console.error('Groq vision error:', err);
    // If API key is missing, throw error to show user
    if (err.message.includes('API key not configured')) {
      throw err;
    }
  }

  // Fallback materials
  console.log('Using fallback materials');
  return [
    { name: 'cardboard box', emoji: '📦' },
    { name: 'plastic bottle', emoji: '🍾' },
    { name: 'paper', emoji: '📄' },
    { name: 'fabric scraps', emoji: '🧵' }
  ];
}

export async function generateCrafts(materials, preferences) {
  const materialsText = materials.join(', ');
  const toolsText = preferences.tools?.length > 0 ? preferences.tools.join(', ') : 'scissors and glue';
  const timestamp = Date.now();
  const randomSeed = Math.floor(Math.random() * 10000);

  const craftTypes = [
    'home decoration', 'functional storage organizer', 'kids toy or game',
    'garden or outdoor item', 'wearable accessory', 'wall art',
    'gift item', 'desk organizer', 'plant holder', 'lamp or lighting',
    'jewelry', 'picture frame', 'bookmark', 'coaster set'
  ];
  const shuffled = craftTypes.sort(() => Math.random() - 0.5).slice(0, 4);

  const prompt = `Create exactly 4 UNIQUE and CREATIVE DIY craft projects using these materials.

AVAILABLE MATERIALS: ${materialsText}
SKILL LEVEL: ${preferences.skillLevel}
TIME AVAILABLE: ${preferences.timeAvailable} minutes
PURPOSE: ${preferences.purpose}
TOOLS AVAILABLE: ${toolsText}
RANDOM SEED: ${randomSeed}

REQUIRED CRAFT TYPES (one of each): ${shuffled.join(', ')}

IMPORTANT RULES:
- Each craft must be completely different from the others
- Use creative, appealing names (not generic)
- Steps should be clear and actionable
- Include 2-3 helpful tips for each craft
- Make crafts appropriate for the skill level and time

Return ONLY a JSON array (no markdown, no code blocks):
[
  {
    "id": "craft-${timestamp}-1",
    "name": "Creative Craft Name",
    "emoji": "🎨",
    "difficulty": "Easy ⭐",
    "time": "20 mins",
    "materials": ["material1", "material2"],
    "steps": [
      {"title": "Step Title", "description": "Clear action to take"}
    ],
    "tips": ["Helpful tip 1", "Helpful tip 2"]
  }
]`;

  try {
    const text = await generateWithGroq(prompt);
    console.log('Groq generation response:', text);
    const crafts = tryParseJSON(text);
    if (crafts && Array.isArray(crafts) && crafts.length > 0) {
      console.log('Generated crafts:', crafts);
      return crafts;
    }
  } catch (err) {
    console.error('Generation error:', err);
    // If API key is missing, throw error to show user
    if (err.message.includes('API key not configured')) {
      throw err;
    }
  }

  console.log('Using fallback crafts');
  return [];
}

function tryParseJSON(text) {
  if (!text) return null;
  try { return JSON.parse(text.trim()); } catch {}
  try {
    const match = text.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]);
  } catch {}
  try {
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start !== -1 && end !== -1) return JSON.parse(text.substring(start, end + 1));
  } catch {}
  return null;
}

function extractMaterialsFromText(text) {
  const commonMaterials = [
    { keywords: ['bottle', 'plastic'], name: 'plastic bottle', emoji: '🍾' },
    { keywords: ['cardboard', 'box', 'carton'], name: 'cardboard', emoji: '📦' },
    { keywords: ['paper', 'newspaper', 'magazine'], name: 'paper', emoji: '📄' },
    { keywords: ['fabric', 'cloth', 'textile'], name: 'fabric', emoji: '🧵' },
    { keywords: ['can', 'tin', 'aluminum'], name: 'tin can', emoji: '🥫' },
    { keywords: ['jar', 'glass'], name: 'glass jar', emoji: '🫙' },
    { keywords: ['roll', 'tube', 'toilet'], name: 'cardboard tube', emoji: '🧻' },
    { keywords: ['button', 'ribbon', 'string'], name: 'buttons', emoji: '🔘' },
  ];
  const lowerText = text.toLowerCase();
  const found = commonMaterials.filter(m => m.keywords.some(k => lowerText.includes(k)));
  return found.length > 0 ? found.map(m => ({ name: m.name, emoji: m.emoji })) : [
    { name: 'cardboard', emoji: '📦' },
    { name: 'paper', emoji: '📄' },
    { name: 'plastic bottle', emoji: '🍾' }
  ];
}
