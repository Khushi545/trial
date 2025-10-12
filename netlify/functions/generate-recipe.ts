import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'OPENAI_API_KEY not set' }) };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { ingredients, servings = 4, dietaryRestrictions = [], cuisine = 'any' } = body;

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'ingredients must be a non-empty array' }) };
    }

    const stepsTarget = 6 + Math.floor(Math.random() * 5); // 6-10 steps for variety

    const prompt = `Create a practical, delicious recipe using these ingredients: ${ingredients.join(', ')}.

Constraints:
- Servings: ${servings}
- Dietary restrictions: ${dietaryRestrictions.length > 0 ? dietaryRestrictions.join(', ') : 'none'}
- Cuisine preference: ${cuisine}

Output requirements:
- Provide exactly ${stepsTarget} short, actionable steps in plain text (no numbering characters like "1."; just the sentence).
- Vary the phrasing and technique across requests; include timings/temperatures where useful; avoid repeating identical wording between steps.
- If a suitable image URL is known (royalty-free, publicly accessible), set the image field to that URL; otherwise leave it empty.

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
        max_tokens: 900,
        temperature: 0.9,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'OpenAI error', detail: text }) };
    }

    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content || '';
    const json = JSON.parse(content);

    // Build a dish-relevant image if none provided (stable Unsplash Source using signature)
    const queryBase = `${json.name || 'dish'} ${ingredients.join(' ')}`.trim();
    const query = encodeURIComponent(queryBase);
    const sig = Array.from(queryBase).reduce((acc, ch) => ((acc << 5) - acc + ch.charCodeAt(0)) | 0, 0);
    const fallbackImage = `https://source.unsplash.com/1200x600/?food,${query}&sig=${Math.abs(sig)}`;

    const normalizedSteps: string[] = Array.isArray(json.steps)
      ? json.steps.map((s: unknown) => String(s).replace(/^\s*\d+\.?\s*/,'').trim()).filter(Boolean)
      : [];

    const recipe = {
      id: Date.now().toString(),
      name: json.name,
      description: json.description,
      ingredients: Array.isArray(json.ingredients) ? json.ingredients : [],
      steps: normalizedSteps,
      image: typeof json.image === 'string' && /^https?:\/\//.test(json.image) && json.image.trim() ? json.image : fallbackImage,
    };

    return { statusCode: 200, headers, body: JSON.stringify(recipe) };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Unhandled server error', detail: msg }) };
  }
};
