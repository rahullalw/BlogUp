const mongoose = require('mongoose');
require('dotenv/config');
const Blog = require('../models/blog');
const { generateSummary } = require('../service/aiService');
const { generateBlogCoverImage } = require('../service/imageGenerator');

const mongo_connect = process.env.MONGO_CONNECT;

async function updateExistingBlogs() {
  try {
    await mongoose.connect(`${mongo_connect}/BlogUp`);
    console.log('Connected to MongoDB');

    const blogs = await Blog.find({});
    console.log(`Found ${blogs.length} blogs to process`);

    let updatedCount = 0;
    let summaryCount = 0;
    let imageCount = 0;

    for (const blog of blogs) {
      let needsUpdate = false;

      // Generate summary if missing
      if (!blog.summary && blog.body) {
        console.log(`Generating summary for: "${blog.title}"`);
        const summary = await generateSummary(blog.body);
        if (summary) {
          blog.summary = summary;
          summaryCount++;
          needsUpdate = true;
        }
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Generate AI cover image if using default image
      if (blog.coverImageUrl === './images/default-blog.png' || !blog.coverImageUrl) {
        console.log(`Generating AI cover for: "${blog.title}"`);
        const aiImageUrl = await generateBlogCoverImage(blog.title, blog._id);
        if (aiImageUrl) {
          blog.coverImageUrl = aiImageUrl;
          imageCount++;
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        await blog.save();
        updatedCount++;
        console.log(`✓ Updated: "${blog.title}"`);
      }
    }

    console.log('\n=== Migration Complete ===');
    console.log(`Total blogs processed: ${blogs.length}`);
    console.log(`Blogs updated: ${updatedCount}`);
    console.log(`Summaries generated: ${summaryCount}`);
    console.log(`AI images generated: ${imageCount}`);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error updating blogs:', error);
    process.exit(1);
  }
}

updateExistingBlogs();

