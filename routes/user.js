import express from "express";
import { ObjectId } from "mongodb";
import { artistMethods, userMethods } from "../data/index.js";
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
      res.status(400).render("error",{errorMessage:error});
    }
  })
  .post(async (req, res) => {
    try {
      const createUserData = req.body;
      const userNameValidator = await userMethods.getByUsername(
        createUserData.userName.toLowerCase()
      );
      if (!createUserData || Object.keys(createUserData).length === 0) {
        throw "Error: No fields in the request body";
      }
      if (createUserData.age < 13) throw "Error: Minimum required age is 13";

      if (userNameValidator) throw "Error: Username already in use";
      
      // Securing password
      hash = await bcrypt.hash(createUserData.password.trim(), saltRounds);

      const {
        firstName,
        lastName,
        userName,
        email,
        age,
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
        age,
        state,
        city,
        cart,
        purchases
      );
      console.log("User Created!");
      return res.redirect("/user/login");
    } catch (error) {
      res.status(400).render("error",{errorMessage:error});
    }
  });

router
  .route("/login")
  .get(async (req, res) => {
    try {
      res.render("home/login", { title: "Login" });
    } catch (error) {
      res.status(400).render("error",{errorMessage:error});
    }
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
          age: fetcheduser.age,
          city: fetcheduser.city,
          state: fetcheduser.state,
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
      return res
        .status(500)
        .render("error", { errorMessage: error });
    }
});

router.route("/admin").get(async (req, res) => {
  res.render("admin/admin", { title: "Admin Dashboard" });
})
  .post(async (req, res) => {
    if (req.session.user && req.session.user.role === "admin") {
      const admin = req.session.user;
      const currentTime = new Date().toLocaleString();

      res.render("admin/admin", {
        firstName: admin.firstName,
        lastName: admin.lastName,
        userName: admin.userName,
        currentTime: currentTime,
      });
    }
  });

// router.route("/user").get(async (req, res) => {
//   res.render("home/home", { title: "User" });
// })
// .post(async (req, res) => {
//   if (req.session.user && req.session.user.role === "user") {
//     const admin = req.session.user;
//     const currentTime = new Date().toLocaleString();

//     res.render("home/home", {
//       firstName: admin.firstName,
//       lastName: admin.lastName,
//       userName: admin.userName,
//       currentTime: currentTime,
//     })
//   }});

// router.route("/registerArtist").get(async (req, res) => {
//   res.render("artist/artist", { title: "artist" });
// })
// .post(async (req, res) => {
//     if (req.session.user && req.session.user.role === "artist") {
//       const admin = req.session.user;
//       const currentTime = new Date().toLocaleString();

//       res.render("artist/artist", {
//         firstName: admin.firstName,
//         lastName: admin.lastName,
//         userName: admin.userName,
//         currentTime: currentTime,
//       });
//     }
//   });

router.route("/getUserInfo").get(async (req, res) => {

  if (req.session && req.session.user && req.session.user.role === "user") {
    return res.render("user/userInfo", {
      title: "My Profile",
      firstName: req.session.user.firstName,
      lastName: req.session.user.lastName,
      email: req.session.user.email,
      age: req.session.user.age,
      posts: req.session.user.posts,
      // purchases: req.session.user.purchases.length === 0 ? "No Items" : req.session.user.purchases,
      purchases: req.session.user.purchases.length,
      city: req.session.user.city,
      state: req.session.user.state,
      cart: req.session.user.cart.length === 0 ? "No Items" : req.session.user.cart,
      role: req.session.user.role,
      userName: req.session.user.username,
      loggedIn: true,
      user: req.session.user.role === "user" ? true : false,
      artist: req.session.user.role === "user" ? false : true
    });
  } else if (
    req.session &&
    req.session.user &&
    req.session.user.role === "artist"
  ) {
    const artistInfo = await artistMethods.getArtistProfile(req.session.user._id);

    return res.render("user/userInfo", {
      title: "My Profile",
      firstName: req.session.user.firstName,
      lastName: req.session.user.lastName,
      email: req.session.user.email,
      age: req.session.user.age,
      posts: req.session.user.posts,
      // purchases: req.session.user.purchases.length === 0 ? "No Items" : req.session.user.purchases,
      purchases: req.session.user.purchases.length,
      city: req.session.user.city,
      state: req.session.user.state,
      cart: req.session.user.cart.length === 0 ? "No Items" : req.session.user.cart,
      role: req.session.user.role,
      bio: artistInfo.bio,
      profilePic: artistInfo.profilePic,
      userName: req.session.user.username,
      loggedIn: true,
      user: req.session.user.role === "user" ? true : false,
      artist: req.session.user.role === "user" ? false : true
    });
  }
});

router
.route('/editUserInfo')
.get(async (req, res) => {
  try {
    let artistInfo;
    if (req.session.user.role == "artist"){
      artistInfo = await artistMethods.getArtistProfile(req.session.user._id);
    }
    const userInfo = req.session.user;
    return res.render('user/editUserForm', {userInfo, title: "Update Profile",  userName: req.session.user.username, artistInfo,
    loggedIn: true,
    user: req.session.user.role === "user" ? true : false,
    artist: req.session.user.role === "user" ? false : true});
  } catch (error) {
    res.status(400).render("error",{errorMessage:error});
  }
})
.post(async (req, res) => {
  try {
    const updateInfo = req.body;
    const userid = req.session.user._id;
    const updateUser = await userMethods.updateUser(userid, updateInfo);
    return res.redirect('/logout');
  } catch (error) {
    res.status(400).render("error",{errorMessage:error});
  }
});

router
.route('/editArtistInfo')
.post(async (req, res) => {
  try {
    const artistInfo = await artistMethods.getArtistProfile(req.session.user._id);
    const updateInfo = req.body;
    const artistId = artistInfo._id;
    const updateUser = await userMethods.updateArtist(artistId, updateInfo);
    return res.redirect('/logout');
  } catch (error) {
    res.status(400).render("error",{errorMessage:error});
  }
});


export default router;