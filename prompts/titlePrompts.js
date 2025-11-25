// SEO and GEO optimized title generation prompts

const TITLE_GENERATION_PROMPT = (content, userLocation = null) => {
  const locationContext = userLocation ? `\nUser Location: ${userLocation}` : '';
  
  return `You are an expert SEO copywriter. Generate 3 highly optimized blog titles based on the content below.

Requirements:
1. SEO-Friendly: Include relevant keywords naturally, use power words, keep under 60 characters
2. Click-worthy: Use numbers, questions, or actionable language
3. Search-Optimized: Structure for featured snippets and voice search
4. Clear & Descriptive: Accurately represent the content
${locationContext ? '5. Location-Aware: Consider geographic relevance when applicable' : ''}

Content Preview:
${content.substring(0, 500)}${locationContext}

Return ONLY 3 titles, one per line, without numbering, quotes, or extra formatting.`;
};

module.exports = {
  TITLE_GENERATION_PROMPT,
};

