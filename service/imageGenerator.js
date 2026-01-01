const { createCanvas } = require('canvas');

const COLOR_PALETTES = [
  { bg: '#667eea', accent: '#764ba2', text: '#ffffff' },
  { bg: '#f093fb', accent: '#f5576c', text: '#ffffff' },
  { bg: '#4facfe', accent: '#00f2fe', text: '#ffffff' },
  { bg: '#43e97b', accent: '#38f9d7', text: '#ffffff' },
  { bg: '#fa709a', accent: '#fee140', text: '#ffffff' },
  { bg: '#30cfd0', accent: '#330867', text: '#ffffff' },
  { bg: '#a8edea', accent: '#fed6e3', text: '#2c3e50' },
  { bg: '#ff9a9e', accent: '#fecfef', text: '#ffffff' },
  { bg: '#2193b0', accent: '#6dd5ed', text: '#ffffff' },
  { bg: '#ee0979', accent: '#ff6a00', text: '#ffffff' },
];

function getRandomPalette() {
  return COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

async function generateBlogCoverImage(title, blogId) {
  try {
    const width = 1200;
    const height = 630;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const palette = getRandomPalette();

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, palette.bg);
    gradient.addColorStop(1, palette.accent);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add decorative circles
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 200 + 100;
      const circleGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      circleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      circleGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = circleGradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Add title text
    ctx.fillStyle = palette.text;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    let fontSize = title.length < 30 ? 72 : title.length < 50 ? 56 : 48;
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;

    // Wrap text
    const lines = wrapText(ctx, title, width - 150);
    const lineHeight = fontSize * 1.3;
    const totalHeight = lines.length * lineHeight;
    let startY = (height - totalHeight) / 2;

    // Draw text with shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 25;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 12;

    lines.forEach((line) => {
      ctx.fillText(line, width / 2, startY);
      startY += lineHeight;
    });

    // Add "BlogUp" watermark
    ctx.shadowColor = 'transparent';
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText('BlogUp', width / 2, height - 35);

    // Convert to base64 data URI
    const buffer = canvas.toBuffer('image/png');
    const base64Image = buffer.toString('base64');
    const dataUri = `data:image/png;base64,${base64Image}`;
    
    console.log(`✓ Canvas image generated as base64 for blog: ${blogId}`);
    return dataUri;
  } catch (error) {
    console.error('Error generating cover image:', error.message);
    return null;
  }
}

module.exports = {
  generateBlogCoverImage,
};

