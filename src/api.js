const API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;
const BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_KEY}`,
  'HTTP-Referer': 'http://localhost:3000',
  'X-Title': 'Craftly AI'
};

// Use text model for everything - more reliable and faster on free tier
const MODEL = 'meta-llama/llama-3.1-8b-instruct:free';

export async function detectMaterials(imageBase64, mediaType) {
  // Instead of vision model, use text model with a description approach
  // This avoids vision model JSON parsing issues
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-11b-vision-instruct:free',
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:${mediaType || 'image/jpeg'};base64,${imageBase64}` }
            },
            {
              type: 'text',
              text: `List all household items and recyclable materials visible in this image that could be used for DIY crafts.

IMPORTANT: Respond with ONLY a JSON array. No explanation, no markdown, no code blocks.
Format: [{"name":"item name","emoji":"emoji"}]
Example: [{"name":"cardboard box","emoji":"📦"},{"name":"plastic bottle","emoji":"🍾"}]`
            }
          ]
        }],
        max_tokens: 500,
        temperature: 0.1
      })
    });

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '';
    
    // Try multiple JSON extraction strategies
    let materials = tryParseJSON(text);
    
    if (!materials || materials.length === 0) {
      // Fallback: extract from text description
      materials = extractMaterialsFromText(text);
    }

    return materials;
  } catch (err) {
    console.error('Vision error, using fallback:', err);
    return [
      { name: 'cardboard', emoji: '📦' },
      { name: 'plastic bottle', emoji: '🍾' },
      { name: 'paper', emoji: '📄' },
      { name: 'scissors', emoji: '✂️' }
    ];
  }
}

export async function generateCrafts(materials, preferences) {
  const materialsText = materials.join(', ');
  const toolsText = preferences.tools?.length > 0 ? preferences.tools.join(', ') : 'scissors and glue';
  const timestamp = Date.now();

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a DIY craft expert. Always respond with valid JSON only. No markdown, no explanation, just the JSON array.'
        },
        {
          role: 'user',
          content: `Generate 4 unique DIY craft ideas using these materials: ${materialsText}
Skill: ${preferences.skillLevel}, Time: ${preferences.timeAvailable} mins, Purpose: ${preferences.purpose}, Tools: ${toolsText}

Respond with ONLY this JSON array (no markdown, no code blocks):
[{"id":"craft-${timestamp}-1","name":"Craft Name","emoji":"🎨","difficulty":"Easy ⭐","time":"20 mins","materials":["material1"],"steps":[{"title":"Step","description":"Do this"}],"tips":["tip1"]}]`
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'API error');
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';
  const crafts = tryParseJSON(text);
  return crafts || [];
}

function tryParseJSON(text) {
  if (!text) return null;
  
  // Strategy 1: direct parse
  try { return JSON.parse(text.trim()); } catch {}
  
  // Strategy 2: extract array with regex
  try {
    const match = text.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]);
  } catch {}

  // Strategy 3: find first [ to last ]
  try {
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start !== -1 && end !== -1) {
      return JSON.parse(text.substring(start, end + 1));
    }
  } catch {}

  return null;
}

function extractMaterialsFromText(text) {
  // If JSON parsing fails completely, build a basic list from common words
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
  const found = commonMaterials.filter(m => 
    m.keywords.some(k => lowerText.includes(k))
  ).map(m => ({ name: m.name, emoji: m.emoji }));

  return found.length > 0 ? found : [
    { name: 'cardboard', emoji: '📦' },
    { name: 'paper', emoji: '📄' },
    { name: 'plastic bottle', emoji: '🍾' }
  ];
}
