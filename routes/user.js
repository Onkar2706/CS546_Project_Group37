import express from "express";
import { ObjectId } from "mongodb";
import { userMethods } from "../data/index.js";
import bcrypt from "bcryptjs";

const saltRounds = 10;
let hash = null;
const router = express.Router();
router
.route('/register')
.get(async (req, res) => {
    res.render('home/register', {title: "Register"})
  })
.post(async (req, res) => {
    const createUserData = req.body;
    if (!createUserData || Object.keys(createUserData).length === 0) {
      return res.status(400).json({ Error: "No fields in the request body" });
    }

    try{
        // Securing password
        hash = await bcrypt.hash(createUserData.password, saltRounds);
    }
    catch(e){
        console.log("unable to hash password")
        return res.status(500).json("unable to hash password");
    }

    try {
        const {firstName,lastName,userName,email,state,city,
            cart,purchases,posts,artist_Id } = createUserData;

        const newUser = await userMethods.create(firstName,lastName,userName,hash,email,state,city,
        cart,purchases,posts,artist_Id);
        console.log("user Created!");
        return res.status(200).json("User Created!");
    }
    catch (e) {
      return res.status(400).json(e);
    }
  });

export default router;