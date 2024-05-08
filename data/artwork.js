
import { artworks } from "../config/mongoCollections.js";
import { artists } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validate from "../helpers.js";
import pkg from "validator";
import artistMethods from "./artists.js";

const exportMethods = {
  async get(id) {
    validate.checkIfProperInput(id);
    validate.checkIfString(id);
    id = id.trim();
    if (!ObjectId.isValid(id)) throw "Error: Invalid object ID";
    const productCollection = await artworks();
    const product = await productCollection.findOne({ _id: new ObjectId(id) });
    if (product === null) throw "Error: No product with provided ID";
    product._id = product._id.toString();
    return product;
  },

  async create(
    artistId,
    name,
    description,
    tags,
    price,
    images,
    reviews
  ) {

    let newProduct = {
      artistId: artistId.trim(),
      productName: name.trim(),
      productDescription: description.trim(),
      tags: Array.isArray(tags) ? tags.map((item) => item.trim()) : [],
      price: price,
      date: validate.getTodayDate(),
      avgRating: 0,
      images: Array.isArray(images) ? images.map((item) => item.trim()) : [],
      reviews: Array.isArray(reviews) ? reviews.map((item) => item.trim()) : [],
    };

    const productCollection = await artworks();
    const insertInfo = await productCollection.insertOne(newProduct);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Error: Could not add the product";

    const productInfo = await productCollection.findOne({
      _id: new ObjectId(insertInfo.insertedId),
    });
    productInfo._id = productInfo._id.toString();
    return productInfo;
  },

  async getAll() {
    const productCollection = await artworks();
    let allProducts = await productCollection.find({}).toArray();
    if (!allProducts) throw "Error: Could not get all products";
    
    if (allProducts.length === 0) return [];
    return allProducts;
  },

  async getByArtist(artistId) {
    const artistsCollection = await artists(); 
    const artist = await artistsCollection.findOne({ _id: artistId });
    if (!artist) throw "Error: Artist not found";
    const artistProducts = artist.portfolio; 
    return artistProducts || [];
  },

  async remove(productId) {
    if (!productId) throw "Error: Product ID is required.";

    const productCollection = await artworks();
    const deletionInfo = await productCollection.deleteOne({
        _id: new ObjectId(productId)
    });

    if (deletionInfo.deletedCount === 0) {
        throw `Error: Could not delete product with ID ${productId}`;
    }

    return { deleted: true };
},

  async addReview(productId, username, rating, comment){
    validate.checkIfProperInput(productId);
    validate.checkIfProperInput(username);
    validate.checkIfProperInput(rating);
    validate.checkIfProperInput(comment);

    const filter = {_id: new ObjectId(productId)};
    const updateArr = {
      $push:{reviews: {userName: username, ratings: rating, comment: comment}}
    };
    const productCollection = await artworks();
    const addRev = await productCollection.updateOne(filter, updateArr);
    if (!(addRev.matchedCount && addRev.modifiedCount)) {
      throw "Error: Could't add comment";
    }
  },

  async removeFromArtWork(productId, artistId){
    validate.checkIfProperInput(artistId);
    validate.checkIfProperInput(productId);
    validate.checkIfString(productId);
    validate.checkIfString(artistId);

    const artistCollection = await artists();
    const removeProduct = await artistCollection.updateOne(
      {_id: new ObjectId(artistId)},
      {$pull: {portfolio: productId}}
    );
    if (!(removeProduct.matchedCount && removeProduct.modifiedCount)) {
      throw "Error: Could't remove product from purchases";
    }
    return removeProduct;
  },

  async updateProduct(productId, updatedProduct) {
    if (!productId || typeof productId !== 'string') {
      throw new Error('Error: Invalid product ID');
    }
    
    if (!updatedProduct || typeof updatedProduct !== 'object') {
      throw new Error('Error: Invalid updated product object');
    }
  
    const productCollection = await artworks();
  
    
    const existingProduct = await productCollection.findOne({ _id: new ObjectId(productId) });
    if (!existingProduct) {
      throw new Error('Error: Product not found');
    }
  
    
    const updateQuery = {
      $set: {
        productName: updatedProduct.name ? updatedProduct.name.trim() : existingProduct.productName,
        productDescription: updatedProduct.productDescription ? updatedProduct.productDescription.trim() : existingProduct.productDescription,
        tags: Array.isArray(updatedProduct.tags) ? updatedProduct.tags.map(tag => tag.trim()) : existingProduct.tags,
        price: updatedProduct.price ? updatedProduct.price : existingProduct.price,
        images: Array.isArray(updatedProduct.images) ? updatedProduct.images.map(image => image.trim()) : existingProduct.images,
        reviews: Array.isArray(updatedProduct.reviews) ? updatedProduct.reviews.map(review => review.trim()) : existingProduct.reviews
      }
    };
  
    
    const updateResult = await productCollection.updateOne({ _id: new ObjectId(productId) }, updateQuery);
  
    if (updateResult.modifiedCount === 0) {
      throw new Error('Error: Product update failed');
    }
  
    
    const updatedProductInfo = await productCollection.findOne({ _id: new ObjectId(productId) });
    updatedProductInfo._id = updatedProductInfo._id.toString();
    return updatedProductInfo;
  }
};
export default exportMethods;
