import express from "express";
import { ObjectId } from "mongodb";
import { productMethods } from "../data/index.js";
import { artistMethods } from "../data/index.js";
// import { productMethods } from "../data/index.js";
// import { artistMethods } from "../data/index.js";
import validate from "../helpers.js";
import artWork from "../data/artwork.js";

const router = express.Router();

let idOutside = null
let idOutside_delete=null



// router.route("/deleteProduct/:id")
// .get(async (req, res) => {
//   try {
//     idOutside_delete = req.params.id
//     const deleteProduct = await artWork.remove(idOutside_delete.trim())
//     const deleteProduct_artistCollection= await artistMethods.removeFromCollection(idOutside_delete.trim())
//     console.log(deleteProduct_artistCollection)
    

    
//   } catch (error) {
//     res.status(400).render("error",{errorMessage:error});
    
//   }
  

// })

router.route("/edit/:id")
.get(async (req, res) => {
  try {
    idOutside = req.params.id
    const artData = await artWork.get(idOutside.trim())
    console.log(artData)
    res.render("product/editUpdateProduct",{title:"editProduct",artData, idOutside})
  } catch (error) {
      res.status(400).render("error",{errorMessage:error});
  }


})



router
.route("/updateProduct")
.post(async(req,res)=>{
  console.log("Inupdateproduct")
  try {
   
    let updatedProduct =req.body
    // Validations
    validate.checkIfProperInput(updatedProduct.productName)
    validate.checkIfProperInput(updatedProduct.productDescription)
    validate.checkIfProperInput(updatedProduct.price)
    validate.checkIfProperInput(updatedProduct.images)
    validate.checkIfProperInput(updatedProduct.tags)

    validate.checkIfString(updatedProduct.productName)
    validate.checkIfString(updatedProduct.productDescription)

    validate.checkIfPositiveNumber(updatedProduct.price)

    if (typeof updatedProduct.tags === 'string') {
      updatedProduct.tags = updatedProduct.tags.split(",");
    }
    
    if (typeof updatedProduct.images === 'string') {
      updatedProduct.images = updatedProduct.images.split(",");
    }
    console.log(updatedProduct)
    const updatedproductInDB = await artWork.updateProduct(idOutside,updatedProduct)
    console.log(updatedproductInDB)
    res.redirect("/artist/getProducts")
    
  } catch (error) {
    console.log(error)
    
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
      return res.render("product/getProducts", {
        title: "Products",
        products: artworkArr,
        userName: req.session.user.username,
        loggedIn: true,
        user: req.session.user.role === "user" ? true : false,
        artist: req.session.user.role === "user" ? false : true 
      });
      
    } else {
      getArtwork = await artWork.getAll();
      return res.render("product/getProducts", {
        title: "Products",
        products: artworkArr,
      });
    }
  } catch (error) {+
    res.status(500).render("error",{errorMessage:error});
  }
});



router
.route('/addProduct')
.get(async(req,res)=>{

  if (req.session && req.session.user && req.session.user.role === "user"){
    return res.render("product/addProduct", { userName: req.session.user.username, loggedIn: true, user: req.session.user.role === "user" ? true : false,
    artist: req.session.user.role === "user" ? false : true });
  }
  else if (req.session && req.session.user && req.session.user.role === "artist"){
    return res.render("product/addProduct", {userName: req.session.user.username, loggedIn: true, user: req.session.user.role === "user" ? true : false,
    artist: req.session.user.role === "user" ? false : true});
  }
  return res.render("product/addProduct")
})



  
// });
router.route("/addProduct")
.post(async (req, res) => {
  // console.log("In ADDproductsPOST");
  const productData = req.body;
  console.log(productData)

  validate.checkIfProperInput(productData.productName)
  validate.checkIfProperInput(productData.productDescription)
  validate.checkIfProperInput(productData.price)
  validate.checkIfProperInput(productData.images)
  validate.checkIfProperInput(productData.tags)

  validate.checkIfString(productData.productName)
  validate.checkIfString(productData.productDescription)
  validate.checkIfPositiveNumber(productData.price)

  // console.log(productData);
  const tagsArray = productData.tags.split(",");
  const imagesArray = productData.images.split(",");
  const userId = req.session.user._id;
  console.log("i AM HERE")
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
      return res.render("artist/artistreg", { title: "Artist Registration" });
    } catch (error) {
      res.status(400).render("error",{errorMessage:error});
    }
  })
  .post(async (req, res) => {
    
    try {
      const artistData = req.body;
      console.log(artistData);
      
      validate.checkIfProperInput(artistData.bio);
      validate.checkIfString(artistData.bio);
      // profile pic validation left
      validate.checkIfProperInput(artistData.profilePicture)

      console.log(artistData);
      if (!artistData) {
        return res.status(400).json({ Error: "No fields in the request body" });
      }

      const newArtist = await artistMethods.create(
        req.session.user._id,
        artistData.bio,
        artistData.profilePicture
      );
      res.redirect("/user/login");
    } 
     
     catch (error) {
      res.status(400).render("error",{errorMessage:error});
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
      return res.render("artist/artistclick", {artistInfo, artworkArr, title:"Artist Info", userName: req.session.user.username,
      loggedIn: true, user: req.session.user.role === "user" ? true : false,
      artist: req.session.user.role === "user" ? false : true});
    }
    else if (req.session && req.session.user && req.session.user.role === "artist"){
      return res.render("artist/artistclick", {artistInfo, artworkArr, title:"Artist Info", userName: req.session.user.username,
      loggedIn: true, user: req.session.user.role === "user" ? true : false,
      artist: req.session.user.role === "user" ? false : true});
    }
    
    return res.render("artist/artistclick", {artistInfo, artworkArr, title:"Artist Info"})
  }
  catch(error){
    res.status(400).render("error",{errorMessage:error});
  }
});


router
.route("/")
.get(async (req, res) => {
  try {
    let allArtists = await artistMethods.getAll();
    
    if (req.session && req.session.user && req.session.user.role === "user"){
      return res.render("artist/artist", {allArtists, title: "Artists", userName: req.session.user.username,
      loggedIn: true,
      user: req.session.user.role === "user" ? true : false,
      artist: req.session.user.role === "user" ? false : true });
    }
    else if (req.session && req.session.user && req.session.user.role === "artist"){
      return res.render("artist/artist", {allArtists, title: "Artists", userName: req.session.user.username,
      loggedIn: true,
      user: req.session.user.role === "user" ? true : false,
      artist: req.session.user.role === "user" ? false : true });
    }
    
    return res.render("artist/artist", {allArtists, title: "Artists"});
  } catch (error) {
    res.status(404).render("error",{errorMessage:error});
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