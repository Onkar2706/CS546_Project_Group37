import express from "express";
import { artistMethods } from "../data/index.js";

const router = express.Router();
router
  .route('/')
  .get(async (req, res) => {
    try {
        const artists = await artistMethods.getAll();
        // sort top 5 artists based on ratings. 
        res.render("home/home.handlebars", {artists, title: "Home Page"})
    }
    catch (e) {
      return res.status(400).json(e);
    }
  })

// .route('/user')
//   .post(async (req, res) => {
//     try {
//         res.render("home/home.handlebars", {title: "Home Page"})
//     }
//     catch (e) {
//       return res.status(400).json(e);
//     }
//   })
export default router;