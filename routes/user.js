import express from "express";
import { ObjectId } from "mongodb";
import artWork from "../data/artwork.js";
import { userMethods } from "../data/index.js";
import bcrypt from "bcryptjs";
import { posts, users } from "../config/mongoCollections.js";
import validate from "../helpers.js";

const saltRounds = 10;
let hash = null;
const router = express.Router();
router
  .route("/register")
  .get(async (req, res) => {
    try {
      res.render("home/register", { title: "Register" });
    } catch (error) {
      console.log(error);
    }
  })

  .post(async (req, res) => {
    try {
      const createUserData = req.body;
      const userNameValidator = await userMethods.getByUsername(
        createUserData.userName
      );
      if (!createUserData || Object.keys(createUserData).length === 0) {
        throw "Error: No fields in the request body";
      }
      if (req.body.userName === userNameValidator.userName)
        throw "username present";
      // Securing password
      hash = await bcrypt.hash(createUserData.password.trim(), saltRounds);

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

      // Validation
      // validate.checkIfProperInput(firstName);;
      // validate.checkIfProperInput(lastName);;
      // validate.checkIfProperInput(userName);;
      // validate.checkIfProperInput(email);;
      // validate.checkIfProperInput(state);;
      // validate.checkIfProperInput(city);;
      // validate.checkIfProperInput(cart);;
      // validate.checkIfProperInput(purchases);;
      // validate.checkIfProperInput(posts);;

      // validate.checkIfString(firstName);
      // validate.checkIfString(lastName);
      // validate.checkIfString(userName);
      // validate.checkIfString(email);
      // validate.checkIfString(state);
      // validate.checkIfString(city);
      // validate.checkIfString(cart);
      // validate.checkIfString(purchases);
      // validate.checkIfString(posts);

      // validate.checkIfUsername(userName);
      // validate.checkIfName(firstName);
      // validate.checkIfName(lastName);
      // validate.validateState(state);

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
        posts
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
    try {
      res.render("home/login", { title: "Login" });
    } catch (error) {}
  })

  .post(async (req, res) => {
    try {
      // Validation
      // validate.checkIfProperInput(_id);
      // validate.checkIfProperInput(firstName);
      // validate.checkIfProperInput(lastName);
      // validate.checkIfProperInput(userName);
      // validate.checkIfProperInput(email);
      // validate.checkIfProperInput(city);
      // console.log(req.body);
      validate.checkIfString(req.body.userName);
      validate.checkIfString(req.body.password);

      // validate.checkIfName(firstName);
      // validate.checkIfName(lastName);
      validate.checkIfUsername(req.body.userName);
      validate.checkIfPassword(req.body.password);

      const authorizeUser = req.body;
      // Validation
      // validate.checkIfProperInput(authorizeUser.userName);
      // validate.checkIfProperInput(authorizeUser.password);

      // validate.checkIfString(authorizeUser.userName);
      // validate.checkIfString(authorizeUser.password);

      // validate.checkIfUsername(authorizeUser.userName);
      // validate.checkIfPassword(authorizeUser.password);

      if (!authorizeUser || Object.keys(authorizeUser).length === 0) {
        return res
          .status(400)
          .render("error", { errorMessage: "No fields in the request body" });
      }

      const usercollection = await users();
      const fetcheduser = await usercollection.findOne({
        userName: authorizeUser.userName.toLowerCase(),
      });
      // console.log(fetcheduser);
      if (!fetcheduser) throw "Error: User Not Found";
      const match = await bcrypt.compare(
        authorizeUser.password,
        fetcheduser.password
      );
      if (match) {
        // Store user information in session
        req.session.user = {
          _id: fetcheduser._id,
          firstName: fetcheduser.firstName,
          lastName: fetcheduser.lastName,
          username: fetcheduser.userName,
          posts: fetcheduser.posts,
          purchases: fetcheduser.purchases,
          email: fetcheduser.email,
          city: fetcheduser.city,
          cart: fetcheduser.cart,
          role: fetcheduser.role,
        };
        console.log("Session", req.session.user);
        return res.redirect("/");
      }
      return res
        .status(400)
        .render("error", { errorMessage: "Invalid username or password" });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .render("error", { errorMessage: "Internal Server Error" });
    }
  });

router.route("/admin").get(async (req, res) => {
  res.render("home/admin", { title: "Admin" });
});

router.route("/admin").post(async (req, res) => {
  if (req.session.user && req.session.user.role === "admin") {
    const admin = req.session.user;
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

  router.route("/registerArtist").get(async (req, res) => {
    res.render("home/artist", { title: "artist" });
  });

  router.route("/registerArtist").post(async (req, res) => {
    if (req.session.user && req.session.user.role === "artist") {
      const admin = req.session.user;
      const currentTime = new Date().toLocaleString();

      res.render("home/artist", {
        firstName: admin.firstName,
        lastName: admin.lastName,
        userName: admin.userName,
        currentTime: currentTime,
      });
    }
  });
}),
  router.route("/getUserInfo").get(async (req, res) => {
    // console.log(req.session.user)

    if (req.session && req.session.user && req.session.user.role === "user") {
      return res.render("home/userInfo", {
        title: "MyInfo",
        lastName: req.session.user.lastName,
        email: req.session.user.email,
        posts: req.session.user.posts,
        purchases: req.session.user.purchases,
        city: req.session.user.city,
        cart: req.session.user.cart,
        role: req.session.user.role,
        userName: req.session.user.username,
        loggedIn: true,
        user: true,
      });
    } else if (
      req.session &&
      req.session.user &&
      req.session.user.role === "artist"
    ) {
      return res.render("home/userInfo", {
        title: "MyInfo",
        lastName: req.session.user.lastName,
        email: req.session.user.email,
        posts: req.session.user.posts,
        purchases: req.session.user.purchases,
        city: req.session.user.city,
        cart: req.session.user.cart,
        role: req.session.user.role,
        userName: req.session.user.username,
        loggedIn: true,
        user: false,
      });
    }
  });

export default router;
