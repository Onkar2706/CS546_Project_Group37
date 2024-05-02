import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import validate from "./helpers.js";
import {
  userMethods,
  artistMethods,
  productMethods,
  postsMethod,
  purchaseMethods,
} from "./data/index.js";
const db = await dbConnection();
await db.dropDatabase();

let user = await userMethods.create(
  "Chandler",
  "Bing",
  "Monica27",
  "$2a$10$GaDW/VYnVtXuuUpJbMZ8AuppqiWKQ/z8n3oGlJxBe8fRVDcOgHCYm",
  "RS27@email.com",
  "NJ",
  "Hoboken",
  [],
  [],
  []
);
let artist = await artistMethods.create(
  user._id,
  "Hi this is Chandler",
  "http://www.youtube.com"
);
let product = await productMethods.create(
  artist._id,
  "The Mona Lisa",
  "Famous Mona Lisa Painting",
  ["Fresh", "Classic"],
  100.0,
  "http://www.youtube.com",
  3.0,
  []
);
let post = await postsMethod.addPost(
  user._id,
  "Amazing",
  "This thing is AMAZING",
  "http://www.youtube.com"
);
let purchase = await purchaseMethods.create(
  user._id,
  product._id,
  1,
  100.0,
  true,
  validate.getTodayDate()
);

await closeConnection();
