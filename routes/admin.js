import express from "express";
import { artistMethods, postsMethod, productMethods } from "../data/index.js";
import { userMethods } from "../data/index.js";
import xss from "xss"


const router = express.Router();

router
.route("/posts")
.get(async (req, res) => {
    try {
        const allPosts = await postsMethod.getAllPosts();
        console.log(allPosts);
        return res.render('admin/posts',{allPosts, title: "All Posts"});
    } catch (error) {
      res.status(400).render("error",{errorMessage:error});
    }
});

router
.route('/removePost/:postId')
.get( async (req, res) => {
  try {
    console.log("Inside here");
    const id = req.params.postId;
    const removePost = await postsMethod.removePost(id);
    return res.redirect('/admin/posts');
  } catch (error) {
    console.log(error);
    res.status(400).render("error",{errorMessage:error});
  }
});

router.route('/products')
.get(async (req, res) => {
  try {
    const allProducts = await productMethods.getAll();
    return res.render('admin/products', {allProducts, title: "All Products"});
  } catch (error) {
    res.status(400).render("error",{errorMessage:error});
  }
});

router
.route('/removeProduct/:productId')
.get( async (req, res) => {
  try {
    console.log("Inside here");
    const id = req.params.productId;
    const productInfo = await productMethods.get(id);
    const removeProduct = await productMethods.remove(id);
    const removeProductFromArtist = await productMethods.removeFromArtWork(id, productInfo.artistId);
    return res.redirect('/admin/products');
  } catch (error) {
    console.log(error);
    res.status(400).render("error",{errorMessage:error});
  }
});


router
.route('/users')
.get( async (req, res) => {
  try {
    const allUsers = await userMethods.getUsersByRoles();
    
    return res.render('admin/users',{allUsers, title: "All Users"});
} catch (error) {
  res.status(400).render("error",{errorMessage:error});
}
});


router
.route('/removeUser/:userId')
.get( async (req, res) => {
  try {
    console.log("Inside here");
    const id = req.params.userId;
    const userDB = await userMethods.get(id)

    if(userDB.role =='artist'){
      const getArtist = await artistMethods.getArtistProfile(id)
      const removeArtist =await artistMethods.removeArtist(getArtist._id)
    }
    console.log(userDB)
    
    const removePost = await userMethods.removeUser(id);
    return res.redirect('/admin/users');
  } catch (error) {
    console.log(error);
    res.status(400).render("error",{errorMessage:error});
  }
});
export default router;