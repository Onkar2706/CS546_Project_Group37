import express from "express";
import  artistMethods from "../data/artists.js";

const router = express.Router();
router
  .route('/')
  .get(async (req, res) => {
    try {
        const artists = await artistMethods.getAll();
        // sort top 5 artists based on ratings. 
        
        if (req.session && req.session.user && req.session.user.role === "user"){
          return res.render("home/home.handlebars", {artists, userName: req.session.user.username, loggedIn: true, user: true, title: "Home Page"});
        }
        else if (req.session && req.session.user && req.session.user.role === "artist"){
          return res.render("home/home.handlebars", {artists, userName: req.session.user.username, loggedIn: true, user: false, title: "Home Page"});
        }
        return res.render("home/home.handlebars", {artists, title: "Home Page"});

    }
    catch (e) {
      return res.status(400).json(e);
    }
  })
export default router;