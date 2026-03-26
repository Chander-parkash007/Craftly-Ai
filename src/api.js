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
              text: `You are a material detection expert. Look VERY carefully at every part of this image and list ALL objects, items, and materials you can see that could be used for DIY crafts or recycling projects.

Be extremely thorough - check every corner, background, and foreground of the image.

Look specifically for:
- Containers: bottles, jars, cans, boxes, cartons, cups, bowls
- Paper items: newspapers, magazines, cardboard, paper bags, envelopes
- Fabric: cloth, clothing, ribbons, strings, yarn, thread
- Small items: buttons, coins, caps, lids, clips, rubber bands
- Natural items: leaves, sticks, stones, shells
- Tools/supplies: scissors, tape, glue, paint, brushes, markers, pens, pencils
- Electronics parts: wires, batteries, old devices
- Kitchen items: egg cartons, toilet rolls, paper towels, foil
- Any other reusable or recyclable material

IMPORTANT: Respond with ONLY a JSON array. No explanation, no markdown, no code blocks. Just the array.
Format exactly like this: [{"name":"item name","emoji":"emoji"},{"name":"item2","emoji":"emoji2"}]`
            }
          ]
        }],
        max_tokens: 800,
        temperature: 0.1
      })
    });

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '';
    
    let materials = tryParseJSON(text);
    
    if (!materials || materials.length === 0) {
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
  const randomSeed = Math.floor(Math.random() * 10000);

  const craftTypes = [
    'home decoration', 'functional storage organizer', 'kids toy or game', 
    'garden or outdoor item', 'wearable accessory', 'wall art', 
    'gift item', 'desk organizer', 'plant holder', 'lamp or lighting'
  ];
  
  // Pick 4 random different craft types to force variety
  const shuffled = craftTypes.sort(() => Math.random() - 0.5).slice(0, 4);

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a highly creative DIY craft expert. You always suggest fresh, unique, surprising craft ideas. Never repeat generic ideas. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: `Generate exactly 4 COMPLETELY DIFFERENT DIY craft ideas. Each must be a different TYPE of craft.

MATERIALS AVAILABLE: ${materialsText}
SKILL LEVEL: ${preferences.skillLevel}
TIME: ${preferences.timeAvailable} minutes  
PURPOSE: ${preferences.purpose}
TOOLS: ${toolsText}
RANDOM SEED: ${randomSeed}

REQUIRED CRAFT TYPES (one idea per type):
1. ${shuffled[0]}
2. ${shuffled[1]}
3. ${shuffled[2]}
4. ${shuffled[3]}

RULES:
- Each craft must be completely different from the others
- Be creative and specific - no generic "pen holder" or "photo frame" ideas
- Use the materials creatively and unexpectedly
- Match the skill level and time limit

Respond with ONLY this JSON array (no markdown, no code blocks, no explanation):
[{"id":"craft-${timestamp}-1","name":"Specific Creative Name","emoji":"🎨","difficulty":"Easy ⭐","time":"20 mins","materials":["material1","material2"],"steps":[{"title":"Step Title","description":"Exactly what to do"}],"tips":["specific helpful tip"]}]`
        }
      ],
      max_tokens: 2500,
      temperature: 1.0
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
