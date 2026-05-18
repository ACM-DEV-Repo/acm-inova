import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const GEMINI_KEY = Deno.env.get('GEMINI_API_KEY') || '';
const GEMINI_MODEL = 'nano-banana-pro-preview';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`;

const PRESETS: Record<string, string> = {
  professional: `Edit this photo into a professional speaker portrait. Crop from chest up only - head, neck, shoulders, upper chest. NO hands visible, NO arms visible, NO full body. Clean dark gradient background. Soft professional studio lighting - warm frontal key light, gentle fill. The person keeps their EXACT original expression from the photo. Keep the SAME clothing the person is wearing in the original photo - do NOT change their outfit, do NOT add blazer or suit if they are not wearing one. Professional but natural - like a LinkedIn headshot of a successful CEO. Square format 1024x1024. CRITICAL: Do NOT change the face AT ALL. Same exact face shape, same jawline, same weight, same skin tone, same features. Same clothing. Only change the background and lighting.`,

  cinematic: `Transform this photo into a cinematic hyper-realistic digital painting portrait, like a Hollywood movie poster key art. Chest up framing showing shoulders and upper chest. Keep the SAME clothing the person is wearing in the original photo - do NOT change their outfit. Slight 3/4 face angle - the person is looking slightly to the left of camera, not straight on. Eyes still engaging the viewer but from a slight angle. The skin has a subtly smoothed airbrushed quality but still looks real - NOT cartoon, NOT anime, NOT too smooth. Rich saturated warm skin tones, dramatic cinematic lighting with rim light from behind on one side and warm key light from the other. Deep contrast with dark atmospheric background with subtle smoke or haze. Heroic, confident, charismatic energy. Subtle film grain texture. Square 1024x1024. CRITICAL: Preserve the EXACT face shape, jawline, bone structure, body proportions and weight. Do NOT make the face wider, rounder, or heavier. Do NOT alter ANY facial features. Keep exact same person. Keep their original clothing.`,
};

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

  try {
    if (!GEMINI_KEY) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), {
        status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    // Payload size limit (5MB max)
    const contentLength = parseInt(req.headers.get('content-length') || '0');
    if (contentLength > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'Payload too large (max 5MB)' }), {
        status: 413, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    const { image, mimeType, preset } = await req.json();

    if (!image || !preset) {
      return new Response(JSON.stringify({ error: 'Missing image or preset' }), {
        status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    // Validate base64 size (max ~4MB image)
    if (image.length > 6_800_000) {
      return new Response(JSON.stringify({ error: 'Image too large' }), {
        status: 413, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    // Whitelist mimeType
    const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const safeMime = ALLOWED_MIMES.includes(mimeType) ? mimeType : 'image/png';

    const prompt = PRESETS[preset];
    if (!prompt) {
      return new Response(JSON.stringify({ error: `Unknown preset: ${preset}. Available: ${Object.keys(PRESETS).join(', ')}` }), {
        status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    // Call Gemini
    const geminiRes = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [
          { inlineData: { mimeType: safeMime, data: image } },
          { text: prompt },
        ]}],
        generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini error:', errText);
      return new Response(JSON.stringify({ error: 'Gemini API error', details: errText.slice(0, 200) }), {
        status: 502, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    const data = await geminiRes.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: Record<string, unknown>) => p.inlineData);

    if (!imagePart?.inlineData?.data) {
      return new Response(JSON.stringify({ error: 'No image in Gemini response' }), {
        status: 502, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      image: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType || 'image/png',
    }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('generate-portrait error:', err);
    return new Response(JSON.stringify({ error: 'Internal error', message: String(err) }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
});
