import express from "express";
import { artistMethods } from "../data/index.js";

const router = express.Router();
router
  .route('/')
  .get(async (req, res) => {
    try {
        const artists = await artistMethods.getAll();
        // sort top 5 artists based on ratings. 
        
        if (req.session && req.session.user && req.session.user.role === "user"){
          return res.render("home/home.handlebars", {artists, userName:req.session.user.username, loggedIn: true, title: "Home Page"});
        }

        return res.render("home/home.handlebars", {artists, title: "Home Page"});;

    }
    catch (e) {
      return res.status(400).json(e);
    }
  })

  router
  .route('/artistreg')
  .get(async (req, res) => {
    try{
      return res.render("home/artistreg", {title: "Artist Registration"})
    }
    catch(e){
      res.json(e);
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