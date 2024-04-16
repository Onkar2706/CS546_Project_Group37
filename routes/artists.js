import express from "express";
import { ObjectId } from "mongodb";
import { artistMethods } from "../data/index.js";
// import bcrypt from "bcryptjs";

// const saltRounds = 10;
// let hash = null;
const router = express.Router();
router
  .route('/register')
  .post(async (req, res) => {
    const createArtistData = req.body;
    if (!createArtistData || Object.keys(createArtistData).length === 0) {
      return res.status(400).json({ Error: "No fields in the request body" });
    }

    // try{
    //     // Securing password
    //     hash = await bcrypt.hash(createArtistData.password, saltRounds);
    // }
    // catch(e){
    //     console.log("unable to hash password")
    //     return res.status(500).json("unable to hash password");
    // }

    try {
        const {user_id,bio,profilePic,portfolio,ratings} = createArtistData;

        const newArtist = await artistMethods.create(user_id,bio,profilePic,portfolio,ratings);
        console.log("Artist Created!");
        return res.status(200).json("Artist Created!");
    }
    catch (e) {
      return res.status(400).json(e);
    }
  });

export default router;