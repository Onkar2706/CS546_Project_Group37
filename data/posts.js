import { posts } from "../config/mongoCollections.js";
// import { users } from "./users.js";
import { ObjectId } from "mongodb";
import validate from "../helpers.js";
import bcrypt from "bcryptjs";
import pkg from "validator";

const exportMethods = {
  async getAllPosts() {
    const postCollection = await posts();
    return await postCollection.find({}).toArray();
  },

  async addPost(userId,title, image, body) {
    // title = pkg.isAlpha(title, "title");
    // body = pkg.isAlpha(body, "body");
    // posterId = pkg.i(posterId);
    userId = userId
    // content = content.,

    // const userThatPosted = await users.get(userId)

    let newPost = {
      userId:userId,
      title: title,
      body: body,
      image:image,
      comment: [],
      time: validate.getTodayDate()
    };
    const postCollection = await posts();
    const newInsertInformation = await postCollection.insertOne(newPost);
    if (!newInsertInformation.insertedId) throw "Error: Insert failed!";

    return this.getPostById(newInsertInformation.insertedId.toString());
  },

  async getPostById(id) {
    // id = validation.checkId(id);
    const postCollection = await posts();
    const post = await postCollection.findOne({_id: new ObjectId(id)});

    if (!post) throw 'Error: Post not found';
    return post;
  }
};

export default exportMethods;