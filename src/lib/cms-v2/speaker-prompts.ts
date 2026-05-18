/**
 * Prompts padronizados para transformação de fotos via IA.
 * Usados no SpeakerPortraitV2 com Google Nano Banana Pro (Gemini API).
 * REGRA: sempre usar a foto ORIGINAL como input, nunca resultado de geração anterior.
 */

export const PORTRAIT_PRESETS = [
  {
    key: 'professional',
    label: 'Profissional',
    description: 'Headshot limpo, fundo escuro, iluminação de estúdio',
    prompt: `Edit this photo into a professional speaker portrait. Crop from chest up only - head, neck, shoulders, upper chest. NO hands visible, NO arms visible, NO full body. Clean dark gradient background. Soft professional studio lighting - warm frontal key light, gentle fill. The person keeps their EXACT original expression from the photo. Keep the SAME clothing the person is wearing in the original photo - do NOT change their outfit, do NOT add blazer or suit if they are not wearing one. Professional but natural - like a LinkedIn headshot of a successful CEO. Square format 1024x1024. CRITICAL: Do NOT change the face AT ALL. Same exact face shape, same jawline, same weight, same skin tone, same features. Same clothing. Only change the background and lighting.`,
  },
  {
    key: 'cinematic',
    label: 'Cinematográfico',
    description: 'Estilo poster de filme, digital painting hyper-realistic',
    prompt: `Transform this photo into a cinematic hyper-realistic digital painting portrait, like a Hollywood movie poster key art. Chest up framing showing shoulders and upper chest. Keep the SAME clothing the person is wearing in the original photo - do NOT change their outfit. Slight 3/4 face angle - the person is looking slightly to the left of camera, not straight on. Eyes still engaging the viewer but from a slight angle. The skin has a subtly smoothed airbrushed quality but still looks real - NOT cartoon, NOT anime, NOT too smooth. Rich saturated warm skin tones, dramatic cinematic lighting with rim light from behind on one side and warm key light from the other. Deep contrast with dark atmospheric background with subtle smoke or haze. Heroic, confident, charismatic energy. Subtle film grain texture. Square 1024x1024. CRITICAL: Preserve the EXACT face shape, jawline, bone structure, body proportions and weight. Do NOT make the face wider, rounder, or heavier. Do NOT alter ANY facial features. Keep exact same person. Keep their original clothing.`,
  },
] as const;

export type PortraitPresetKey = typeof PORTRAIT_PRESETS[number]['key'];

/** Gemini API config */
export const GEMINI_MODEL = 'nano-banana-pro-preview';
export const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
