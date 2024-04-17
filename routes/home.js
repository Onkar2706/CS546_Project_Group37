import express from "express";

const router = express.Router();
router
  .route('/')
  .get(async (req, res) => {
    try {
        res.render("home/home.handlebars", {title: "Home Page"})
    }
    catch (e) {
      return res.status(400).json(e);
    }
  });

export default router;