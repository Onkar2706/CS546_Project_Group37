import userRoutes from "./user.js";
import artistRoutes from "./artists.js";
import homeRoutes from "./home.js";
import logout from "./logout.js";
import postRoutes from "./post.js";
import productRoutes from "./products.js";
import adminRoutes from "./admin.js";
import path from "path";
import xss from "xss"

let constructor = null
try {

   constructor = (app) => {
    app.use("/", homeRoutes);
    app.use("/user", userRoutes);
    app.use("/artist", artistRoutes);
    app.use("/logout", logout);
    app.use("/post", postRoutes);
    app.use("/products", productRoutes);
    app.use("/admin", adminRoutes);
    app.use("*", (req, res) => {
      res.status(404).render("error", { errorMessage: "404: Page Not Found" });
    });
  };
  
} catch (error) {
  app.use(res.status(400).render("error",{errorMessage:error}));
}



export default constructor;
