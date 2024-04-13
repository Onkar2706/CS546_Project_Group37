import bcrypt from "bcryptjs";
import user from "./data/users.js";

const saltRounds = 10;
const pw = "MyDummyPassword";
let hash = null;

try{
  // Securing password
  hash = await bcrypt.hash(pw, saltRounds);
}
catch(e){
  console.log("unable to hash password")
}

try {
  console.log(
    await user.create(
      "Ross",
      "Geller",
      "Rossy",
      hash,
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


