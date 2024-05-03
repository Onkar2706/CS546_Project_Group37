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

let user1 = await userMethods.create(
    "Rachel",
    "Green",
    "rgreen",
    "$2a$10$SaOuj75IYJPec.A66mTBb.MEOsl61aPsU8wQyqMGx6Pny6xXGZXaG",
    "rgreen@friends.com",
    "NJ",
    "Hoboken",
    [],
    [],
    [],
);
let user2 = await userMethods.create(
    "Chandler",
    "Bing",
    "cbing",
    "$2a$10$RW68vmo3QYlsa/LqNyEfI.v.GkMw1x/8olOE6K/U39QoRhVo2V86u",
    "cbing@friends.com",
    "NJ",
    "Hoboken",
    [],
    [],
    [],
);
let user3 = await userMethods.create(
    "Joey",
    "Tribianni",
    "jtrib",
    "$2a$10$/fB3h7VjE5JLb0OQ/4Pt3.59DnDiPEvf.UXg5Ox8pjWRmW8tX/tq2",
    "jtrib@friends.com",
    "NJ",
    "Hoboken",
    [],
    [],
    [],
);
let user4 = await userMethods.create(
    "Barney",
    "Stinson",
    "Bstin",
    "$2a$10$Eu8aabfdUE60./Ta7JDTxeLPUhL9Vv.GW8dAikCEOLTW2MHsw4Gea",
    "bstin@friends.com",
    "NJ",
    "Hoboken",
    [],
    [],
    [],
);

let artist = await artistMethods.create(
  user2._id,
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
  user2._id,
  "Amazing",
  "This thing is AMAZING",
  "http://www.youtube.com"
);
let purchase = await purchaseMethods.create(
  user2._id,
  product._id,
  1,
  100.0,
  true,
  validate.getTodayDate()
);

await closeConnection();
