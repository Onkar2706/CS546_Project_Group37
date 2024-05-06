//Here is where you'll set up your server as shown in lecture code
import express from "express";
import configRoutes from "./routes/index.js";
import exphbs from "express-handlebars";
import session from "express-session";
import path from "path";

const app = express();
const now = new Date();
const expiresAt = new Date();
expiresAt.setHours(expiresAt.getHours() + 1);
app.use(
  session({
    name: "AuthenticationState",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: false,
    // expires: 3600000, //makes session expire after an hour
    cookie: {
      // expires: 60000,
      expires: 3600000, //makes session expire after an hour
    },
  })
);
app.use(express.json());

app.use("/public", express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use("/", (res, req, next) => {
  //just logs every request
  console.log(
    "[" +
      new Date().toUTCString() +
      "]: " +
      req.req.method +
      " " +
      req.req.originalUrl
  );
  if (req.req.path == "/") {
    if (!req.req.session.user) {
      console.log("(Non Authenticated User)");
    } else {
      console.log("(Authenticated User)");
    }
  }
  next();
});
// app.use("/user/login", (res, req, next) => {
//   if (req.req.session.user) {
//     if (req.req.session.user.role === "user") {
//       return res.res.redirect("/user/user");
//     } else if (req.req.session.user.role === "artist") {
//       return res.res.redirect("");
//     }
//   }
//   next();
// });

// app.use("/user/registerArtist", (res, req, next) => {
//   if (req.req.session.user && req.req.session.user.role === "user") {
//     next();
//   }
// });

app.use("/user/userInfo", (res, req, next) => {
  if (req.req.session.user) {
    next();
  } else {
    return res.res.redirect("/");
  }
});
app.use("/user/editUserInfo", (res, req, next) => {
  if (req.req.session.user) {
    next();
  } else {
    return res.res.redirect("/");
  }
});
app.use("/user/editArtistInfo", (res, req, next) => {
  if (!req.req.session.user || req.req.session.user.role !== "artist") {
    return res.res.redirect("/");
  } else {
    next();
  }
});

app.use("/post/addBlog", (res, req, next) => {
  if (!req.req.session.user) {
    return res.res.redirect("/");
  } else {
    next();
  }
});

app.use("/post/:postId/comment", (res, req, next) => {
  if (!req.req.session.user) {
    return res.res.redirect("/");
  } else {
    next();
  }
});

app.use("/user/register", (res, req, next) => {
  if (req.req.session.user) {
    return res.res.redirect("/");
  }
  next();
});

app.use("/user/user", (res, req, next) => {
  if (!req.req.session.user) {
    return res.res.redirect("/");
  } else {
    next();
  }
});

app.use("/user/admin", (res, req, next) => {
  if (!req.req.session.user) {
    return res.res.status(403).render("error", {
      errorMessage: "Woops, looks like you can't access this page!",
    });
  } else {
    if (req.req.session.user.role === "admin") {
      next();
    } else {
      return res.res.status(403).render("error", {
        errorMessage: "Woops, looks like you can't access this page!",
      });
    }
  }
});

// app.use("/artist/addProduct", (res, req, next) => {
//   if (!req.req.session.user) {
//     console.log(req.req.session);
//     return res.res.redirect("/");
//   } else {
//     if (req.req.session.user.role === "artist") {
//       next();
//     } else {
//       console.log(req.req.session.user.role);
//       res.res.redirect("/");
//     }
//   }
// });

app.use("/artist/deleteProduct/:id", (res, req, next) => {
  if (!req.req.session.user) {
    return res.res.redirect("/");
  } else {
    if (req.req.session.user.role === "artist") {
      next();
    } else {
      res.res.redirect("/");
    }
  }
});

app.use("/artist/edit/:id", (res, req, next) => {
  if (!req.req.session.user) {
    return res.res.redirect("/");
  } else {
    if (req.req.session.user.role === "artist") {
      next();
    } else {
      res.res.redirect("/");
    }
  }
});

app.use("/artist/updateProduct", (res, req, next) => {
  if (!req.req.session.user) {
    return res.res.redirect("/");
  } else {
    if (req.req.session.user.role === "artist") {
      next();
    } else {
      res.res.redirect("/");
    }
  }
});

app.use("/artist/addProduct", (res, req, next) => {
  if (!req.req.session.user) {
    return res.res.redirect("/");
  } else {
    if (req.req.session.user.role === "artist") {
      next();
    } else {
      res.res.redirect("/");
    }
  }
});
app.use("/artist/getProducts", (res, req, next) => {
  if (!req.req.session.user) {
    return res.res.redirect("/");
  } else {
    if (req.req.session.user.role === "artist") {
      next();
    } else {
      res.res.redirect("/");
    }
  }
});

app.use("/artist/artistreg", (res, req, next) => {
  if (!req.req.session.user || req.req.session.user.role === "artist") {
    return res.res.redirect("/");
  } else {
    next();
  }
});

app.use("/admin/posts", (res, req, next) => {
  if (!req.req.session.user || req.req.session.user.role !== "admin") {
    return res.res.status(403).render("error", {
      errorMessage: "Woops, looks like you can't access this page!",
    });
  } else {
    next();
  }
});

app.use("/admin/removePost/:postId", (res, req, next) => {
  if (!req.req.session.user || req.req.session.user.role !== "admin") {
    return res.res.status(403).render("error", {
      errorMessage: "Woops, looks like you can't access this page!",
    });
  } else {
    next();
  }
});
app.use("/admin/users", (res, req, next) => {
  if (!req.req.session.user || req.req.session.user.role !== "admin") {
    return res.res.status(403).render("error", {
      errorMessage: "Woops, looks like you can't access this page!",
    });
  } else {
    next();
  }
});
app.use("/admin/removeUser/:userId", (res, req, next) => {
  if (!req.req.session.user || req.req.session.user.role !== "admin") {
    return res.res.status(403).render("error", {
      errorMessage: "Woops, looks like you can't access this page!",
    });
  } else {
    next();
  }
});

app.use("/products/cart", (res, req, next) => {
  if (!req.req.session.user) {
    res.res.redirect("/");
  } else {
    next();
  }
});

app.use("/products/addToCart/:productId", (res, req, next) => {
  if (!req.req.session.user) {
    res.res.redirect("/");
  } else {
    next();
  }
});

app.use("/products/removeFromCart/:productId", (res, req, next) => {
  if (!req.req.session.user) {
    res.res.redirect("/");
  } else {
    next();
  }
});

app.use("/products/rate/:productId", (res, req, next) => {
  if (!req.req.session.user) {
    res.res.redirect("/");
  } else {
    next();
  }
});

app.use("/admin/products", (res, req, next) => {
  if (!req.req.session.user || req.req.session.user.role !== "admin") {
    return res.res.status(403).render("error", {
      errorMessage: "Woops, looks like you can't access this page!",
    });
  } else {
    next();
  }
});

app.use("/logout", (res, req, next) => {
  if (!req.req.session) {
    return res.res.redirect("/");
  } else {
    next();
  }
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
