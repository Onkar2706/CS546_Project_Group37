//data functions for artists collection
import { artists, users, artworks } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import productMethods from "./artwork.js";
import userMethods from "./users.js";
import validate from "../helpers.js";
const exportedMethods = {
  async create(
    //creates a new artist in database and returns it
    user_id,
    bio,
    profilePic
  ) {
    validate.checkIfProperInput(user_id)
    validate.checkIfProperInput(bio)

    validate.checkIfString(user_id)
    validate.checkIfString(bio)

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
      ratings: [],
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

  async getByName(firstName, lastName) {
    if (!firstName && !lastName) {
      throw `You must provide a first name and/or last name`;
    }
    if (
      typeof firstName != "string" ||
      typeof lastName != "string" ||
      firstName.trim() === "" ||
      lastName.trim() === ""
    ) {
      throw `first name and last name cannot be empty`;
    }
    let artistCollection = await artists();
    const artistList = await artistCollection
      .find({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      })
      .toArray();
    if (!artistList) {
      throw `couldn't find an artist with that name!`;
    }
    return artistList;
  },
  async removeFromCollection(artworkId) {
    if (!artworkId || typeof artworkId !== "string") {
      throw new Error("Invalid artwork ID");
    }

    const objectId = new ObjectId(artworkId);

    const artworkCollection = await artworks();
    const updateResult = await artworkCollection.updateMany(
      { collection: objectId },
      { $pull: { collection: objectId } }
    );

    if (updateResult.modifiedCount === 0) {
      throw new Error("No documents were updated");
    }

    return true;
  },

  async get(id) {
    //retrieves an artist if the artist exists in the database
    validate.checkIfProperInput(id)
    validate.checkIfString(id)
    const artistCollection = await artists();
    const artist = await artistCollection.findOne({ _id: new ObjectId(id) });
    if (!artist) {
      throw `couldn't find artist with given id`;
    }
    artist._id = artist._id.toString();
    return artist;
  },

  async removeArtist(artistid){
    validate.checkIfProperInput(artistid);

    const artistCollection = await artists();
    const removeUser = await artistCollection.deleteOne({
        _id: new ObjectId(artistid)
    });
    return removeUser;
  },

  async getArtistProfile(userid) {
    validate.checkIfProperInput(userid)
    validate.checkIfString(userid)
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
  async updateProductInArtist(artistId, portfolio) {
    const filter = { _id: new ObjectId(artistId) };
    const updateProduct = {
      $push: { portfolio },
    };

    const artistCollection = await artists();
    const addprod = await artistCollection.updateOne(filter, updateProduct);
    return addprod;
  },

  async addRating(productId, username, rating, comment) {
    validate.checkIfProperInput(productId);
    validate.checkIfProperInput(username);
    validate.checkIfProperInput(rating);
    validate.checkIfProperInput(comment);

    const filter = { _id: new ObjectId(productId) };
    const updateArr = {
      $push: {
        reviews: { userName: username, ratings: rating, comment: comment },
      },
    };
    const productCollection = await artworks();
    const addRev = await productCollection.updateOne(filter, updateArr);
    if (!(addRev.matchedCount && addRev.modifiedCount)) {
      throw "Error: Could't add comment";
    }
  },

  async addArtistRating(artistId, rating, username) {
    validate.checkIfProperInput(artistId);
    validate.checkIfProperInput(username);
    validate.checkIfProperInput(rating);

    const filter = { _id: new ObjectId(artistId) };
    const updateArr = {
      $push: { ratings: { userName: username, ratings: rating } },
    };
    const artistCollection = await artists();
    const addRate = await artistCollection.updateOne(filter, updateArr);
    if (!(addRate.matchedCount && addRate.modifiedCount)) {
      throw "Error: Could't add rating";
    }
  },
};
export default exportedMethods;
