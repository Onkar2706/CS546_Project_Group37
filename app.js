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
app.use('/uploads', express.static('uploads'));
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

app.use("/user/register", (res, req, next) => {
  if (req.req.session.user) {
    if (
      req.req.session.user.role === "user" ||
      req.req.session.user.role === "artist"
    ) {
      return res.res.redirect("/user/user");
    } else {
      return res.res.redirect("/user/admin");
    }
  }
  next();
});

app.use("/user/user", (res, req, next) => {
  if (!req.req.session.user) {
    return res.res.redirect("/user/login");
  } else {
    next();
  }
});

app.use("/user/admin", (res, req, next) => {
  if (!req.req.session.user) {
    return res.res.redirect("/user/login");
  } else {
    if (req.req.session.user.role === "admin") {
      next();
    } else {
      return res.status(403).render("error", {
        errorMessage: "Woops, looks like you can't access this page!",
      });
    }
  }
});

app.use("/logout", (res, req, next) => {
  if (!req.req.session) {
    return res.res.redirect("/login");
  } else {
    next();
  }
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
