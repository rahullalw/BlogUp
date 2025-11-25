// Image generation prompts for blog covers using Gemini native image generation

const IMAGE_GENERATION_PROMPT = (title, contentPreview) => {
  return `Create a stunning, professional blog cover image for: "${title}"

Context: ${contentPreview.substring(0, 200)}

Design Requirements:
- Modern, eye-catching design suitable for a professional blog
- Include the title "${title}" prominently with bold, highly readable typography
- Use beautiful gradients or complementary colors that match the theme
- Clean, minimalist aesthetic with clear focal point
- Professional quality with good composition
- Landscape orientation (16:9 aspect ratio)
- Ensure text is large, bold, and easy to read
- Add subtle design elements that relate to the blog topic
- Suitable for social media sharing

Style: Professional blog header with modern design, clear typography, and visual appeal`;
};

module.exports = {
  IMAGE_GENERATION_PROMPT,
};

