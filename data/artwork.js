// This data file should export all functions using the ES6 standard as shown in the lecture code
// This data file should export all functions using the ES6 standard as shown in the lecture code
import { artworks } from "../config/mongoCollections.js";
import { artists } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validate from "../helpers.js";
import pkg from "validator";
import artistMethods from "./artists.js";
// import { validate.checkIfProperInput, validate.checkIfString, checkIfPositiveNumber, checkIfBoolean, checkIfValidArray, checkIfValidDate, checkIfValidURL } from "../helpers.js";

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
    // validate.checkIfProperInput(artistId);
    // validate.checkIfProperInput(name);
    // validate.checkIfProperInput(description);
    // validate.checkIfProperInput(tags);
    // validate.checkIfProperInput(price);
    // validate.checkIfProperInput(images);
    // validate.checkIfProperInput(reviews);

    // validate.checkIfString(name);
    // validate.checkIfString(description);

    // validate.checkIfPositiveNumber(price);
    // validate.checkIfValidURL(images);
    // pkg.isURL(images[0]);
    // validate.checkIfValidArray(tags);
    // validate.checkIfValidArray(reviews);

    // tags = tags.map((string) => string.trim());
    // reviews = reviews.map((string) => string.trim());

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
    // allProducts = allProducts.map((element) => {
    //   element._id = element._id.toString();
    //   // return allProducts
    //   // {
    //   //   _id: element._id,
    //   //   productName: element.productName,
    //   //   productDescription:element.productDescription,
    //   //   tags:element.tags,
    //   //   price:element.price,
    //   //   date:element.date,
    //   //   images:element.images,
    //   //   rating:element.rating,
    //   //   reviews:element.reviews
    //   // };
    // });
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

  async remove(id) {
    validate.checkIfProperInput(id);
    validate.checkIfString(id);
    id = id.trim();
    if (!ObjectId.isValid(id)) throw "Error: Invalid object ID";

    const productCollection = await artworks();
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

  async addReview(productId, userId, rating, comment){
    validate.checkIfProperInput(productId);
    validate.checkIfProperInput(userId);
    validate.checkIfProperInput(rating);
    validate.checkIfProperInput(comment);

    const filter = {_id: new ObjectId(productId)};
    const updateArr = {
      $push:{reviews: {userId: userId, ratings: rating, comment: comment}}
    };
    const productCollection = await artworks();
    const addRev = await productCollection.updateOne(filter, updateArr);
    if (!(addcom.matchedCount && addcom.modifiedCount)) {
      throw "Error: Could't add comment";
    }
  },


  // async updateProduct(productId, updateInfo){
  //   const filter = { _id: new ObjectId(productId)};
  //   const update = {
  //     $mod: updateInfo
  //   };
  //   const productCollection = await artworks();
  //   const result = await productCollection.updateOne(filter, update);
  //   if (result.modifiedCount === 1) {
  //       console.log('User information updated successfully.');
  //   } else {
  //       console.log('No user document was updated.');
  //   }
  //   return result
  // }


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
        productDescription: updatedProduct.description ? updatedProduct.description.trim() : existingProduct.productDescription,
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
