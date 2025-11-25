const mongoose = require('mongoose');
require('dotenv/config');
const Blog = require('../models/blog');

const mongo_connect = process.env.MONGO_CONNECT;

async function addRandomReactions() {
  try {
    await mongoose.connect(`${mongo_connect}/BlogUp`);
    console.log('Connected to MongoDB');

    const blogs = await Blog.find({});
    console.log(`Found ${blogs.length} blogs to update`);

    let updatedCount = 0;

    for (const blog of blogs) {
      // Initialize reactions if they don't exist
      if (!blog.reactions) {
        blog.reactions = {
          heart: { count: 0, users: [] },
          thumbsUp: { count: 0, users: [] },
          informative: { count: 0, users: [] }
        };
      }

      // Generate random counts (0-14 for each reaction)
      blog.reactions.heart.count = Math.floor(Math.random() * 15);
      blog.reactions.thumbsUp.count = Math.floor(Math.random() * 15);
      blog.reactions.informative.count = Math.floor(Math.random() * 15);

      await blog.save();
      updatedCount++;
      console.log(`✓ Updated: "${blog.title}" - ❤️${blog.reactions.heart.count} 👍${blog.reactions.thumbsUp.count} 💡${blog.reactions.informative.count}`);
    }

    console.log('\n=== Migration Complete ===');
    console.log(`Total blogs processed: ${blogs.length}`);
    console.log(`Blogs updated: ${updatedCount}`);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error updating reactions:', error);
    process.exit(1);
  }
}

addRandomReactions();

