import bcrypt from "bcryptjs";
import validate from "./helpers.js";
import userFunc from "./data/users.js";
import artist from "./data/artists.js";
import productMethods from "./data/artwork.js";
import posts from "./data/posts.js";
import artwork from "./data/artwork.js"
import { artistMethods, postsMethod } from "./data/index.js";

let oId = null;

// try {
  

//   let usercreated = await userFunc.create(
//     "Chandler1",
//     "Bing",
//     "Monica27",
//     "MyDummyPassword",
//     "RS27@email.com",
//     "NJ",
//     "Hoboken",
//     ["Book", "Arts", "Cars"],
//     ["Purchase1", "Purchase2", "Purchase3", "Purchase4"],
//     ["Post1", "Post2", "Post3"],
//     "abc1266665b"
//   );
//   oId= usercreated.userName

//   console.log(usercreated);

//   oId = usercreated.userName;
//   console.log(oId);
// } catch (error) {
//   console.log(error);
// }



// try {
//   let user = await userFunc.getByUsername(oId)
//   console.log(user)
  
// } catch (error) {
//   console.log(error)
  
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
// console.log(check)``

// import { artistMethods } from "./data/index.js";

// console.log(await artistMethods.create(
//   "662c366183742d374a2bfcb3",
//   "Once I ruled the world",
//   "https://images.pexels.com/photos/15867003/pexels-photo-15867003/free-photo-of-garlands-on-shivaji-maharaj-statue.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
// ))

// console.log(await posts.addPost("662ea79738fbd9121cf480d8", "Pizzaa", "This is new post", "https://images.pexels.com/photos/365459/pexels-photo-365459.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"))

// try {
//   let user = await artwork.create("662c3b62d7035e182a7e0e35","New Product","I am a Prouct with it Description",["tag1","tag2","tag3","tag4"],203,["image1","image2","image3","image4"],3,["review1","review2"])
//   console.log(user)
  
// } catch (error) {
//   console.log(error)
  
// }



try {

  // const artist = await artistMethods.getArtistProfile("663662e8ec1edaa24b1aa2dc")
  // console.log(artist)

  const test = await artwork.removeProductfromDB('66387d11b764022205cc5ff1')
  console.log("Done");
  
} catch (error) {
  console.log(error)
  
}



