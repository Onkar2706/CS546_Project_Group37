//data functions for artists collection
import { artists, users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import productMethods from "./artwork.js";
import userMethods from "./users.js";
import validate from "../helpers.js";
// import users from "./users.js";
const exportedMethods = {
  async create(
    //creates a new artist in database and returns it
    user_id,
    bio,
    profilePic
  ) {
    // validate.checkIfProperInput(user_id)
    // validate.checkIfProperInput(bio)
    // validate.checkIfProperInput(profilePic)

    // validate.checkIfString(user_id)
    // validate.checkIfString(bio)
    // validate.checkIfString(profilePic)

    // validate.checkIfValidObjectId(user_id);
    user_id = user_id.trim();
    if (!userMethods.get(user_id)) {
      throw `Error: Given user id does not exist`;
    }
    const artistName = await userMethods.get(user_id);
    let newArtist = {
      user_id: user_id.trim(),
      firstName: artistName.firstName,
      lastName: artistName.lastName,
      bio: bio.trim(),
      profilePic: profilePic.trim(),
      portfolio: [],
      ratings: 0,
    };
    let artistCollection = await artists();
    const insertInfo = await artistCollection.insertOne(newArtist);
    if (!insertInfo) {
      throw `Artist could not be created`;
    }
    insertInfo.insertedId = insertInfo.insertedId.toString();
    const usercollection = await users();
    const updateRole = await usercollection.updateOne(
      { _id: new ObjectId(user_id.trim()), role: "user" },
      { $set: { role: "artist" } }
    );
    return await this.get(insertInfo.insertedId);
  },

  async get(id) {
    //retrieves an artist if the artist exists in the database
    // validate.checkIfProperInput(id)
    // validate.checkIfString(id)
    // validate.checkIfValidObjectId(id);
    const artistCollection = await artists();
    const artist = await artistCollection.findOne({ _id: new ObjectId(id) });
    if (!artist) {
      throw `couldn't find artist with given id`;
    }
    artist._id = artist._id.toString();
    return artist;
  },

  async getArtistProfile(userid) {
    //retrieves an artist if the artist exists in the database
    // validate.checkIfProperInput(userid)
    // validate.checkIfValidObjectId(userid);
    const artistCollection = await artists();
    const findArtist = await artistCollection.findOne({ user_id: userid });
    if (!findArtist) {
      throw `couldn't find artist with given id`;
    }
    findArtist._id = findArtist._id.toString();
    return findArtist;
  },
  async getAll() {
    //retrieves all artists in the artists collection
    let artistCollection = await artists();
    let artistList = await artistCollection.find({}).toArray();
    if (!artistList) {
      throw `couldn't get artists`;
    }
    artistList.map((element) => {
      return {
        _id: element._id.toString(),
        user_id: element.user_id.toString(),
      };
    });
    return artistList;
  },
  async updateProductInArtist( artistId, portfolio) {
    const filter = {_id: new ObjectId(artistId)};
    const updateProduct = {
      $push:{portfolio}
    };

    const artistCollection = await artists();
    const addprod = await artistCollection.updateOne(filter, updateProduct);
    return addprod
  },

};
export default exportedMethods;
