import express from "express";
import { ObjectId } from "mongodb";
import { productMethods } from "../data/index.js";
import { artistMethods } from "../data/index.js";
// import { productMethods } from "../data/index.js";
// import { artistMethods } from "../data/index.js";
import validate from "../helpers.js";
import artWork from "../data/artwork.js";

const router = express.Router();

router.route("/edit/:id")
.get(async (req, res) => {
  try {

    const artworkid = req.params.id
    const artData = await artWork.get(artworkid.trim())
    console.log(artData)
    res.render("home/addProduct",{title:"editProduct",artData})

    
    

    

  
    
  } catch (error) {
    
  }


})


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
    let artistId = await artistMethods.getArtistProfile(req.session.user._id);
    let getArtwork = await artistMethods.get(artistId._id); 

    const artworkArr = [];
    let artwork = getArtwork.portfolio;
    for (let i=0; i<artwork.length; i++){
      let temp = await productMethods.get(artwork[i]);
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


// router
// .route('/addProduct')
// .post(async(req,res)=>{
//   console.log("In ADDproductsPOST")
//   const productData = req.body
//   const userId=req.session.user._id.trim()
//   const fetchArtistID =  await artistMethods.getArtistProfile(userId)
//   console.log(fetchArtistID)
  
// });
router.route("/addProduct").post(async (req, res) => {
  console.log("In ADDproductsPOST");
  const productData = req.body;
  // console.log(productData);
  const tagsArray = productData.tags.split(",");
  const imagesArray = productData.images.split(",");
  const userId = req.session.user._id;
  const fetchArtistID = await artistMethods.getArtistProfile(userId);
  // console.log(fetchArtistID);

  const addProduct = await productMethods.create(
    fetchArtistID._id,
    productData.productName,
    productData.productDescription,
    tagsArray,
    productData.price,
    imagesArray);

  
  // fetchArtistID.portfolio.push(addProduct._id);
  const result = await artistMethods.updateProductInArtist(fetchArtistID._id,addProduct._id)
  
  // fetchArtistID.
  // console.log(artworkId);
  // const enterArtidintoArtist = await artistMethods.updateArtist()

  return res.redirect("/artist/getProducts")
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
      // console.log(artistData);
      // validate.checkIfProperInput(user_id);
      // validate.checkIfProperInput(bio);
      // validate.checkIfProperInput(profilePic);

      // validate.checkIfString(user_id);
      // validate.checkIfString(bio);
      // validate.checkIfString(profilePic);

      // validate.checkIfValidObjectId(user_id);
      console.log(artistData);
      if (!artistData) {
        return res.status(400).json({ Error: "No fields in the request body" });
      }
      // validate.checkIfProperInput(artistData.bio);
      // validate.checkIfProperInput(artistData.profilePic);
      // validate.checkIfString(artistData.bio);
      // validate.checkIfString(artistData.profilePic);

      const newArtist = await artistMethods.create(
        req.session.user._id,
        artistData.bio,
        artistData.profilePicture
      );
      res.redirect("/user/login");
    } 
     
     catch (e) {
      res.json("Error: Couldn't create artist");
    }
  });

router.route("/:artistId").get(async (req, res) => {
  try {
    const id = req.params.artistId;
    const artistInfo = await artistMethods.get(id.trim());
    const artworkArr = [];
    for (let i=0; i<artistInfo.portfolio.length; i++){
      let temp = await productMethods.get(artistInfo.portfolio[i]);
      artworkArr.push(temp);
    }
    if (req.session && req.session.user && req.session.user.role === "user"){
      return res.render("home/artistclick", {artistInfo, artworkArr, title:"Artist Info", userName: req.session.user.username, loggedIn: true, user: true});
    }
    else if (req.session && req.session.user && req.session.user.role === "artist"){
      return res.render("home/artistclick", {artistInfo, artworkArr, title:"Artist Info", userName: req.session.user.username, loggedIn: true, user: false});
    }
    
    return res.render("home/artistclick", {artistInfo, artworkArr, title:"Artist Info"})
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
    
    if (req.session && req.session.user && req.session.user.role === "user"){
      return res.render("home/artist", {allArtists, title: "Artists", userName: req.session.user.username, loggedIn: true, user: true});
    }
    else if (req.session && req.session.user && req.session.user.role === "artist"){
      return res.render("home/artist", {allArtists, title: "Artists", userName: req.session.user.username, loggedIn: true, user: false});
    }
    
    return res.render("home/artist", {allArtists, title: "Artists"});
  } catch (e) {
    res.send(404).render("error", { message: e });
  }
  
  })


  

export default router




// console.log("In ADDproductsPOST")
//   const productData = req.body
//   const userId=req.session.user._id.trim()
//   const fetchArtistID =  await artistMethods.getArtistProfile(userId)
//   console.log(fetchArtistID)


// router.route("/addProduct").post(async (req, res) => {
//   console.log("In ADDproductsPOST");
//   const productData = req.body;
//   // console.log(productData);
//   const tagsArray = productData.tags.split(",");
//   const imagesArray = productData.images.split(",");
//   const userId = req.session.user._id;
//   const fetchArtistID = await artistMethods.getArtistProfile(userId);
//   // console.log(fetchArtistID);

//   const addProduct = await productMethods.create(
//     fetchArtistID._id,
//     productData.productName,
//     productData.productDescription,
//     tagsArray,
//     productData.price,
//     imagesArray);

  
//   // fetchArtistID.portfolio.push(addProduct._id);
//   const result = await artistMethods.updateProductInArtist(fetchArtistID._id,addProduct._id)
  
//   // fetchArtistID.
//   // console.log(artworkId);
//   // const enterArtidintoArtist = await artistMethods.updateArtist()

//   return res.redirect("/artist/getProducts") ;