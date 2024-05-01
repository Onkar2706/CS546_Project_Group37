import express from "express";
import { ObjectId } from "mongodb";
// import artistMethods  from "../data/index.js";

const router = express.Router();

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
  .post(async (req, res) => {
    try{
      const artistData = req.body;
      console.log(artistData);
      if (!artistData) {
        return res.status(400).json({ Error: "No fields in the request body" });
      }
      const newArtist = await artistMethods.create(
        req.session.user._id, artistData.bio, artistData.profilePicture)
      res.redirect('/user/login');
    }
    catch(e){
      res.json("Error: Couldn't create artist")
    }
  })

router.route("/register").post(async (req, res) => {
  const createArtistData = req.body;
  if (!createArtistData || Object.keys(createArtistData).length === 0) {
    return res
      .status(400)
      .render("error", { message: "request body is empty" });
  }

  try {
    const { user_id, bio, profilePic, portfolio, ratings } = createArtistData;

    const newArtist = await artistMethods.create(
      user_id,
      bio,
      profilePic,
      portfolio,
      ratings
    );
    console.log("Artist Created!");
    return res.redirect("/user/login");
  } catch (e) {
    return res.status(400).render("error", { message: e });
  }
});

export default router;
