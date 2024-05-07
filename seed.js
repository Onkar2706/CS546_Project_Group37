import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import validate from "./helpers.js";
import bcrypt from "bcryptjs";
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
  "Vincent",
  "Van Gogh",
  "vangogh",
  await bcrypt.hash("password@123", 10),
  "vincent.vangogh@example.com",
  37,
  "Netherlands",
  "Nuenen",
  [],
  [],
  []
);
let testUser = await userMethods.create(
  "Pablo",
  "Picasso",
  "ppicasso",
  await bcrypt.hash("password@123", 10),
  "pablo.picasso@example.com",
  91,
  "Spain",
  "Malaga",
  [],
  []
);
let user2 = await userMethods.create(
  "Leonardo",
  "da Vinci",
  "ldavinci",
  await bcrypt.hash("password@123", 10),
  "leonardo.davinci@example.com",
  67,
  "Italy",
  "Vinci",
  [],
  []
);
let user3 = await userMethods.create(
  "Frida",
  "Kahlo",
  "fkahlo",
  await bcrypt.hash("password@123", 10),
  "frida.kahlo@example.com",
  47,
  "Mexico",
  "Coyoacán",
  [],
  []
);
let user4 = await userMethods.create(
  "Claude",
  "Monet",
  "cmonet",
  await bcrypt.hash("password@123", 10),
  "claude.monet@example.com",
  86,
  "France",
  "Paris",
  [],
  []
);
let user5 = await userMethods.create(
  "Georgia",
  "O'Keeffe",
  "gokeeffe",
  await bcrypt.hash("password@123", 10),
  "georgia.okeeffe@example.com",
  98,
  "USA",
  "Sun Prairie",
  [],
  []
);
let user6 = await userMethods.create(
  "Salvador",
  "Dali",
  "sdali",
  await bcrypt.hash("password@123", 10),
  "salvador.dali@example.com",
  84,
  "Spain",
  "Figueres",
  [],
  []
);

// Saving Created Artists
let testArtist = await artistMethods.create(
  testUser._id,
  "Pablo Picasso",
  "https://media-assets.ad-italia.it/photos/6356653b65f61824e7746482/16:9/w_1920,c_limit/GettyImages-1152457573.jpg"
);
let artist1 = await artistMethods.create(
  user1._id,
  "Vincent van Gogh",
  "https://cdn.britannica.com/36/69636-050-81A93193/Self-Portrait-artist-panel-board-Vincent-van-Gogh-1887.jpg?w=400&h=300&c=crop"
);
let artist2 = await artistMethods.create(
  user2._id,
  "Leonardo da Vinci",
  "https://hips.hearstapps.com/hmg-prod/images/portrait-of-leonardo-da-vinci-1452-1519-getty.jpg?crop=1xw:1.0xh;center,top&resize=640:*"
);
let artist3 = await artistMethods.create(
  user3._id,
  "Frida Kahlo",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg/330px-Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg"
);
let artist4 = await artistMethods.create(
  user4._id,
  "Claude Monet",
  "https://cdn.britannica.com/57/250457-050-342611AD/Claude-Monet-French-Impressionist-painter.jpg?w=400&h=300&c=crop"
);
let artist5 = await artistMethods.create(
  user5._id,
  "Georgia O'Keeffe",
  "https://www.okeeffemuseum.org/wp-content/uploads/2022/04/2003-1-1-600x753-1-239x300.jpg"
);
let artist6 = await artistMethods.create(
  user6._id,
  "Salvador Dalí",
  "https://cdn.britannica.com/40/79340-050-7C62816E/Salvador-Dali.jpg?w=400&h=300&c=crop"
);

let product1 = await productMethods.create(
  artist1._id,
  "Starry Night",
  "Iconic Starry Night Painting",
  ["Fresh", "Classic"],
  1000000.0,
  ["https://www.vangoghgallery.com/img/starry_night_full.jpg"],
  []
);

let product2 = await productMethods.create(
  artist2._id,
  "Mona Lisa",
  "Iconic Mona Lisa Portrait",
  ["Classic", "Portrait"],
  1200000.0,
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/330px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
  ],
  []
);

let product3 = await productMethods.create(
  artist3._id,
  "Self Portrait with Thorn Necklace and Hummingbird",
  "Self Portrait with Thorn Necklace and Hummingbird is a 1940 painting by Frida Kahlo. Kahlo painted it after her divorce from Diego Rivera and when she was in the United States. It is notable for its surrealistic elements, and was painted shortly after her father bought her oil paints while she was recovering from a surgery.",
  ["Surrealism", "Self Portrait"],
  800000.0,
  [
    "https://upload.wikimedia.org/wikipedia/en/1/1e/Frida_Kahlo_%28self_portrait%29.jpg",
  ],
  []
);

let product4 = await productMethods.create(
  artist4._id,
  "Water Lilies",
  "Water Lilies is a series of approximately 250 oil paintings by French Impressionist Claude Monet. The paintings depict his flower garden at his home in Giverny, and were the main focus of his artistic production during the last thirty years of his life. Many of the works were painted while Monet suffered from cataracts.",
  ["Impressionism", "Landscape"],
  1500000.0,
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Claude_Monet_-_The_Water_Lilies_-_Setting_Sun_-_Google_Art_Project.jpg/600px-Claude_Monet_-_The_Water_Lilies_-_Setting_Sun_-_Google_Art_Project.jpg",
  ],
  []
);

let product5 = await productMethods.create(
  artist5._id,
  "Red Canna",
  "Red Canna is a series of approximately 250 oil paintings by Georgia O'Keeffe. The paintings depict her flower garden at her home in New Mexico. O'Keeffe painted this series during the last thirty years of her life. Many of the works were painted while she was experimenting with new techniques.",
  ["Modernism", "Floral"],
  900000.0,
  [
    "https://upload.wikimedia.org/wikipedia/en/c/ca/Red_Canna_%281924%29_by_Georgia_O%27Keeffe.jpg",
  ],
  []
);

let product6 = await productMethods.create(
  artist6._id,
  "The Persistence of Memory",
  "The Persistence of Memory is a 1931 painting by artist Salvador Dalí. It depicts a surreal landscape with melting clocks draped over various objects. The painting is widely considered one of Dalí's most recognizable works and an iconic example of surrealist art.",
  ["Surrealism", "Time"],
  1100000.0,
  [
    "https://cdn.britannica.com/10/182610-050-77811599/The-Persistence-of-Memory-canvas-collection-Salvador-1931.jpg?w=300",
  ],
  []
);

let product7 = await productMethods.create(
  artist4._id,
  "Impression, Sunrise",
  "Impression, Sunrise is a painting by Claude Monet. Shown at what would later be known as the 'Exhibition of the Impressionists' in April 1874, the painting is attributed to giving rise to the name of the Impressionist movement.",
  ["Impressionism", "Landscape"],
  1300000.0,
  [
    "https://images.squarespace-cdn.com/content/v1/58968d24ebbd1a423088c522/1669923148238-9AH5WP71KTOW2EN1NNFY/Screenshot+2022-11-29+at+15.26.53.png?format=1000w",
  ],
  []
);

let product8 = await productMethods.create(
  artist5._id,
  "Jimson Weed/White Flower No. 1",
  "Jimson Weed/White Flower No. 1 is a painting by Georgia O'Keeffe. Completed in 1932, it depicts a close-up view of a jimson weed blossom. The painting is considered one of O'Keeffe's most famous works and is often cited as an iconic example of American modernism.",
  ["Modernism", "Floral"],
  950000.0,
  ["https://www.georgiaokeeffe.net/assets/img/paintings/jimson-weed.jpg"],
  []
);

let product9 = await productMethods.create(
  artist4._id,
  "The Artist's Garden at Giverny",
  "The Artist's Garden at Giverny is a series of paintings by Claude Monet. Completed between 1900 and 1926, the series depicts the flower garden at his home in Giverny, France. The paintings are considered some of Monet's most famous works and exemplify his mastery of color and light.",
  ["Impressionism", "Landscape"],
  2250000.0,
  [
    "https://upload.wikimedia.org/wikipedia/commons/b/bc/Claude_Monet_The_Artist%27s_Garden_at_Giverny.jpg",
  ],
  []
);

let post1 = await postsMethod.addPost(
  user2._id,
  "ldavinci",
  "Masterpiece",
  "I just finished another masterpiece!",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Leonardo_da_vinci_-_La_scapigliata.jpg/405px-Leonardo_da_vinci_-_La_scapigliata.jpg"
);
let post2 = await postsMethod.addPost(
  user3._id,
  "fkahlo",
  "Inspirations",
  "Feeling inspired today!",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/330px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg"
);
let post3 = await postsMethod.addPost(
  user1._id,
  "vangogh",
  "New painting",
  "Excited to share my new painting!",
  "https://cdn.britannica.com/78/43678-050-F4DC8D93/Starry-Night-canvas-Vincent-van-Gogh-New-1889.jpg?w=300"
);
let post4 = await postsMethod.addPost(
  user1._id,
  "vangogh",
  "Art Exhibition",
  "Join us for our latest art exhibition!",
  "https://www.artnews.com/wp-content/uploads/2024/04/1024px-Vincent-van-gogh-cafe-terrace-on-the-place-du-forum-arles-at-night-the.jpg?resize=400,512"
);

let purchase = await purchaseMethods.create(
  user2._id,
  product2._id,
  1,
  1000000.0,
  true,
  validate.getTodayDate()
);

await closeConnection();
