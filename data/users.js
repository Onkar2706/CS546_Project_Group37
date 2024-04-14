import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validate from "../helpers.js";
import bcrypt from "bcryptjs";

const exportMethods = {
  async create(
    firstName,
    lastName,
    userName,
    password,
    email,
    state,
    city,
    cart,
    purchases,
    posts,
    artist_Id
  ) {
    password = await validate.generatePassword(password);

    let newUser = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      userName: userName.trim(),
      password: password.trim(),
      email: email.trim(),
      state: state.trim(),
      city: city,
      cart: Array.isArray(cart) ? cart.map((item) => item.trim()) : [],
      purchases: Array.isArray(purchases)
        ? purchases.map((item) => item.trim())
        : [],
      posts: Array.isArray(posts) ? posts.map((item) => item.trim()) : [],
      artist_Id: artist_Id,
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

  async getAll() {
    const usercollection = await users();
    let userList = await usercollection.find({}).toArray();
    if (!userList) throw "Could not get any user";
    userList = userList.map((element) => {
      element._id = element._id.toString();

      return {
        _id: element._id.toString(),
        userName: element.userName,
      };
    });

    return userList;
  },
};

export default exportMethods;
