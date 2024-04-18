// This data file should export all functions using the ES6 standard as shown in the lecture code
import { artwork } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validate from "../helpers.js";
import pkg from "validator";
import { artistMethods } from "./index.js";
// import { validate.checkIfProperInput, validate.checkIfString, checkIfPositiveNumber, checkIfBoolean, checkIfValidArray, checkIfValidDate, checkIfValidURL } from "../helpers.js";

const exportMethods = {
  async get(id) {
    validate.checkIfProperInput(id);
    validate.checkIfString(id);
    id = id.trim();
    if (!ObjectId.isValid(id)) throw "Error: Invalid object ID";
    const productCollection = await artwork();
    const product = await productCollection.findOne({ _id: new ObjectId(id) });
    if (product === null) throw "Error: No product with provided ID";
    product._id = product._id.toString();
    return product;
  },

  async create(artistId, name, description, tags, price, images, reviews) {
    validate.checkIfProperInput(artistId);
    validate.checkIfProperInput(name);
    validate.checkIfProperInput(description);
    validate.checkIfProperInput(tags);
    validate.checkIfProperInput(price);
    validate.checkIfProperInput(images);
    validate.checkIfProperInput(reviews);

    validate.checkIfString(name);
    validate.checkIfString(description);

    validate.checkIfPositiveNumber(price);
    // validate.checkIfValidURL(images);
    pkg.isURL(images[0]);
    validate.checkIfValidArray(tags);
    validate.checkIfValidArray(reviews);

    tags = tags.map((string) => string.trim());
    reviews = reviews.map((string) => string.trim());

    let newProduct = {
      artistId: artistId.trim(),
      productName: name.trim(),
      productDescription: description.trim(),
      tags: Array.isArray(tags) ? tags.map((item) => item.trim()) : [],
      price: price,
      date: validate.getTodayDate(),
      images: Array.isArray(images) ? images.map((item) => item.trim()) : [],
      rating: 0,
      reviews: Array.isArray(reviews) ? reviews.map((item) => item.trim()) : [],
    };

    const productCollection = await artwork();
    const insertInfo = await productCollection.insertOne(newProduct);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Error: Could not add the product";

    insertInfo.insertedId = insertInfo.insertedId.toString();
    const id = insertInfo.insertedId;
    const productInfo = await this.get(id);
    let artistToUpdate = await artistMethods.get(productInfo.artistId);
    artistToUpdate.push(id.trim());
    await artistMethods.updateArtist(
      artistToUpdate.artistId,
      artistToUpdate.user_id,
      artistToUpdate.bio,
      artistToUpdate.profilePic,
      artistToUpdate.portfolio
    );
    return productInfo;
  },

  async getAll() {
    const productCollection = await artwork();
    let allProducts = await productCollection.find({}).toArray();
    if (!allProducts) throw "Error: Could not get all products";
    allProducts = allProducts.map((element) => {
      element._id = element._id.toString();
      return {
        _id: element._id,
        productName: element.productName,
      };
    });
    if (allProducts.length === 0) return [];
    return allProducts;
  },

  async remove(id) {
    validate.checkIfProperInput(id);
    validate.checkIfString(id);
    id = id.trim();
    if (!ObjectId.isValid(id)) throw "Error: Invalid object ID";

    const productCollection = await artwork();
    const removeProduct = await productCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });
    if (!removeProduct)
      throw `Error: Could not remove the product with id ${id}`;
    let artistToUpdate = await artistMethods.get(removeProduct.artistId);
    let updatedPortfolio = artistToUpdate.portfolio.filter(
      (element) => element != id
    );
    await artistMethods.updateArtist(
      removeProduct.artistId,
      artistToUpdate.user_id,
      artistToUpdate.bio,
      artistToUpdate.profilePic,
      updatedPortfolio
    );
    return { _id: id, deleted: true };
  },

  // async update(
  //   productId,
  //   productName,
  //   productDescription,
  //   modelNumber,
  //   price,
  //   manufacturer,
  //   manufacturerWebsite,
  //   keywords,
  //   categories,
  //   dateReleased,
  //   discontinued
  // ){
  //   validate.checkIfProperInput(productId);
  //   validate.checkIfProperInput(productName);
  //   validate.checkIfProperInput(productDescription);
  //   validate.checkIfProperInput(modelNumber);
  //   validate.checkIfProperInput(price);
  //   validate.checkIfProperInput(manufacturer);
  //   validate.checkIfProperInput(manufacturerWebsite);
  //   validate.checkIfProperInput(keywords);
  //   validate.checkIfProperInput(categories);
  //   validate.checkIfProperInput(dateReleased);
  //   if (discontinued === undefined) throw "Error: Input parameter not provided";

  //   validate.checkIfString(productId)
  //   validate.checkIfString(productName);
  //   validate.checkIfString(productDescription);
  //   validate.checkIfString(modelNumber);
  //   validate.checkIfString(manufacturer);
  //   validate.checkIfString(manufacturerWebsite);
  //   validate.checkIfString(dateReleased);

  //   checkIfPositiveNumber(price);
  //   checkIfValidURL(manufacturerWebsite);
  //   checkIfValidArray(keywords);
  //   checkIfValidArray(categories);
  //   checkIfValidDate(dateReleased);
  //   checkIfBoolean(discontinued);
  //   if (!ObjectId.isValid(productId)) throw 'Error: Invalid object ID';

  //   const updateProduct = {
  //     _id: new ObjectId(productId),
  //     productName: productName.trim(),
  //     productDescription: productDescription.trim(),
  //     modelNumber: modelNumber.trim(),
  //     price: price,
  //     manufacturer: manufacturer.trim(),
  //     manufacturerWebsite: manufacturerWebsite.trim(),
  //     keywords: keywords,
  //     categories: categories,
  //     dateReleased: dateReleased.trim(),
  //     discontinued: discontinued,
  //   };
  //   const productCollection = await artwork();
  //   const updatedProduct = await productCollection.findOneAndUpdate(
  //     { _id: new ObjectId(productId) },
  //     { $set: updateProduct },
  //     { returnDocument: 'after' });
  //     updatedProduct._id = updatedProduct._id.toString();
  //     if (!updatedProduct) throw "Error: Could not update product";
  //     return updatedProduct;
  // }
};
export default exportMethods;
