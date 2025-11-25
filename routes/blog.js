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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./public/uploads`)
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    }
  })
  
  const upload = multer({ storage: storage })

router.get("/add-blog", (req, res)=> {
    return res.render("addBlog", {
        user: req.user, //bcz in navigation bar, we need user's detial too here
    });
})

router.get("/:id", async (req, res)=> {
  const blog = await Blog.findById(req.params.id).populate('createdBy');
  const comments = await Comment.find({blogId: req.params.id}).populate('createdBy')
  // console.log(comments)
  blog.createdBy.fullName = capitalizeWords(blog.createdBy.fullName)
  // blog.createdBy.profileImage = removeLeadingDot(blog.createdBy.profileImage);
  // console.log(blog);
  res.render("blog", {
    user: req.user,
    blog,
    comments,
  })
})

router.post("/",upload.single("coverImage") , async (req, res)=> {
    const { title, body } = req.body;
    
    const summary = await generateSummary(body);
    
    let coverImageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    
    // Generate AI cover image if no image uploaded
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

module.exports = router
