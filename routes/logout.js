import express from "express";

const 
router = express.Router();
router
.route("/")
.get(async (req, res) => {
  try {
    req.session.destroy(err => {
      if (err) {
        res.status(500).send('Error logging out');
      } else {
        res.redirect("/")
      }
    })
  } catch (error) {
    res.status(400).render("error",{errorMessage:error});
  }
})
export default router;