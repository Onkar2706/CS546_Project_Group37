import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validate from "../helpers.js";
import bcrypt from "bcryptjs";
import pkg from "validator";


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
    posts
  ) {
    try {
      validate.checkIfProperInput(firstName);
      validate.checkIfProperInput(lastName);
      validate.checkIfProperInput(userName);
      validate.checkIfProperInput(password);
      validate.checkIfProperInput(email);
      validate.checkIfProperInput(state);
      validate.checkIfProperInput(city);
    } catch (e) {
      throw e;
    }

    if (await this.getByUsername(userName.trim()) != null) {
      throw `a user with this username already exists!`;
    }
    let newUser = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      userName: userName.trim().toLowerCase(),
      password: password.trim(),
      email: email.trim(),
      state: state.trim(),
      city: city,
      cart: Array.isArray(cart) ? cart.map((item) => item.trim()) : [],
      purchases: Array.isArray(purchases)
        ? purchases.map((item) => item.trim())
        : [],
      posts: Array.isArray(posts) ? posts.map((item) => item.trim()) : [],
      // artist_Id: artist_Id,
      role: "user",
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
  async getByUsername(username) {
    const userCollection = await users();
    validate.checkIfString(username);
    username = username.trim();
    const user = await userCollection.findOne({ username: username });
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

  async updateArtistId(userId, artistId) {
    if (!artistId || !userId) throw "Error: Must provide Id";

    if (!pkg.isMongoId(artistId)) throw "Error: Validation failed";

    const usercollection = await users();
    const updateduser = await usercollection.updateOne(
      { _id: userId },
      { $set: { artistId: artistId } },
      { returnDocument: "after" }
    );
    return updateduser;
  },

  async loginUser(userName, password) {
    userName = userName.trim().toLowerCase();
    password = password.trim();

    if (!userName || userName === "String")
      throw "Either the username or password is invalid";
    if (!password || password === "String")
      throw "Either the username or password is invalid ";

    const usercollection = await users();
    const usernameDB = await usercollection.findOne({ userName: userName });
    if (!usernameDB) throw "Error";

    if (!(usernameDB.userName == userName))
      throw "Either the username or password is invalid";

    const validatedPassword = await bcrypt.compare(
      password,
      usernameDB.password
    );

    if (validatedPassword !== true)
      throw "Either the username or password is invalid";
  },
};

export default exportMethods;
