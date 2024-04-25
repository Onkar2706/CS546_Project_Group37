import express from "express";
import { ObjectId } from "mongodb";
import { userMethods } from "../data/index.js";
import bcrypt from "bcryptjs";
import { users } from "../config/mongoCollections.js";

// Onkar@15
// OnkarMah

const saltRounds = 10;
let hash = null;
const router = express.Router();
//////////Register Routing//////////////////////
router
  .route("/register")
  .get(async (req, res) => {
    res.render("home/register", { title: "Register" });
  })
  .post(async (req, res) => {
    const createUserData = req.body;
    if (!createUserData || Object.keys(createUserData).length === 0) {
      return res.status(400).json({ Error: "No fields in the request body" });
    }

    try {
      // Securing password
      hash = await bcrypt.hash(createUserData.password, saltRounds);
    } catch (e) {
      console.log("unable to hash password");
      return res.status(500).json("unable to hash password");
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
        artist_Id,
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
        artist_Id
      );
      console.log("user Created!");
      res.render("home/home");
    } catch (e) {
      return res.status(500).json(e);
    }
  });



  ///////Login./////////

router
  .route("/login")
  .get(async (req, res) => {
    res.render("home/login", { title: "Login" });
  })
  .post(async (req, res) => {
    const authorizeUser = req.body;

    if (!authorizeUser || Object.keys(authorizeUser).length === 0) {
      return res.status(400).json({ Error: "No fields in the request body" });
    }
    try {
      const usercollection = await users();

      try {
        //   hash = await bcrypt.hash(authorizeUser.password, saltRounds);

        const fetcheduser = await usercollection.findOne({
          userName: authorizeUser.userName,
        });
        console.log(fetcheduser);
        if (fetcheduser) {
          // Store user information in session

          req.session.user = {
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
        } else {
          return res
            .status(400)
            .json({ Error: "Invalid username or password" });
        }
        if (fetcheduser.role == "admin") {
          return res.render("home/admin");
        }
        if (fetcheduser.role == "user") {
          return res.redirect("/user");
        } else {
          return res.redirect("/artist");
        }
      } catch (error) {
        return res.status(500).json({ Error: "Internal Server Error" });
      }

      // !fetcheduser && res.status(400).json("User Not Found")

      const validatedPassword = await bcrypt.compare(
        authorizeUser.password.trim(),
        fetcheduser.password.trim()
      );
      // console.log(validatedPassword)
      // !validatedPassword !== "boolean" && res.status(400).json("Invalid Id or Password")

      //  const final= bcrypt.compareSync(req.body.password,fetcheduser.password, function(err, result) {
      //     console.log(result)
      // });
      console.log(req.body.password);
      console.log(fetcheduser.password);

      console.log("Authentication Successfull");
      console.log(final);
    } catch (error) {
      res.status(500).json(error);
    }
  });

  /////// Admin Routing//////////////////

router.route("/admin").get(async (req, res) => {
  res.render("home/admin", { title: "Admin" });
});

router.route("/admin").get(async (req, res) => {
  
});

export default router;
