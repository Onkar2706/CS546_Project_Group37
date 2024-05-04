import express from "express";
import { postsMethod } from "../data/index.js";

const router = express.Router();
router.route("/").get(async (req, res) => {
  try {
    const allPosts = await postsMethod.getAllPosts();
    return res.render("post/showPosts.handlebars", {
      allPosts,
      title: "Art Blog",
    });
  } catch (e) {
    console.log(e);
  }
});

export default router;
