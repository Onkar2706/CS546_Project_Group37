import express from "express";
import { postsMethod } from "../data/index.js";
import session from "express-session";
import validate from "../helpers.js";

const router = express.Router();
router.route("/").get(async (req, res) => {
  try {
    const allPosts = await postsMethod.getAllPosts();
    if (req.session && req.session.user && req.session.user.role === "user"){
      return res.render("post/showPosts.handlebars", {allPosts, title: "Art Blogs", userName: req.session.user.username, loggedIn: true, user: true});
    }
    else if (req.session && req.session.user && req.session.user.role === "artist"){
      return res.render("post/showPosts.handlebars", {allPosts, title: "Art Blogs", userName: req.session.user.username, loggedIn: true, user: false});
    }
    return res.render("post/showPosts.handlebars", {
      allPosts,
      title: "Art Blogs",
    });
  } catch (e) {
    console.log(e);
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
    console.log(error);
  }
});

router
.route('/addBlog')
.post(async (req, res) => {
  
  try{
    const userInfo = req.session.user;
    const userId = userInfo._id.toString().trim();
    const blogData = req.body;
    //validation
    // validate.checkIfProperInput(blogData.title)
    // validate.checkIfProperInput(blogData.body)

    // validate.checkIfString(blogData.title)
    // validate.checkIfString(blogData.body)

    const createBlog = await postsMethod.addPost(userId, userInfo.username.trim(), blogData.title.trim(), blogData.body.trim(), blogData.image.trim());
    return res.redirect('/post');

  }
  catch(error){
    console.log(error);
  }
});

router
.route('/:postId')
.get(async (req, res) => {
  try{
    const id = req.params.postId;
    const getPost = await postsMethod.getPostById(id.trim());
    if (req.session && req.session.user && req.session.user.role === "user"){
      return res.render('post/openPost', { getPost, title: "Post", userName: req.session.user.username, loggedIn: true, user: true});
    }
    else if (req.session && req.session.user && req.session.user.role === "artist"){
      return res.render('post/openPost', {getPost, title: "Post", userName: req.session.user.username, loggedIn: true, user: false});
    }
    return res.render('post/openPost', {getPost, title: "Post"});
  }
  catch(error){
    console.log(error);
  }
});

router
.route('/:postId/comment')
.post(async (req, res) => {
  try{
    const id = req.params.postId;
    const comment = req.body.comment;

    const addComment = await postsMethod.addComment(id.trim(), req.session.user.username, comment);
    return res.redirect(`/post/${id}`);
  }
  catch(error){
    console.log(error);
  }
});

export default router;
