import express from "express";
import { productMethods } from "../data/index.js";

const router = express.Router();
router.route("/").get(async (req, res) => {
  try {
    let allProducts = await productMethods.getAll();
    return res.render("home/market", { items: allProducts});
  } catch (e) {
    res.send(404).render("error", { message: e });
  }
});

export default router;
