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
    validate.checkIfValidObjectId(user_id);
    validate.checkIfString(bio);
    // validate.checkIfValidURL(profilePic);
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
    validate.checkIfValidObjectId(id);
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
    validate.checkIfValidObjectId(userid);
    const artistCollection = await artists();
    const findArtist = await artistCollection.findOne({ user_id: userid });
    if (!findArtist) {
      throw `couldn't find artist with given id`;
    }
    findArtist._id = findArtist._id.toString();
    return findArtist._id;
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
  async updateArtist(artist_id, user_id, bio, profilePic, portfolio) {
    if (
      !artist_id ||
      !user_id ||
      !bio ||
      !profilePic ||
      !portfolio
      // !ratings
    ) {
      throw `please provide proper input`;
    }
    if (
      !validate.checkIfValidObjectId(artist_id) ||
      !validate.checkIfValidObjectId(user_id)
    ) {
      throw `provided id(s) is not a valid id`;
    }
    if (
      !validate.checkIfString(bio) ||
      !validate.checkIfValidArray(portfolio) ||
      !validate.checkIfValidURL(profilePic)
    ) {
      throw `please provide valid input`;
    }
    let artistCollection = await artists();
    // let artworkCollection = await artwork();
    // let artworkList = await artworkCollection.find({}).toArray();
    // let rating = validate.calculateAverageRating(
    //   artworkList.filter((element) => element.artistId == artist_id)
    // );
    let artworkList = [];
    portfolio.forEach(async (element) => {
      let artwork = await productMethods.get(element);
      artworkList.push(artwork);
    });
    let rating = validate.calculateAverageRating(artworkList);
    let updatedArtist = artistCollection.findOneAndUpdate(
      { _id: new ObjectId(artist_id) },
      {
        $set: {
          user_id: user_id.trim(),
          bio: bio.trim(),
          profilePic: profilePic.trim(),
          portfolio: portfolio.map((element) => {
            element.trim();
          }),
          ratings: rating,
        },
      },
      { returnDocument: "after" }
    );
    if (!updatedArtist) {
      throw `could not update artist`;
    }
    return updatedArtist;
  },

  async addArtist(firstName, lastName, userName, profilePic) {},
};
export default exportedMethods;
