import express from "express";
import  artistMethods from "../data/artists.js";
import { productMethods } from "../data/index.js";

const router = express.Router();
router
  .route('/')
  .get(async (req, res) => {
    try {
      let artists = await artistMethods.getAll();
      if (artists.length > 6) artists = artists.slice(0,6);
      let products = await productMethods.getAll();
      if (products.length > 6) products = products.slice(0,6);
        // sort top 5 artists based on ratings. 
        
        if (req.session && req.session.user && req.session.user.role === "user"){
          return res.render("home/home.handlebars", {artists, products, userName: req.session.user.username,
          loggedIn: true, user: req.session.user.role === "user" ? true : false,
          artist: req.session.user.role === "user" ? false : true, title: "Home Page"});
        }
        else if (req.session && req.session.user && req.session.user.role === "artist"){
          return res.render("home/home.handlebars", {artists, products, userName: req.session.user.username,
          loggedIn: true, user: req.session.user.role === "user" ? true : false,
          artist: req.session.user.role === "user" ? false : true, title: "Home Page"});
        }
        return res.render("home/home.handlebars", {artists, products, title: "Home Page"});

    }
    catch (error) {
      res.status(400).render("error",{errorMessage:error});
    }
  })
export default router;