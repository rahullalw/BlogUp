const { GoogleGenerativeAI } = require("@google/generative-ai");
const { TITLE_GENERATION_PROMPT } = require("../prompts/titlePrompts");
const { SUMMARY_GENERATION_PROMPT } = require("../prompts/summaryPrompts");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateTitleSuggestions(content, userLocation = null) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = TITLE_GENERATION_PROMPT(content, userLocation);

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    const titles = response.split('\n')
      .filter(line => line.trim().length > 0)
      .slice(0, 3);
    
    return titles;
  } catch (error) {
    console.error('Error generating title suggestions:', error.message);
    return [];
  }
}

async function generateSummary(content) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = SUMMARY_GENERATION_PROMPT(content);

    const result = await model.generateContent(prompt);
    const summary = result.response.text().trim();
    
    return summary;
  } catch (error) {
    console.error('Error generating summary:', error.message);
    return null;
  }
}

module.exports = {
  generateTitleSuggestions,
  generateSummary,
};

