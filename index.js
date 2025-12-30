const express = require("express");
const path = require("path");
const cookieParser = require('cookie-parser');
require('dotenv/config');
const mongo_connect = process.env.MONGO_CONNECT;

const mongooseConnect = require("./connect");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog")
const Blog = require("./models/blog");
const { checkForAuthenticationCookie } = require("./middleware/authentication");

const app = express();
const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// console.log(mongo_connect)
mongooseConnect(`${mongo_connect}/BlogUp`)
.then(() => console.log("MongoDb is connected..."))
.catch((err) => {
    console.log(err);
});

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));// get token payload in req.user after validation

// Serve static files (like images, CSS, JavaScript) from the "public" directory
// Express treats requests to these files as requests for static assets, not as route paths
app.use(express.static(path.resolve("./public")))



app.use("/user", userRoute);
app.get("/", async (req, res) => {
    // console.log(req.user);

    const allBlogs = await Blog.find({}).populate('createdBy', 'fullName email').sort({ createdAt: -1 })
    return res.render("home", {
        user: req.user, //pass payload which we got from checkForAuthenticationCookie
        blogs: allBlogs,
    })
})
app.use("/blog", blogRoute);

app.listen(PORT, () => console.log(`Server is running or port: ${PORT}`));


//todo-
//create token when any user do signup too
//when go to signup route -> check for token and if it matchs with db user then go to home, if no token then render singup page
