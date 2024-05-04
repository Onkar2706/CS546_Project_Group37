import express from "express";
import { ObjectId } from "mongodb";
import { productMethods } from "../data/index.js";
import { artistMethods } from "../data/index.js";
import validate from "../helpers.js";
import artWork from "../data/artwork.js";

const router = express.Router();


// router.route("/getProducts").get(async (req, res) => {
//   const getArtwork = await artWork.getAll();
//   if (req.session && req.session.user && req.session.user.role === "user"){
//     return res.render("home/getProducts", {title: "Products", products: getArtwork, userName: req.session.user.username, loggedIn: true, user: true});
//   }
//   else if (req.session && req.session.user && req.session.user.role === "artist"){
//     return res.render("home/getProducts", {title: "Products", products: getArtwork, userName: req.session.user.username, loggedIn: true, user: false});
//   }

//   return res.render("home/getProducts", {
//     title: "Products",
//     products: getArtwork,
//   });
// });

router.route("/getProducts").get(async (req, res) => {
  try {
    // let artistId = await artistMethods.getArtistProfile(req.session.user._id);
    // let getArtwork = await artistMethods.get(artistId.trim()); 
    let getArtwork =["663682a4b694a8de6c8b8a60", "663682a4b694a8de6c8b8a61", "663682a4b694a8de6c8b8a64"];
    const artworkArr = [];
    for (let i=0; i<getArtwork.length; i++){
      let temp = await productMethods.get(getArtwork[i]);
      artworkArr.push(temp);
    }
    if (req.session && req.session.user) {      
      return res.render("home/getProducts", {
        title: "Products",
        products: artworkArr,
        userName: req.session.user.username,
        loggedIn: true,
        user: req.session.user.role === "user", 
      });
      
    } else {
      getArtwork = await artWork.getAll();
      return res.render("home/getProducts", {
        title: "Products",
        products: artworkArr,
      });
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).send("Internal Server Error");
  }
});



router
.route('/addProduct')
.get(async(req,res)=>{

  if (req.session && req.session.user && req.session.user.role === "user"){
    return res.render("home/addProduct", { userName: req.session.user.username, loggedIn: true, user: true});
  }
  else if (req.session && req.session.user && req.session.user.role === "artist"){
    return res.render("home/addProduct", {userName: req.session.user.username, loggedIn: true, user: false});
  }
  
  return res.render("home/addProduct")

})


router
.route('/addProduct')
.post(async(req,res)=>{
  try{
  console.log("In ADDproductsPOST")
  const productData = req.body
  const userId=req.session.user._id.trim()
  const fetchArtistID =  await artistMethods.getArtistProfile(userId)
  console.log(fetchArtistID)

  const addProduct = await productMethods.create(fetchArtistID,productData.productName,productData.productDescription,productData.productTags,productData.price,productData.images)

    return res.redirect("/artist/getProducts");
  } catch (error) {
    console.log(error);
  }
});

router
  .route("/artistreg")
  .get(async (req, res) => {
    try {
      return res.render("home/artistreg", { title: "Artist Registration" });
    } catch (e) {
      res.json(e);
    }
  })
  .post(async (req, res) => {
    try {
      const artistData = req.body;
      validate.checkIfProperInput(user_id);
      validate.checkIfProperInput(bio);
      validate.checkIfProperInput(profilePic);

      validate.checkIfString(user_id);
      validate.checkIfString(bio);
      validate.checkIfString(profilePic);

      validate.checkIfValidObjectId(user_id);
      console.log(artistData);
      if (!artistData) {
        return res.status(400).json({ Error: "No fields in the request body" });
      }
      validate.checkIfProperInput(artistData.bio);
      validate.checkIfProperInput(artistData.profilePic);
      validate.checkIfString(artistData.bio);
      validate.checkIfString(artistData.profilePic);

      const newArtist = await artistMethods.create(
        req.session.user._id,
        artistData.bio,
        artistData.profilePicture
      );
      res.redirect("/user/login");
    } catch (e) {
      res.json("Error: Couldn't create artist");
    }
  });

router.route("/:artistId").get(async (req, res) => {
  try {
    const id = req.params.artistId;
    const artistInfo = await artistMethods.get(id.trim());
    if (req.session && req.session.user && req.session.user.role === "user"){
      return res.render("home/artistclick", {artistInfo, title:"Artist Info", userName: req.session.user.username, loggedIn: true, user: true});
    }
    else if (req.session && req.session.user && req.session.user.role === "artist"){
      return res.render("home/artistclick", {artistInfo, title:"Artist Info", userName: req.session.user.username, loggedIn: true, user: false});
    }
    
    return res.render("home/artistclick", {artistInfo, title:"Artist Info"})
  }
  catch(error){
    res.json(error);
  }
});

router.route("/").get(async (req, res) => {
  try {
    let allArtists = await artistMethods.getAll();
    return res.render("home/artist", {allArtists, title: "Artists"});
  } catch (e) {
    res.send(404).render("error", { message: e });
  }
});

export default router;
