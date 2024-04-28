// import bcrypt from "bcryptjs";
// import validate from "./helpers.js";
// import user from "./data/users.js";
// import artist from "./data/artists.js";
// import productMethods from "./data/artwork.js";
// import posts from "./data/posts.js";

// let oId = null;

// try {
  

  // let usercreated = await user.create(
  //   "Chandler1",
  //   "Bing",
  //   "Monica27",
  //   "MyDummyPassword",
  //   "RS27@email.com",
  //   "NJ",
  //   "Hoboken",
  //   ["Book", "Arts", "Cars"],
  //   ["Purchase1", "Purchase2", "Purchase3", "Purchase4"],
  //   ["Post1", "Post2", "Post3"],
  //   "abc1266665b"
  // );
  // oId= usercreated._id

  // console.log(usercreated);

//   oId = usercreated._id;
//   console.log(oId);
// } catch (error) {
//   console.log(error);
// }

// try {
//   console.log(
//     await user.updateUserInfo(
//       oId,
//       "Chandler2",
//       "Geller",
//       "Monica27",
//       "MyDummyPassword",
//       "RS27@email.com",
//       "NJ",
//       "Hoboken",
//       ["Book", "Arts", "Cars"],
//       ["Purchase1", "Purchase2", "Purchase3", "Purchase4"],
//       ["Post1", "Post2", "Post3"],
//       "abc1266665b"
//     )
//   );
// } catch (error) {
//   console.log(error);
// }

// try {
  // let testUser = await user.create(
  //   "Chandler",
  //   "Bing",
  //   "Monica27",
  //   "MyDummyPassword",
  //   "RS27@email.com",
  //   "NJ",
  //   "Hoboken",
  //   ["Book", "Arts", "Cars"],
  //   ["Purchase1", "Purchase2", "Purchase3", "Purchase4"],
  //   ["Post1", "Post2", "Post3"],
  //   "abc1266665b"
  // );
  // console.log(testUser._id);
  
//   console.log(
//     await artist.create(
//       "662c23dc683221a9f9d38bd4",
//       "Picaso",
//       "http://www.youtube.com",
//       "https://images.pexels.com/photos/1589282/pexels-photo-1589282.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//     )
//   );
//     // oId = createA._id;
// } catch (e) {
//   console.log(e);
// }

// try {

//     console.log(await user.getAll())

// } catch (error) {
//     console.log(error)

// }

// try{
//   console.log(await productMethods.create("661d85d6fc783a1f5ae0c933", "Necklace", "Chimni cha chan sa ghar", ["bird", "house", "little"], 20, ["https://www.ugaoo.com/cdn/shop/articles/shutterstock_573560338.jpg?v=1661880404"], ["I love it!"]));
// }
// catch(e){
//   console.log(e);
// }


// try{
//  console.log(await posts.addPost("122344hdgcbvjc","hello","heteebdbjcbjbcs","hhhsbvxjsvb"))
// }
// catch(e){
//   console.log(e);
// }

// const remUser = await artist.remove(oId)
// try{
//  console.log(await posts.addPost("122344hdgcbvjc","hello","heteebdbjcbjbcs","hhhsbvxjsvb"))
// }
// catch(e){
//   console.log(e);
// }
// const hashpw = await bcrypt.hash("abc12", 10)

// const check = await bcrypt.compare("abc12", hashpw )
// console.log(check)

import { artistMethods } from "./data/index.js";

// console.log(await artistMethods.create(
//   "662c366183742d374a2bfcb3",
//   "Once I ruled the world",
//   "https://images.pexels.com/photos/15867003/pexels-photo-15867003/free-photo-of-garlands-on-shivaji-maharaj-statue.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
// ))

