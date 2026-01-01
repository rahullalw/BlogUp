const { Router } = require("express");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const multer = require("multer");
const path = require("path");
const { generateTitleSuggestions, generateSummary } = require("../service/aiService");
const { generateBlogCoverImage } = require("../service/imageGenerator");


const router = Router();

function capitalizeWords(str){
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

function removeLeadingDot(str){
  return str.startsWith('.') ? str.slice(1) : str;
}

// Use memory storage and convert to base64
const upload = multer({ storage: multer.memoryStorage() })

router.get("/add-blog", (req, res)=> {
    return res.render("addBlog", {
        user: req.user, //bcz in navigation bar, we need user's detial too here
    });
})

router.get("/:id", async (req, res)=> {
  const blog = await Blog.findById(req.params.id).populate('createdBy');
  const comments = await Comment.find({blogId: req.params.id}).populate('createdBy')
  blog.createdBy.fullName = capitalizeWords(blog.createdBy.fullName)
  
  // Parse markdown content using dynamic import
  let markdownContent = '';
  try {
    const { marked } = await import('marked');
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
    markdownContent = marked.parse(blog.body || '');
  } catch (error) {
    console.error('Error parsing markdown:', error);
    // Fallback to plain text if markdown parsing fails
    markdownContent = blog.body || '';
  }
  
  res.render("blog", {
    user: req.user,
    blog,
    comments,
    markdownContent,
  })
})

router.post("/",upload.single("coverImage") , async (req, res)=> {
    const { title, body } = req.body;
    
    const summary = await generateSummary(body);
    
    // Convert uploaded image to base64 data URI
    let coverImageUrl;
    if (req.file) {
      const base64Image = req.file.buffer.toString('base64');
      const mimeType = req.file.mimetype || 'image/png';
      coverImageUrl = `data:${mimeType};base64,${base64Image}`;
    }
    
    // Generate cover image if no image uploaded
    if (!coverImageUrl) {
        const tempBlog = await Blog.create({
            title,
            body,
            summary,
            createdBy: req.user._id,
            coverImageUrl: "./images/default-blog.png",
        });
        
        const aiImageUrl = await generateBlogCoverImage(title, tempBlog._id);
        if (aiImageUrl) {
            tempBlog.coverImageUrl = aiImageUrl;
            await tempBlog.save();
        }
        
        console.log(`Blog title: "${tempBlog.title}" added with AI-generated cover`);
        return res.redirect(`/blog/${tempBlog._id}`);
    }
    
    const blog = await Blog.create({
        title,
        body,
        summary,
        createdBy: req.user._id,
        coverImageUrl,
    });
    console.log(`Blog title: "${blog.title}" added to database`);
    return res.redirect(`/blog/${blog._id}`);
})

router.post("/comment/:blogId", async (req,res)=> {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  })
  res.redirect(`/blog/${req.params.blogId}`);
})

router.post("/api/suggest-titles", async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.trim().length < 50) {
      return res.json({ titles: [] });
    }
    const titles = await generateTitleSuggestions(content);
    res.json({ titles });
  } catch (error) {
    console.error('Error in suggest-titles:', error.message);
    res.status(500).json({ titles: [], error: 'Failed to generate titles' });
  }
})

router.post("/:id/reaction", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Please sign in to react' });
    }

    const { reaction } = req.body;
    const blogId = req.params.id;
    const userId = req.user._id;

    if (!['heart', 'thumbsUp', 'informative'].includes(reaction)) {
      return res.status(400).json({ success: false, message: 'Invalid reaction type' });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Initialize reactions if they don't exist
    if (!blog.reactions) {
      blog.reactions = {
        heart: { count: 0, users: [] },
        thumbsUp: { count: 0, users: [] },
        informative: { count: 0, users: [] }
      };
    }

    const reactionData = blog.reactions[reaction];
    if (!reactionData) {
      blog.reactions[reaction] = { count: 0, users: [] };
    }

    const userIndex = reactionData.users.findIndex(id => id.toString() === userId.toString());
    let added = false;

    if (userIndex === -1) {
      // User hasn't reacted, add reaction
      reactionData.users.push(userId);
      reactionData.count += 1;
      added = true;
    } else {
      // User already reacted, remove reaction
      reactionData.users.splice(userIndex, 1);
      reactionData.count -= 1;
      added = false;
    }

    await blog.save();

    res.json({
      success: true,
      count: reactionData.count,
      added: added,
      message: added ? `You ${reaction === 'heart' ? 'loved' : reaction === 'thumbsUp' ? 'liked' : 'found informative'} this!` : 'Reaction removed'
    });
  } catch (error) {
    console.error('Error handling reaction:', error);
    res.status(500).json({ success: false, message: 'Error updating reaction' });
  }
})

module.exports = router
