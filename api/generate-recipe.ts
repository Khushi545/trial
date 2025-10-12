import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Server misconfiguration: OPENAI_API_KEY not set' });
  }

  try {
    const { ingredients, servings = 4, dietaryRestrictions = [], cuisine = 'any' } = req.body || {};
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'ingredients must be a non-empty array' });
    }

    const prompt = `Create a practical, delicious recipe using these ingredients: ${ingredients.join(', ')}.

Constraints:
- Servings: ${servings}
- Dietary restrictions: ${dietaryRestrictions.length > 0 ? dietaryRestrictions.join(', ') : 'none'}
- Cuisine preference: ${cuisine}

Respond ONLY with a single JSON object in this exact schema (no markdown, no commentary):
{
  "name": string,
  "description": string,
  "ingredients": string[],
  "steps": string[],
  "image": string
}`;

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional chef. Output strict JSON only.' },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 800,
        temperature: 0.6,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(502).json({ error: 'OpenAI error', detail: text });
    }

    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content || '';
    const json = JSON.parse(content);

    const recipe = {
      id: Date.now().toString(),
      name: json.name,
      description: json.description,
      ingredients: Array.isArray(json.ingredients) ? json.ingredients : [],
      steps: Array.isArray(json.steps) ? json.steps : [],
      image: typeof json.image === 'string' ? json.image : '',
    };

    return res.status(200).json(recipe);
  } catch (e: any) {
    return res.status(500).json({ error: 'Unhandled server error', detail: String(e?.message || e) });
  }
}
