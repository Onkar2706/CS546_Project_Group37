import express from "express";
import { postsMethod } from "../data/index.js";
import session from "express-session";
import validate from "../helpers.js";
import path from "path";
import multer from "multer";
import { get } from "http";
import xss from "xss"


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Uploads folder where images will be stored temporarily
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use original filename
  }
});
const upload = multer({ storage: storage });

const router = express.Router();

router.route("/").get(async (req, res) => {
  try {
    const allPosts = await postsMethod.getAllPosts();
    if (req.session && req.session.user && req.session.user.role === "user"){
      return res.render("post/showPosts.handlebars", {allPosts, title: "Art Blogs", userName: req.session.user.username, loggedIn: true,
      user: req.session.user.role === "user" ? true : false,
      artist: req.session.user.role === "user" ? false : true });
    }
    else if (req.session && req.session.user && req.session.user.role === "artist"){
      return res.render("post/showPosts.handlebars", {allPosts, title: "Art Blogs", userName: req.session.user.username, loggedIn: true,
      user: req.session.user.role === "user" ? true : false,
      artist: req.session.user.role === "user" ? false : true });
    }
    return res.render("post/showPosts.handlebars", {
      allPosts,
      title: "Art Blogs",
    });
  } catch (error) {
    res.status(400).render("error",{errorMessage:error});
  }
});

router
.route('/addBlog')
.get(async (req, res) => {
  try{
    if (req.session && req.session.user && req.session.user.role === "user"){
      return res.render('post/addPost', {title: "Create Blog", userName: req.session.user.username, loggedIn: true, user: true});
    }
    else if (req.session && req.session.user && req.session.user.role === "artist"){
      return res.render('post/addPost', {title: "Create Blog", userName: req.session.user.username, loggedIn: true, user: false});
    }
    return res.render('post/addPost', {title: "Create Blog"});
  }
  catch(error){
    res.status(400).render("error",{errorMessage:error});
  }
});

router
.route('/addBlog')
.post(upload.single('image'),async (req, res) => {
  
  try{
    const userInfo = req.session.user;
    const userId = userInfo._id.toString().trim();
    const blogData = req.body;
    blogData.title=xss(blogData.title)
    blogData.body=xss(blogData.body)
    let imagePath = path.normalize(xss(req.file.path));
    imagePath = '/'+ imagePath.split('\\').join('/');

    //validation
    validate.checkIfProperInput(blogData.title)
    validate.checkIfProperInput(blogData.body)

    // validate.checkIfString(blogData.title)
    // validate.checkIfString(blogData.body)

    const createBlog = await postsMethod.addPost(userId, userInfo.username.trim(), blogData.title.trim(), blogData.body.trim(), imagePath);
    return res.redirect('/post');

  }
  catch(error){
    res.status(400).render("error",{errorMessage:error});
  }
});

// router
//   .route('/addBlog')
//   .post(async (req, res) => {
//     try {
//       const form = formidable({ multiples: true });
//       form.uploadDir = path.join(__dirname, '../uploads');
//       form.keepExtensions = true;
//       form.parse(req, async (err, fields, files) => {
//         if(err){
//           res.status(400).render("error", { errorMessage: err });
//         }
//         const userInfo = req.session.user;
//         const userId = userInfo._id.toString().trim();
//         const blogData = fields;
//         const imagePath = files.image.path;

//         const createBlog = await postsMethod.addPost(userId, userInfo.username, blogData.title, blogData.body, imagePath);
//         return res.redirect('/post');
//       });
//     } catch (error) {
//       res.status(400).render("error", { errorMessage: error });
//     }
//   });



router
.route('/:postId')
.get(async (req, res) => {
  try{
    const id = req.params.postId;
    const getPost = await postsMethod.getPostById(id.trim());
    getPost.image = '/' + getPost.image;
    if (req.session && req.session.user && req.session.user.role === "user"){
      return res.render('post/openPost', { getPost, title: "Post", userName: req.session.user.username, loggedIn: true, user: req.session.user.role === "user" ? true : false,
      artist: req.session.user.role === "user" ? false : true});
    }
    else if (req.session && req.session.user && req.session.user.role === "artist"){
      return res.render('post/openPost', {getPost, title: "Post", userName: req.session.user.username, loggedIn: true, user: req.session.user.role === "user" ? true : false,
      artist: req.session.user.role === "user" ? false : true});
    }
    return res.render('post/openPost', {getPost, title: "Post"});
  }
  catch(error){
    res.status(400).render("error",{errorMessage:error});
  }
});

router
.route('/:postId/comment')
.post(async (req, res) => {
  try{
    const id = xss(req.params.postId);
    const comment = xss(req.body.comment);

    const addComment = await postsMethod.addComment(id.trim(), req.session.user.username, comment);
    return res.redirect(`/post/${id}`);
  }
  catch(error){
    res.status(400).render("error",{errorMessage:error});
  }
});

export default router;
