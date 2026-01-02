# BlogUp

A modern, AI-powered full-stack blog platform built with Node.js and Express. Create, share, and discover blog posts with intelligent AI features that enhance content creation and engagement.

## Features

- **Secure Authentication** - JWT-based auth with HTTP-only cookies and password hashing
- **Rich Blog Creation** - Markdown support, cover image uploads, and AI-powered enhancements
- **AI-Powered Features**:
  - **Smart Title Suggestions** - SEO-optimized titles generated from your content
  - **Auto Summaries** - AI-generated summaries for better discoverability
  - **AI Cover Images** - Beautiful, auto-generated cover images using Canvas API
- **Interactive Comments** - Engage with readers through a threaded comment system
- **Modern UI** - Clean, responsive design with Bootstrap 5

## Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database & ODM
- **JWT** - Token-based authentication
- **Multer** - File upload handling
- **Marked** - Markdown parsing

### Frontend
- **EJS** - Server-side templating
- **Bootstrap 5** - UI framework
- **Canvas API** - Image generation

### AI Integration
- **Google Gemini 2.0 Flash** - Content generation & summarization
- **Custom Prompt Engineering** - SEO-optimized prompts

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/BlogUp.git
   cd BlogUp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGO_CONNECT=mongodb://localhost:27017
   JWT_SECRET=your_super_secret_jwt_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=8000
   ```

4. **Start the server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Open your browser**
   ```
   http://localhost:8000
   ```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon
- `npm run migrate` - Generate AI summaries and covers for existing blogs
- `npm run add-reactions` - Add sample reactions to blogs

## Project Structure

```
BlogUp/
├── models/          # Mongoose schemas (User, Blog, Comment)
├── routes/          # Express route handlers
├── middleware/      # Authentication middleware
├── service/         # Business logic (AI service, image generator)
├── views/           # EJS templates
├── public/          # Static assets (CSS, images, uploads)
├── prompts/         # AI prompt templates
└── scripts/         # Utility scripts
```

## Key Technical Highlights

- **Security**: HMAC-SHA256 password hashing with unique salts, JWT authentication
- **Database Design**: MongoDB with Mongoose population for efficient data relationships
- **AI Integration**: Modular prompt system for extensible AI features
- **Image Generation**: Server-side Canvas API for dynamic cover image creation
- **File Handling**: Multer for secure file uploads with timestamped naming
- **Markdown Support**: Client-side markdown parsing for rich content

## Usage

1. **Sign Up** - Create an account with email and password
2. **Create Blog** - Write your content in markdown, use AI title suggestions, upload or auto-generate cover images
3. **Engage** - Comment on blogs and interact with the community
4. **Discover** - Browse all blogs on the home page with AI-generated summaries

## What Makes This Special

- **Full-Stack Expertise**: End-to-end development from database to UI
- **AI Integration**: Real-world implementation of LLM APIs for content enhancement
- **Security Best Practices**: Proper authentication, password hashing, and token management
- **Modern Architecture**: Clean separation of concerns, modular design, reusable components
- **Production-Ready**: Error handling, environment configuration, and scalable structure

---

Built with Node.js, Express, MongoDB, and Google Gemini AI
