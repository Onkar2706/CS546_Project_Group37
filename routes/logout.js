import express from "express";

const 
router = express.Router();
router
.route("/")
.get(async (req, res) => {
    console.log("in logout")
    //code here for GET
    req.session.destroy(err => {
      if (err) {
        // console.error('Error destroying session:', err);
        res.status(500).send('Error logging out');
      } else {
        // Inform the user that they have been logged out
        // res.send('You have been logged out. <a href="/login">Click here to login</a>');
        res.redirect("/")
      }
    })
})
export default router;