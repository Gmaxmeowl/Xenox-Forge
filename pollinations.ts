/**
 * Utility for generating AI image URLs via Pollinations.ai
 * No API keys required.
 */

export const getPollinationsUrl = (prompt: string, width = 1280, height = 720) => {
  const seed = Math.floor(Math.random() * 1000000);
  // Enhanced prompt for better artistic results in a game context
  const enhancers = "high quality, digital art, cinematic lighting, detailed, game asset";
  const fullPrompt = `${prompt}, ${enhancers}`;
  const encodedPrompt = encodeURIComponent(fullPrompt);
  
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true`;
};
