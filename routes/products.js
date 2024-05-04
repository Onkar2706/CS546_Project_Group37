import express from "express";
import { artistMethods, productMethods } from "../data/index.js";

const router = express.Router();
router.route("/").get(async (req, res) => {
  try {
    let allProducts = await productMethods.getAll();
    // console.log(allProducts[0]);
    if (req.session && req.session.user && req.session.user.role === "user"){
      return res.render("home/market", {title: "MarketPlace", items: allProducts, userName: req.session.user.username, loggedIn: true, user: true});
    }
    else if (req.session && req.session.user && req.session.user.role === "artist"){
      return res.render("home/market", {title: "MarketPlace", items: allProducts, userName: req.session.user.username, loggedIn: true, user: false});
    }
    return res.render("home/market", {
      title: "MarketPlace",
      items: allProducts,
    });
  } catch (e) {
    res.send(404).render("error", { message: e });
  }
});

router.route("/:productId").get(async (req, res) => {
  try {
    const id = req.params.productId;
    const productInfo = await productMethods.get(id.trim());
    const artistInfo = await artistMethods.get(productInfo.artistId.trim());
    return res.render("home/productclick", {
      productInfo,
      artistInfo,
      title: "Product Info",
    });
  } catch (error) {
    res.json(error);
  }
});

export default router;
