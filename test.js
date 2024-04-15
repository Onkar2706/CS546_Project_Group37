import bcrypt from "bcryptjs";
import validate from "./helpers.js";
import user from "./data/users.js";
import artist from "./data/artists.js";

try {
  console.log(
    await user.create(
      "Chandler",
      "Bing",
      "Monica27",
      "MyDummyPassword",
      "RS27@email.com",
      "NJ",
      "Hoboken",
      ["Book", "Arts", "Cars"],
      ["Purchase1", "Purchase2", "Purchase3", "Purchase4"],
      ["Post1", "Post2", "Post3"],
      "abc1266665b"
    )
  );    
} 
catch (error) {
    console.log(error)
}

try {
  let testUser = await user.create(
      "Chandler",
      "Bing",
      "Monica27",
      "MyDummyPassword",
      "RS27@email.com",
      "NJ",
      "Hoboken",
      ["Book", "Arts", "Cars"],
      ["Purchase1", "Purchase2", "Purchase3", "Purchase4"],
      ["Post1", "Post2", "Post3"],
      "abc1266665b"
    )
  console.log(testUser._id);
  console.log(
    await artist.create(testUser._id, "hi this is a test", "http://www.youtube.com", ["661c8ad8029f017b7b271d1b"], 1.0)
  );
} catch (e) {
  console.log(e);
}

// try {

//     console.log(await user.getAll())
    
// } catch (error) {
//     console.log(error)
    
// }




