import userRoutes from "./user.js";
import artistRoutes from "./artists.js";
import homeRoutes from "./home.js";
import logout from "./logout.js";
import postRoutes from "./post.js";
import productRoutes from "./products.js";
import path from "path";

const constructor = (app) => {
  app.use("/", homeRoutes);
  app.use("/user", userRoutes);
  app.use("/artist", artistRoutes);
  app.use("/logout", logout);
  app.use("/post", postRoutes);
  app.use("/products", productRoutes);
  app.use("*", (req, res) => {
    res.status(404).render("error", { message: "Page Not Found" });
  });
};

export default constructor;
