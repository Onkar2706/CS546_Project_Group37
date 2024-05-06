import express from "express";
import { artistMethods, productMethods, userMethods } from "../data/index.js";
import validate from "../helpers.js";

const router = express.Router();
router.route("/").get(async (req, res) => {
  try {
    let allProducts = await productMethods.getAll();
    // console.log(allProducts[0]);
    if (req.session && req.session.user && req.session.user.role === "user"){
      return res.render("product/market", {title: "MarketPlace", items: allProducts, userName: req.session.user.username, loggedIn: true,
      user: req.session.user.role === "user" ? true : false,
      artist: req.session.user.role === "user" ? false : true });
    }
    else if (req.session && req.session.user && req.session.user.role === "artist"){
      return res.render("product/market", {title: "MarketPlace", items: allProducts, userName: req.session.user.username, loggedIn: true,
      user: req.session.user.role === "user" ? true : false,
      artist: req.session.user.role === "user" ? false : true });
    }
    return res.render("product/market", {
      title: "MarketPlace",
      items: allProducts,
    });
  } catch (error) {
    res.status(404).render("error",{errorMessage:error});
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
      let totalPrice = null;

      if (purchaseProd.length > 0){
        for (let i=0; i<purchaseProd.length; i++){
          let temp = await productMethods.get(purchaseProd[i]);
          productData.push(temp);
        }
  
        for (let i=0; i<productData.length; i++){
          totalPrice += productData[i]['price'];
        } 
        // productData.push(totalPrice);
      }

      return res.render('product/cart', {productData, totalPrice, title: 'Cart', userName: req.session.user.username, loggedIn: true, user: req.session.user.role === "user" ? true : false,
      artist: req.session.user.role === "user" ? false : true});
    } catch (error) {
      res.status(400).render("error",{errorMessage:error});
    }
});

router.route("/:productId").get(async (req, res) => {
  try {
    const id = req.params.productId;
    const productInfo = await productMethods.get(id.trim());
    const artistInfo = await artistMethods.get(productInfo.artistId.trim());
    const reviews = productInfo.reviews;
    let ratingsArr = [];
    for (let i=0; i<reviews.length; i++){
      ratingsArr.push(reviews[i]['ratings'])
    }
    const avgRating = validate.calculateAverageRating(ratingsArr);
    if (req.session && req.session.user && req.session.user.role === "user"){
      return res.render('product/productclick', {productInfo, artistInfo, title: "Product Info", avgRating, userName: req.session.user.username, loggedIn: true, user: req.session.user.role === "user" ? true : false,
      artist: req.session.user.role === "user" ? false : true});
    }
    else if (req.session && req.session.user && req.session.user.role === "artist"){
      return res.render("product/productclick", {productInfo, artistInfo, title: "Product Info", avgRating, userName: req.session.user.username, loggedIn: true, user: req.session.user.role === "user" ? true : false,
      artist: req.session.user.role === "user" ? false : true});
    }
    return res.render("product/productclick", {
      productInfo,
      artistInfo,
      avgRating,
      title: "Product Info",
    });
  } catch (error) {
    res.status(400).render("error",{errorMessage:error});
  }
});

router.route('/addToCart/:productId').get(async (req, res) => {
  try {
    const id = req.params.productId.trim();
    const userid = req.session.user._id;
    const addPurchase = await userMethods.purchaseProduct(id, userid);
    return res.redirect('/products/cart');
  } catch (error) {
    res.status(400).render("error",{errorMessage:error});
  }
}); 

router.route('/removeFromCart/:productId').get( async (req, res) => {
  try {
    console.log("Inside here");
    const id = req.params.productId;
    const userid = req.session.user._id;
    const removePurhcase = await userMethods.removeFromCart(id, userid);
    console.log(removePurhcase);
    return res.redirect('/products/cart');
  } catch (error) {
    console.log(error);
    res.status(400).render("error",{errorMessage:error});
  }
});

router.route('/rate/:productId').post(async (req, res) => {
  try {
    const id = req.params.productId;
    const rating = req.body.rating;
    const comment = req.body.comment;
    const addReview = await productMethods.addReview(id, req.session.user.username, rating, comment);
    console.log('success');
    return res.redirect(`/products/${id}`);
  } catch (error) {
    res.status(400).render("error",{errorMessage:error});
  }
})

export default router;
