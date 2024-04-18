import artworks from "./artwork.js";
import users from "./users.js";
import validate from "../helpers.js";
import { artPurchases } from "../config/mongoCollections.js";

const exportedMethods = {
  async create(
    user_id,
    artwork_id,
    quantity,
    total_price,
    payment_status,
    timeStamp
  ) {
    validate.checkIfValidObjectId(user_id);
    validate.checkIfValidObjectId(artwork_id);
    if (!users.get(user_id)) {
      throw `Couldn't find user specified by user id`;
    }
    if (!artworks.get(artwork_id)) {
      throw `Couldn't find artwork specified by artwork id`;
    }
    validate.checkIfPositiveNumber(quantity);
    validate.checkIfPositiveNumber(total_price);
    validate.checkIfBoolean(payment_status);
    validate.checkIfValidDate(timeStamp);
    let purchase = {
      user_id: user_id.trim(),
      artwork_id: artwork_id.trim(),
      quantity: quantity,
      total_price: total_price,
      payment_status: payment_status,
      timeStamp: timeStamp,
    };
    let artPurchasesCollection = await artPurchases();
    let insertedInfo = await artPurchasesCollection.insertOne(purchase);
    if (!insertedInfo) {
      throw `purchase could not be inserted`;
    }
    let newPurchase = await this.get(insertedInfo.insertedId.toString());
    return newPurchase;
  },
  async get(id) {
    validate.checkIfValidObjectId(id);
    let artPurchasesCollection = await artPurchases();
    let purchase = await artPurchasesCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!purchase) {
      throw `could not find a purchase with given id`;
    }
    purchase._id = purchase._id.toString();
    return purchase;
  },
  async getAll() {
    const artPurchasesCollection = await artPurchases();
    let allPurchases = await artPurchasesCollection.find({}).toArray();
    if (!allPurchases) throw "Error: Could not get all products";
    allPurchases = allPurchases.map((element) => {
      element._id = element._id.toString();
      return {
        _id: element._id,
        user_id: element.user_id,
        artwork_id: element.artwork_id,
      };
    });
    return allPurchases;
  },
  async remove(id) {
    validate.checkIfValidObjectId(id);
    id = id.trim();
    const artPurchasesCollection = await artPurchases();
    const removePurchase = await artPurchasesCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });
    if (!removePurchase) {
      throw `purchase could not be removed`;
    }
    let user = await users.get(removePurchase.user_id);
    let updatedPurchases = user.purchases.filter((purchase) => purchase != id);
    await users.updateUserInfo(
      user._id,
      user.firstName,
      user.lastName,
      user.username,
      user.password,
      user.email,
      user.state,
      user.city,
      user.cart,
      updatedPurchases,
      user.posts,
      user.artist_Id
    );
    return { _id: id, deleted: true };
  },
  async update(
    id,
    user_id,
    artwork_id,
    quantity,
    total_price,
    payment_status,
    timeStamp
  ) {
    validate.checkIfValidObjectId(id);
    validate.checkIfValidObjectId(user_id);
    validate.checkIfValidObjectId(artwork_id);
    validate.checkIfPositiveNumber(quantity);
    validate.checkIfPositiveNumber(total_price);
    validate.checkIfBoolean(payment_status);
    validate.checkIfValidDate(timeStamp);
    id = id.trim();
    user_id = user_id.trim();
    artwork_id = artwork_id.trim();
    const artPurchasesCollection = await artPurchases();
    const updatedInfo = artPurchasesCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          user_id: user_id,
          artwork_id: artwork_id,
          quantity: quantity,
          total_price: total_price,
          payment_status: payment_status,
          timeStamp: timeStamp,
        },
      },
      { returnDocument: "after" }
    );
    if (!updatedInfo) {
      throw `could not update purchase`;
    }
    return updatedInfo;
  },
};

export default exportedMethods;
