import express from "express";
import { artistMethods, productMethods, userMethods } from "../data/index.js";

const router = express.Router();
router.route("/").get(async (req, res) => {
  try {
    let allProducts = await productMethods.getAll();
    // console.log(allProducts[0]);
    if (req.session && req.session.user && req.session.user.role === "user"){
      return res.render("home/market", {title: "MarketPlace", items: allProducts, userName: req.session.user.username, loggedIn: true,
      user: req.session.user.role === "user" ? true : false,
      artist: req.session.user.role === "user" ? false : true });
    }
    else if (req.session && req.session.user && req.session.user.role === "artist"){
      return res.render("home/market", {title: "MarketPlace", items: allProducts, userName: req.session.user.username, loggedIn: true,
      user: req.session.user.role === "user" ? true : false,
      artist: req.session.user.role === "user" ? false : true });
    }
    return res.render("home/market", {
      title: "MarketPlace",
      items: allProducts,
    });
  } catch (e) {
    res.send(404).render("error", { message: e });
  }
});

router
.route('/cart')
.get(async (req, res) => {
    try {
      const id = req.session.user._id;
      const userInfo = await userMethods.get(id);
      const purchaseProd = userInfo.purchases;

      let productData = [];
      for (let i=0; i<purchaseProd.length; i++){
        let temp = await productMethods.get(purchaseProd[i]);
        productData.push(temp);
      }

      let totalPrice = null;
      for (let i=0; i<productData.length; i++){
        totalPrice += productData[i]['price'];
      } 
      productData.push(totalPrice);
      return res.render('product/cart', {productData, totalPrice, title: 'Cart', userName: req.session.user.username, loggedIn: true, user: req.session.user.role === "user" ? true : false,
      artist: req.session.user.role === "user" ? false : true});
    } catch (error) {
      console.log(error);
    }
});

router.route("/:productId").get(async (req, res) => {
  try {
    const id = req.params.productId;
    const productInfo = await productMethods.get(id.trim());
    const artistInfo = await artistMethods.get(productInfo.artistId.trim());
    if (req.session && req.session.user && req.session.user.role === "user"){
      return res.render('home/productclick', {productInfo, artistInfo, title: "Product Info", userName: req.session.user.username, loggedIn: true, user: req.session.user.role === "user" ? true : false,
      artist: req.session.user.role === "user" ? false : true});
    }
    else if (req.session && req.session.user && req.session.user.role === "artist"){
      return res.render("home/productclick", {productInfo, artistInfo, title: "Product Info", userName: req.session.user.username, loggedIn: true, user: req.session.user.role === "user" ? true : false,
      artist: req.session.user.role === "user" ? false : true});
    }
    return res.render("home/productclick", {
      productInfo,
      artistInfo,
      title: "Product Info",
    });
  } catch (error) {
    res.json(error);
  }
});

router.route('/addToCart/:productId').get(async (req, res) => {
  try {
    const id = req.params.productId.trim();
    const userid = req.session.user._id;
    const addPurchase = await userMethods.purchaseProduct(id, userid);
    console.log("success");
    return res.redirect('/products/cart');
  } catch (error) {
    console.log(error)
  }
})

export default router;
