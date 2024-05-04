import express from "express";
import { ObjectId } from "mongodb";
import { productMethods } from "../data/index.js";
import { artistMethods } from "../data/index.js";
import validate from "../helpers.js";
import artWork from "../data/artwork.js";

const router = express.Router();

router.route("/getProducts").get(async (req, res) => {
  try {
    const getArtwork = await artWork.getAll();

    return res.render("home/getProducts", {
      title: "Products",
      products: getArtwork,
    });
  } catch (error) {
    console.log(error);
  }
});

router.route("/addProduct").get(async (req, res) => {
  try {
    return res.render("home/addProduct");
  } catch (error) {
    console.log(error);
  }
});

router.route("/addProduct").post(async (req, res) => {
  try {
    // Validations
    validate.checkIfProperInput(productName);
    validate.checkIfProperInput(productDescription);
    validate.checkIfProperInput(productTags);
    validate.checkIfProperInput(price);

    validate.checkIfString(productName);
    validate.checkIfString(productDescription);
    validate.checkIfString(productTags);
    validate.checkIfString(price);

    validate.checkIfPositiveNumber(price);

    console.log("In ADDproductsPOST");
    const productData = req.body;

    const userId = req.session.user._id.trim();
    const fetchArtistID = await artistMethods.getArtistProfile(userId);
    console.log(fetchArtistID);

    const addProduct = await productMethods.create(
      fetchArtistID,
      productData.productName,
      productData.productDescription,
      productData.productTags,
      productData.price,
      productData.images
    );

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
    return res.render("home/artistclick", { artistInfo, title: "Artist Info" });
  } catch (error) {
    res.json(error);
  }
});

router.route("/").get(async (req, res) => {
  try {
    let allArtists = await artistMethods.getAll();
    return res.render("home/artist", { allArtists, title: "Artists" });
  } catch (e) {
    res.send(404).render("error", { message: e });
  }
});

export default router;
