import express from "express";
import { ObjectId } from "mongodb";
import { userMethods } from "../data/index.js";
import bcrypt from "bcryptjs";
import { users } from "../config/mongoCollections.js";


const saltRounds = 10;
let hash = null;
const router = express.Router();
router
  .route("/register")
  .get(async (req, res) => {
    res.render("home/register", { title: "Register" });
  })
  .post(async (req, res) => {
    const createUserData = req.body;
    if (!createUserData || Object.keys(createUserData).length === 0) {
      return res
        .status(400)
        .render("error", { message: "No fields in the request body" });
    }

    try {
      // Securing password
      hash = await bcrypt.hash(createUserData.password.trim(), saltRounds);
    } catch (e) {
      console.log("unable to hash password");
      return res
        .status(500)
        .render("error", { message: "unable to hash password" });
    }

    try {
      const {
        firstName,
        lastName,
        userName,
        email,
        state,
        city,
        cart,
        purchases,
        posts,
      } = createUserData;

      const newUser = await userMethods.create(
        firstName,
        lastName,
        userName,
        hash,
        email,
        state,
        city,
        cart,
        purchases,
        posts,
      );
      console.log("User Created!");
      return res.redirect("/user/login");
    } catch (e) {
      return res.status(400).json(e);
    }
  });

router
  .route("/login")
  .get(async (req, res) => {
    res.render("home/login", { title: "Login" });
  })
  .post(async (req, res) => {
    const authorizeUser = req.body;

    if (!authorizeUser || Object.keys(authorizeUser).length === 0) {
      return res
        .status(400)
        .render("error", { message: "No fields in the request body" });
    }
    try{
      const usercollection = await users();
      const fetcheduser = await usercollection.findOne({
        userName: authorizeUser.userName.toLowerCase(),
      });

      // console.log(fetcheduser);
      if (!fetcheduser) throw "Error: User Not Found";
      const match = await bcrypt.compare(authorizeUser.password, fetcheduser.password);
      if (match){
        // Store user information in session
        req.session.user = {
          _id:fetcheduser._id,
          firstName: fetcheduser.firstName,
          lastName: fetcheduser.lastName,
          username: fetcheduser.userName,
          posts: fetcheduser.posts,
          purchases: fetcheduser.purchases,
          email:fetcheduser.email,
          city:fetcheduser.city,
          cart:fetcheduser.cart,
          role: fetcheduser.role,
        };
        console.log("Session",req.session.user)
        return res.redirect('/');
      }
      return res.status(400).json({ Error: "Invalid username or password" });

    }catch(error){
      return res.status(500).json({ Error: "Internal Server Error" });
    }
  });


  router
  .route("/admin")
  .get(async(req,res)=>{
    res.render("home/admin", { title: "Admin" });


  })


  router
  .route("/admin")
  .post(async(req,res)=>{

    if (req.session.user && req.session.user.role === "admin") {
    const admin = req.session.user
    const currentTime = new Date().toLocaleString(); 

    res.render("home/admin", {
      firstName: admin.firstName,
      lastName: admin.lastName,
      userName: admin.userName,
      currentTime: currentTime,
    });
  }
});

router.route("/user").get(async (req, res) => {
  res.render("home/home", { title: "User" });
});

router.route("/user").post(async (req, res) => {
  if (req.session.user && req.session.user.role === "user") {
    const admin = req.session.user;
    const currentTime = new Date().toLocaleString();

    res.render("home/home", {
      firstName: admin.firstName,
      lastName: admin.lastName,
      userName: admin.userName,
      currentTime: currentTime,
    });
    }

    router
    .route("/registerArtist")
    .get(async(req,res)=>{
      res.render("home/artist", { title: "artist" });
    })
  
    router
    .route("/registerArtist")
    .post(async(req,res)=>{
  
      if (req.session.user && req.session.user.role === "artist") {
      const admin = req.session.user
      const currentTime = new Date().toLocaleString(); 
  
      res.render("home/artist", {
        firstName: admin.firstName,
        lastName: admin.lastName,
        userName: admin.userName,
        currentTime: currentTime,
      });
      }
    })
  })

export default router;
