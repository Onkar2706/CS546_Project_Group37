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

// Creating Users
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
  []
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
  []
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
  []
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
  []
);
let user5 = await userMethods.create(
  "Ted",
  "Mosely",
  "Bstin",
  "$2a$10$Eu8aabfdUE60./Ta7JDTxeLPUhL9Vv.GW8dAikCEOLTW2MHsw4Gea",
  "bstin@friends.com",
  "NJ",
  "Hoboken",
  [],
  [],
  []
);
let user6 = await userMethods.create(
  "HIMYM",
  "We Copied FRIENDS",
  "Bstin",
  "$2a$10$Eu8aabfdUE60./Ta7JDTxeLPUhL9Vv.GW8dAikCEOLTW2MHsw4Gea",
  "bstin@friends.com",
  "NJ",
  "Hoboken",
  [],
  [],
  []
);

// Saving Created Artists
let artist1 = await artistMethods.create(
  user1._id,
  "Hi this is Rachel",
  "https://www.instyle.com/thmb/kUBbYGxX9MRxi8yan8S4lFZA-30=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/100421-rachel-green-outfis-08-dd43a04a48b3493b90a5b508e9d8bd5a.jpg"
);
let artist2 = await artistMethods.create(
  user2._id,
  "Hi this is Chandler",
  "https://pyxis.nymag.com/v1/imgs/079/792/3ed0d94be0a9bd3d023f00532889bab152-30-chandler-bing.2x.h473.w710.jpg"
);
let artist3 = await artistMethods.create(
  user3._id,
  "Hi this is Joey",
  "https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters/large/2800/Joey-Tribbiani.Friends.webp"
);
let artist4 = await artistMethods.create(
  user4._id,
  `"Legen—wait for it—dary! Gather 'round, my fine comrades of the night, for tonight, we embark on an adventure so epic, even Zeus would give it a thumbs-up. Picture this: a night filled with more twists and turns than a rollercoaster designed by Salvador Dalí, more laughter than a stand-up comedy show featuring a herd of laughing hyenas, and more legendary moments than... well, than anything else legendary! So, suit up, my friends, because tonight, we're not just making memories, we're crafting legends!"`,
  "https://scontent-lga3-2.xx.fbcdn.net/v/t39.30808-6/310613953_664827498341332_8131777393604310854_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_ohc=mqfHmrFEJFQQ7kNvgE4shma&_nc_ht=scontent-lga3-2.xx&oh=00_AfCvvVT8PxnG4Qdy4QvT6jJ6FX8EUnJLzb3ehH9Ax-4k8A&oe=663B7FF5"
);
let artist5 = await artistMethods.create(
  user5._id,
  "Hi this is Ted",
  "https://home.adelphi.edu/~br21822/Ted.jpg"
);
let artist6 = await artistMethods.create(
  user6._id,
  "Hi this is HIMYM",
  "https://www.rollingstone.com/wp-content/uploads/2018/06/rs-28075-20140326-himym-x1800-1395857056.jpg?w=595&h=395&crop=1"
);

let product1 = await productMethods.create(
  artist1._id,
  "Starry Night",
  "Iconic Starry Night Painting",
  ["Fresh", "Classic"],
  100.0,
  ["https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/525px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg"],
  3.0,
  []
);

let product2 = await productMethods.create(
  artist2._id,
  "The Persistence of Memory",
  "Surreal Melting Clocks",
  ["Modern", "Surreal"],
  120.0,
  ["https://cdn.britannica.com/10/182610-050-77811599/The-Persistence-of-Memory-canvas-collection-Salvador-1931.jpg?w=300"],
  4.5,
  []
);

let product3 = await productMethods.create(
  artist3._id,
  "The Scream",
  "Symbolic Expressionist Painting",
  ["Expressionist", "Symbolism"],
  80.0,
  ["https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/330px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg"],
  4.2,
  []
);

let product4 = await productMethods.create(
  artist4._id,
  "Guernica",
  "Powerful Anti-War Statement",
  ["Cubism", "Political"],
  150.0,
  ["https://imageio.forbes.com/specials-images/imageserve/61fdbb650178939252cba91b/Picasso-s-masterpiece--regarded-by-many-critics-as-the-most-powerful-anti-war/960x0.jpg?format=jpg&width=1440"],
  4.9,
  []
);

let product5 = await productMethods.create(
  artist5._id,
  "Girl with a Pearl Earring",
  "Enigmatic Portrait",
  ["Baroque", "Portrait"],
  90.0,
  ["https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/405px-1665_Girl_with_a_Pearl_Earring.jpg"],
  4.6,
  []
);

let product6 = await productMethods.create(
  artist6._id,
  "The Starry Night",
  "Whimsical Night Sky",
  ["Post-Impressionist", "Landscape"],
  110.0,
  ["https://img.stablecog.com/insecure/1024w/aHR0cHM6Ly9iLnN0YWJsZWNvZy5jb20vYjM0YzA5YjYtNGU3Zi00ZmVmLThiM2UtN2E2NjgyNGNjOGQwLmpwZWc.webp"],
  4.8,
  []
);

let product7 = await productMethods.create(
  artist4._id,
  "The Birth of Venus",
  "Classical Mythological Allegory",
  ["Renaissance", "Allegorical"],
  130.0,
  ["https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/600px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg"],
  4.7,
  []
);

let product8 = await productMethods.create(
  artist5._id,
  "Water Lilies",
  "Impressionist Water Garden",
  ["Impressionist", "Landscape"],
  95.0,
  ["https://www.phaidon.com/resource/monetgardenlead.jpg"],
  4.4,
  []
);
let product9 = await productMethods.create(
  artist4._id,
  "The Bro Code",
  "The Bro Code is a set of rules, seemingly started by Barney. A published version of the book,\
   first shown in The Goat is now available in paperback and audiobook. The version was written by Barney Stinson with Matt Kuhn.",
  ["Bro", "Code", "Barney", "HIMYM"],
  225.0,
  ["https://static.wikia.nocookie.net/himym/images/1/19/Brocode_cover.jpg", "https://static.wikia.nocookie.net/himym/images/2/2c/Barney.jpg", "https://medias.spotern.com/spots/w640/10/10567-1532336916.webp"],
  4.4,
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
  product2._id,
  1,
  100.0,
  true,
  validate.getTodayDate()
);

await closeConnection();
