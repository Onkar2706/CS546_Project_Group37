import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import {
  validateEmailAddress,
  validateString,
  validateState,
  validateArray,
  validateObjectId,
} from "../helpers.js";

const exportMethods = {
  async create(
    id,
    firstName,
    lastName,
    userName,
    email,
    State,
    City,
    cart,
    purchases,
    posts,
    Artist_Id
  ) {
    // if (
    // //   !validateString(firstName) ||
    // //   !validateString(lastName) ||
    // //   !validateString(lastName) ||
    // //   !validateString(userName) ||
    // //   !validateEmailAddress(email) ||
    // //   !validateState(State) ||
    // //   !validateCity(City) ||
    // //   !validateArray(cart) ||
    // //   !validateArray(purchases) ||
    // //   !validateArray(posts) 
    // //   !validateObjectId(Artist_Id)
    // )
    //   throw "error thrown1";

    let newUser = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      userName: userName.trim(),
      email: email.trim(),
      State: State.trim(),
      City: City,
      cart: Array.isArray(cart) ? cart.map((item) => item.trim()) : [],
      purchases: Array.isArray(purchases) ? purchases.map((item) => item.trim()) : [],
      posts: Array.isArray(posts) ? posts.map((item) => item.trim()) : [],
      Artist_Id: Artist_Id
    };

    const usercollection = await users();
    const insertInfo = await usercollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "user not added";
    const newId = insertInfo.insertedId.toString();

    const user = await this.get(newId);
    return user;
  },

  async get(id) {
    //let x = new ObjectId();
    if (!id) throw "You must provide an id to search for";
    if (typeof id !== "string") throw "Id must be a string";
    if (id.trim().length === 0)
      throw "Id cannot be an empty string or just spaces";
    id = id.trim();
    if (!ObjectId.isValid(id)) throw "invalid object ID";
    const usercollection = await users();
    const user = await usercollection.findOne({ _id: new ObjectId(id) });
    if (user === null) throw "No user with that id";
    user._id = user._id.toString();
    return user;
  },
};

export default exportMethods;




    // test=await create(
    //   "Ross",
    //   "Geller",
    //   "RS27",
    //   "RS27@email.com",
    //   "NJ",
    //   "Hoboken",
    //   ["Book", "Arts", "Cars"],
    //   ["Test1", "Test2", "Test3", "Test4"],
    //   ["Test5", "Test6", "Test7"],
    //   "abc1266665b"
    // )
    // console.log(test)
 