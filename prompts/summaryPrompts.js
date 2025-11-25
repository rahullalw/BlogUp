// Content summarization prompts optimized for readability and SEO

const SUMMARY_GENERATION_PROMPT = (content) => {
  return `Create a compelling 2-3 sentence summary of this blog post.

Requirements:
- Include key topics and main takeaways
- Use engaging, readable language
- Optimize for search engines (include relevant keywords naturally)
- Make readers want to click and read more
- Keep it concise but informative

Blog Content:
${content}

Return ONLY the summary text, no extra formatting or labels.`;
};

module.exports = {
  SUMMARY_GENERATION_PROMPT,
};

