import express from "express";
import { ObjectId } from "mongodb";
import { userMethods } from "../data/index.js";
import bcrypt from "bcryptjs";
import { users } from "../config/mongoCollections.js";

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
    const {firstName,lastName,userName,email,state,city,
        cart,purchases,posts,artist_Id } = createUserData;
    
    const userCollection = await users();
    const ifUserExist = await userCollection.findOne({ userName: userName.toLowerCase()});
    if(ifUserExist) throw "Error: User with same UserID already exists";

    // Securing password
    const pw = createUserData.password.trim();
    hash = await bcrypt.hash(pw, 10);

    const newUser = await userMethods.create(firstName,lastName,userName,hash,email,state,city,
    cart,purchases,posts,artist_Id);
    console.log("user Created!");
    res.render("home/home");
  }
  catch (e) {
    return res.status(500).json(e);
  }
});


router
.route('/login')
.get(async (req, res) => {
    res.render('home/login', {title: "Login"})
  })
.post(async (req, res) => {
  const authorizeUser = req.body;

  if (!authorizeUser || Object.keys(authorizeUser).length === 0) {
    return res.status(400).json({ Error: "No fields in the request body" });
  }
  const userCollection = await users()

  try {
  const fetcheduser = await userCollection.findOne({ userName: authorizeUser.userName.toLowerCase()});
  if (!fetcheduser) res.status(400).json("User Not Found");
  const validatedPassword = await bcrypt.compare(authorizeUser.password.trim(), fetcheduser.password)
  console.log(validatedPassword)
  if(!validatedPassword) res.status(400).json("Invalid Id or Password")
  } 
  
  catch (error) {
    // res.status(500).json(error)
    console.log(error)
  }
});

export default router;