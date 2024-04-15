//data functions for artists collection
import {artists} from "../config/mongoCollections.js";
import {ObjectId} from "mongodb";
import validate from "../helpers.js";
import users from "./users.js";
const exportedMethods = {
    async create(
        //creates a new artist in database and returns it
        user_id,
        bio,
        profilePic,
        portfolio,
        ratings
    ){
        validate.checkIfValidObjectId(user_id);
        validate.checkIfString(bio);
        validate.checkIfValidURL(profilePic);
        validate.checkIfValidArray(portfolio);
        for (let element of portfolio) {
            validate.checkIfValidObjectId(element);
        }
        validate.checkIfValidRating(ratings);
        let newArtist = {
            user_id: user_id.trim(),
            bio: bio.trim(),
            profilePic: profilePic.trim(),
            portfolio: portfolio.map((item) => item.trim()),
            ratings: ratings
        };
        let artistCollection = await artists();
        const insertInfo = await artistCollection.insertOne(newArtist);
        if (!insertInfo) {
            throw `Artist could not be created`;
        }
        const newId = insertInfo.insertedId.toString();
        const artist = await this.get(newId);
        return artist;
    }, 
    async get(id) {
        //retrieves an artist if the artist exists in the database
        validate.checkIfValidObjectId(id);
        const artistCollection = await artists();
        const artist = await artistCollection.findOne(
            {_id: new ObjectId(id)}
        );
        if (!artist) {
            throw `couldn't find artist with given id`;
        }
        artist._id = artist._id.toString();
        return artist;
    }
};
export default exportedMethods;