import express from "express";
import { ObjectId } from "mongodb";
import { productMethods } from "../data/index.js";
import { artistMethods } from "../data/index.js";
// import { productMethods } from "../data/index.js";
// import { artistMethods } from "../data/index.js";
import validate from "../helpers.js";
import artWork from "../data/artwork.js";
import xss from "xss";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Uploads folder where images will be stored temporarily
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use original filename
  },
});
const uploads = multer({ storage: storage });

// Upload Image
// import fileExtLimiter from "../middleware/fileExtLimiter.js"
// import fileSizesLimiter from "../middleware/fileSizeLimiter.js"
// import filesPayloadExists from "../middleware/filesPayloadExists.js"
// import fileUpload from "express-fileupload";

// import path from "path";

const router = express.Router();

let idOutside = null;
let idOutside_delete = null;

router.route("/deleteProduct/:id").get(async (req, res) => {
  try {
    idOutside_delete = req.params.id;
    const userId = req.session.user._id;
    const fetchArtist = await artistMethods.getArtistProfile(userId.trim());
    const removeFromArtist = await productMethods.removeFromArtWork(
      idOutside_delete,
      fetchArtist._id
    );
    console.log("Removed from artist port..");
    const removeFromDB = await productMethods.remove(idOutside_delete);
    console.log("product removed from db");
    // if(req.params.id === null) res.redirect("product/getProduct")

    // console.log(idOutside_delete.toString())
    // const deleteProduct = await artWork.removeProductfromDB(idOutside_delete.trim())
    // console.log(deleteProduct)
    return res.redirect("/artist/getProducts");
    // const deleteProduct_artistCollection= await artistMethods.removeFromCollection(idOutside_delete.trim())
    // console.log(deleteProduct_artistCollection)
  } catch (error) {
    res.status(400).render("error", { errorMessage: error });
  }
});

router.route("/edit/:id").get(async (req, res) => {
  try {
    idOutside = xss(req.params.id);
    // if(req.params.id === null) res.redirect("product/getProduct")
    const artData = await artWork.get(idOutside.trim());
    console.log(artData);
    res.render("product/editUpdateProduct", {
      title: "editProduct",
      artData,
      idOutside,
    });
  } catch (error) {
    res.status(400).render("error", { errorMessage: error });
  }
});

router.route("/updateProduct").post(async (req, res) => {
  console.log("Inupdateproduct");
  try {
    let updatedProduct = req.body;
    // Validations
    validate.checkIfProperInput(xss(updatedProduct.productName));
    validate.checkIfProperInput(xss(updatedProduct.productDescription));
    validate.checkIfProperInput(xss(updatedProduct.price));
    validate.checkIfProperInput(xss(updatedProduct.images));
    validate.checkIfProperInput(xss(updatedProduct.tags));

    validate.checkIfString(xss(updatedProduct.productName));
    validate.checkIfString(xss(updatedProduct.productDescription));

    validate.checkIfPositiveNumber(xss(updatedProduct.price));

    if (typeof updatedProduct.tags === "string") {
      updatedProduct.tags = updatedProduct.tags.split(",");
    }

    if (typeof updatedProduct.images === "string") {
      updatedProduct.images = updatedProduct.images.split(",");
    }
    console.log(updatedProduct);
    const updatedproductInDB = await artWork.updateProduct(
      idOutside,
      updatedProduct
    );
    console.log(updatedproductInDB);
    res.redirect("/artist/getProducts");
  } catch (error) {
    console.log(error);
  }
});

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
    for (let i = 0; i < artwork.length; i++) {
      let temp = await productMethods.get(artwork[i]);
      artworkArr.push(temp);
    }

    if (req.session && req.session.user) {
      return res.render("product/getProducts", {
        title: "Products",
        products: artworkArr,
        userName: xss(req.session.user.username),
        loggedIn: true,
        user: xss(req.session.user.role) === "user" ? true : false,
        artist: xss(req.session.user.role) === "user" ? false : true,
      });
    } else {
      getArtwork = await artWork.getAll();
      return res.render("product/getProducts", {
        title: "Products",
        products: artworkArr,
      });
    }
  } catch (error) {
    res.status(500).render("error", { errorMessage: error });
  }
});

router.route("/addProduct").get(async (req, res) => {
  if (req.session && req.session.user && req.session.user.role === "user") {
    return res.render("product/addProduct", {
      userName: xss(req.session.user.username),
      loggedIn: true,
      user: xss(req.session.user.role) === "user" ? true : false,
      artist: xss(req.session.user.role) === "user" ? false : true,
    });
  } else if (
    req.session &&
    xss(req.session.user) &&
    xss(req.session.user.role) === "artist"
  ) {
    return res.render("product/addProduct", {
      userName: xss(req.session.user.username),
      loggedIn: true,
      user: xss(req.session.user.role) === "user" ? true : false,
      artist: xss(req.session.user.role) === "user" ? false : true,
    });
  }
  return res.render("product/addProduct");
});

// router
// .route('/addProduct')
// .post(async(req,res)=>{
//   console.log("In ADDproductsPOST")
//   const productData = req.body
//   const userId=req.session.user._id.trim()
//   const fetchArtistID =  await artistMethods.getArtistProfile(userId)
//   console.log(fetchArtistID)

// });
router
  .route("/addProduct")
  .post(uploads.array("images", 3), async (req, res) => {
    try {
      console.log("In ADDproductsPOST");
      const productData = req.body;
      console.log(productData);

      validate.checkIfProperInput(xss(productData.productName));
      validate.checkIfProperInput(xss(productData.productDescription));
      validate.checkIfProperInput(xss(productData.price));
      // validate.checkIfProperInput(xss(productData.images));
      validate.checkIfProperInput(xss(productData.tags));

      validate.checkIfString(xss(productData.productName));
      validate.checkIfString(xss(productData.productDescription));
      validate.checkIfPositiveNumber(xss(productData.price));

      // console.log(productData);
      const tagsArray = productData.tags.split(",");
      const userId = req.session.user._id;
      console.log("i AM HERE");
      const fetchArtistID = await artistMethods.getArtistProfile(userId);
      let imagesArray = req.files.map((file) => file.path);
      imagesArray = imagesArray.map(
        (image) => "/" + image.split("\\").join("/")
      );
      // console.log(fetchArtistID);

      const addProduct = await productMethods.create(
        fetchArtistID._id,
        productData.productName,
        productData.productDescription,
        tagsArray,
        productData.price,
        imagesArray
      );

      // fetchArtistID.portfolio.push(addProduct._id);
      const result = await artistMethods.updateProductInArtist(
        fetchArtistID._id,
        addProduct._id
      );

      // fetchArtistID.
      // console.log(artworkId);
      // const enterArtidintoArtist = await artistMethods.updateArtist()

      return res.redirect("/artist/getProducts");
    } catch (e) {
      res.status(400).render("error", { errorMessage: e });
    }
  });

router
  .route("/artistreg")
  .get(async (req, res) => {
    try {
      return res.render("artist/artistreg", {
        title: "Artist Registration",
        loggedIn: true,
        user: true,
        userName: req.session.user.username,
      });
    } catch (error) {
      res.status(400).render("error", { errorMessage: error });
    }
  })
  // Upload Image
  // .post( fileUpload({ createParentPath: true }),
  // filesPayloadExists,
  // fileExtLimiter([".png",".jpg",".jpeg"]),
  // fileSizesLimiter,
  // async (req, res) => {
  .post(uploads.single("profilePicture"), async (req, res) => {
    try {
      const artistData = req.body;
      // Upload Image

      // let files = req.files;
      // let fileName;
      // let filepath;
      // Object.keys(files).forEach((key) => {
      //    filepath = path.join(
      //     "public",
      //     "images",
      //     "files",
      //     req.session.user.username
      //     ,files[key].name
      //   );
      //   fileName = files[key].name;
      //   console.log(filepath);
      //   files[key].mv(filepath, (err) => {
      //     if (err)
      //       return res.status(500).json({ status: "error", message: err });
      //   });
      // });
      // console.log(filepath)

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
      let profilePicPath = req.file.path;
      profilePicPath = "/" + profilePicPath.split("\\").join("/");
      const newArtist = await artistMethods.create(
        req.session.user._id,
        req.body.bio,
        profilePicPath
        // Upload Image
        // req.body.bio,
        // '/'+filepath
      );
      // console.log(newArtist);
      res.redirect("/logout");
    } catch (error) {
      res.status(400).render("error", { errorMessage: error });
    }
  });

router.route("/:artistId").get(async (req, res) => {
  try {
    const id = xss(req.params.artistId);
    const artistInfo = await artistMethods.get(id.trim());
    const artworkArr = [];
    const fetchRatings = artistInfo.ratings;
    const ratingsArr = [];
    for (let i = 0; i < fetchRatings.length; i++) {
      ratingsArr.push(fetchRatings[i]["ratings"]);
    }
    const avgRating = validate.calculateAverageRating(ratingsArr);

    for (let i = 0; i < artistInfo.portfolio.length; i++) {
      let temp = await productMethods.get(artistInfo.portfolio[i]);
      artworkArr.push(temp);
    }
    if (req.session && req.session.user && req.session.user.role === "user") {
      return res.render("artist/artistclick", {
        artistInfo,
        artworkArr,
        avgRating,
        title: "Artist Info",
        userName: req.session.user.username,
        loggedIn: true,
        user: req.session.user.role === "user" ? true : false,
        artist: req.session.user.role === "user" ? false : true,
      });
    } else if (
      req.session &&
      req.session.user &&
      req.session.user.role === "artist"
    ) {
      return res.render("artist/artistclick", {
        artistInfo,
        artworkArr,
        avgRating,
        title: "Artist Info",
        userName: req.session.user.username,
        loggedIn: true,
        user: req.session.user.role === "user" ? true : false,
        artist: req.session.user.role === "user" ? false : true,
      });
    }

    return res.render("artist/artistclick", {
      artistInfo,
      artworkArr,
      avgRating,
      title: "Artist Info",
    });
  } catch (error) {
    res.status(400).render("error", { errorMessage: error });
  }
});

router
  .route("/")
  .get(async (req, res) => {
    try {
      let allArtists = await artistMethods.getAll();

      if (req.session && req.session.user && req.session.user.role === "user") {
        return res.render("artist/artist", {
          allArtists,
          title: "Artists",
          userName: req.session.user.username,
          loggedIn: true,
          user: req.session.user.role === "user" ? true : false,
          artist: req.session.user.role === "user" ? false : true,
        });
      } else if (
        req.session &&
        req.session.user &&
        req.session.user.role === "artist"
      ) {
        return res.render("artist/artist", {
          allArtists,
          title: "Artists",
          userName: req.session.user.username,
          loggedIn: true,
          user: req.session.user.role === "user" ? true : false,
          artist: req.session.user.role === "user" ? false : true,
        });
      }

      return res.render("artist/artist", { allArtists, title: "Artists" });
    } catch (error) {
      res.status(404).render("error", { errorMessage: error });
    }
  })
  .post(async (req, res) => {
    try {
      let artists = await artistMethods.getByName(
        xss(req.body.firstName),
        xss(req.body.lastName)
      );
      res.status(200).send(artists);
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  });

router.route("/rateArtist/:artistId").post(async (req, res) => {
  try {
    const id = xss(req.params.artistId);
    const rating = xss(req.body.rating);
    const addRating = await artistMethods.addArtistRating(
      id,
      rating,
      req.session.user.username
    );
    return res.redirect(`/artist/${id}`);
  } catch (error) {
    res.status(404).render("error", { errorMessage: error });
  }
});

export default router;

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
