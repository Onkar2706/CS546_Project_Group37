import express from "express";
import { ObjectId } from "mongodb";
import { productMethods } from "../data/index.js";
import { artistMethods } from "../data/index.js";

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
    return res.redirect("/artist/getProducts");
  } catch (error) {
    res.status(400).render("error", { errorMessage: error });
  }
});

router.route("/edit/:id").get(async (req, res) => {
  try {
    idOutside = xss(req.params.id);
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
      title: addProduct,
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
      title: "addProduct",
      userName: xss(req.session.user.username),
      loggedIn: true,
      user: xss(req.session.user.role) === "user" ? true : false,
      artist: xss(req.session.user.role) === "user" ? false : true,
    });
  } else if (
    req.session &&
    req.session.user &&
    req.session.user.role === "admin"
  ) {
    return res.render("product/addProduct", {
      title: "addProduct",
      userName: req.session.user.username,
      loggedIn: true,
      artist: true,
      admin: true,
    });
  }
  return res.render("product/addProduct");
});

router
  .route("/addProduct")
  .post(uploads.array("images", 3), async (req, res) => {
    try {
      console.log("In ADDproductsPOST");
      const productData = req.body;
      console.log(productData);

      validate.checkIfProperInput(productData.productName);
      validate.checkIfProperInput(productData.productDescription);
      validate.checkIfProperInput(productData.price);
      // validate.checkIfProperInput(productData.images)
      validate.checkIfProperInput(productData.tags);

      validate.checkIfString(productData.productName);
      validate.checkIfString(productData.productDescription);
      validate.checkIfPositiveNumber(productData.price);

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

      const result = await artistMethods.updateProductInArtist(
        fetchArtistID._id,
        addProduct._id
      );

      return res.redirect("/artist/getProducts");
    } catch (error) {
      res.status(400).render("error", { errorMessage: error });
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

  .post(uploads.single("profilePicture"), async (req, res) => {
    try {
      const artistData = req.body;
      validate.checkIfProperInput(artistData.bio);

      validate.checkIfString(artistData.bio);

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
      );
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
    } else if (
      req.session &&
      req.session.user &&
      req.session.user.role === "admin"
    ) {
      return res.render("artist/artistclick", {
        userName: req.session.user.username,
        loggedIn: true,
        artist: true,
        admin: true,
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
      } else if (
        req.session &&
        req.session.user &&
        req.session.user.role === "admin"
      ) {
        return res.render("artist/artist", {
          allArtists,
          title: "Artists",
          userName: req.session.user.username,
          loggedIn: true,
          artist: false,
          admin: true,
        });
      }

      return res.render("artist/artist", { allArtists, title: "Artists" });
    } catch (error) {
      res.status(404).render("error", { errorMessage: error });
    }
  })
  .post(async (req, res) => {
    try {
      console.log(req.body);

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
