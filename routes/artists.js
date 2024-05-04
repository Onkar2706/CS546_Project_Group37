import express from "express";
import { ObjectId } from "mongodb";
import {productMethods}  from "../data/index.js"; 
import {artistMethods}  from "../data/index.js";
import validate from "../helpers.js";
import artWork from "../data/artwork.js";

const router = express.Router();


router.route("/getProducts").get(async (req, res) => {
  const getArtwork = await artWork.getAll();

  return res.render("home/getProducts", {
    title: "Products",
    products: getArtwork,
  });
});

router
.route('/addProduct')
.get(async(req,res)=>{
  return res.render("home/addProduct")

})


router
.route('/addProduct')
.post(async(req,res)=>{
  console.log("In ADDproductsPOST")
  const productData = req.body
  const userId=req.session.user._id.trim()
  const fetchArtistID =  await artistMethods.getArtistProfile(userId)
  console.log(fetchArtistID)

  const addProduct = await productMethods.create(fetchArtistID,productData.productName,productData.productDescription,productData.productTags,productData.price,productData.images)

  
  return res.redirect("/artist/getProducts")

  
  

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
  .post(async (req, res) => {
    try{
      const artistData = req.body;
      console.log(artistData);
      if (!artistData) {
        return res.status(400).json({ Error: "No fields in the request body" });
      }
      validate.checkIfProperInput(artistData.bio);
      validate.checkIfProperInput(artistData.profilePic);
      validate.checkIfString(artistData.bio);
      validate.checkIfString(artistData.profilePic);

      const newArtist = await artistMethods.create(
        req.session.user._id, artistData.bio, artistData.profilePicture)
      res.redirect('/user/login');
    }
    catch(e){
      res.json("Error: Couldn't create artist")
    }
  })

router
.route('/:artistId')
.get(async (req, res) => {
  try{
    const id = req.params.artistId;
    const artistInfo = await artistMethods.get(id.trim());
    return res.render("home/artistclick", {artistInfo, title:"Artist Info"})
  }
  catch(error){
    res.json(error);
  }
});


router
.route("/")
.get(async (req, res) => {
  try {
    let allArtists = await artistMethods.getAll();
    return res.render("home/artist", {allArtists, title: "Artists"});
  } catch (e) {
    res.send(404).render("error", { message: e });
  }
});

// router.route("/register").post(async (req, res) => {
//   const createArtistData = req.body;
//   if (!createArtistData || Object.keys(createArtistData).length === 0) {
//     return res
//       .status(400)
//       .render("error", { message: "request body is empty" });
//   }

//   try {
//     const { user_id, bio, profilePic, portfolio, ratings } = createArtistData;

//     const newArtist = await artistMethods.create(
//       user_id,
//       bio,
//       profilePic,
//       portfolio,
//       ratings
//     );
//     console.log("Artist Created!");
//     return res.redirect("/user/login");
//   } catch (e) {
//     return res.status(400).render("error", { message: e });
//   }
// });

export default router;
