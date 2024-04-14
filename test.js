import bcrypt from "bcryptjs";
import validate from "./helpers.js";
import user from "./data/users.js";

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


// try {

//     console.log(await user.getAll())
    
// } catch (error) {
//     console.log(error)
    
// }




