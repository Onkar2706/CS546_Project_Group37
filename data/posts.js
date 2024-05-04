import { posts } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validate from "../helpers.js";
import pkg from "validator";

const exportMethods = {
  async getAllPosts() {
    const postCollection = await posts();
    return await postCollection.find({}).toArray();
  },

  async addPost(userId, userName, title, body, image) {
    
    userId = userId.trim();

    let newPost = {
      userId: userId,
      userName: userName.trim(),
      title: title.trim(),
      body: body.trim(),
      image: image.trim(),
      comment: [],
      time: validate.getTodayDate(),
    };
    const postCollection = await posts();
    const newInsertInformation = await postCollection.insertOne(newPost);
    if (!newInsertInformation.insertedId) throw "Error: Insert failed!";

    return this.getPostById(newInsertInformation.insertedId.toString());
  },

  async getPostById(id) {
    // Validations
    validate.checkIfProperInput(id)
    validate.checkIfString(id)
    validate.checkIfValidObjectId(id)

    // id = validation.checkId(id);
    const postCollection = await posts();
    const post = await postCollection.findOne({ _id: new ObjectId(id) });

    if (!post) throw "Error: Post not found";
    return post;
  },

  async deletePost(id) {
    validate.checkIfValidObjectId(id);
    id = id.trim();
    const postCollection = await posts();
    const removedPost = await postCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });
    if (!removedPost) {
      throw `Error: Post could not be removed`;
    }
    return { _id: id, deleted: true };
  },
};

export default exportMethods;
