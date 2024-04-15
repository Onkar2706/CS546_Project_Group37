// This data file should export all functions using the ES6 standard as shown in the lecture code
import { posts } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { checkIfProperInput, checkIfString, checkIfPositiveNumber, checkIfBoolean, checkIfValidArray, checkIfValidDate, checkIfValidURL } from "../helpers.js";

const exportMethods = {

  async get(id){
    checkIfProperInput(id);
    checkIfString(id);
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'Error: Invalid object ID';
    const productCollection = await posts();
    const product = await productCollection.findOne({ _id: new ObjectId(id) });
    if (product === null) throw "Error: No product with provided ID";
    product._id = product._id.toString();
    return product;
  },

  async create(
    productName,
    productDescription,
    modelNumber,
    price,
    manufacturer,
    manufacturerWebsite,
    keywords,
    categories,
    dateReleased,
    discontinued) {
    checkIfProperInput(productName);
    checkIfProperInput(productDescription);
    checkIfProperInput(modelNumber);
    checkIfProperInput(price);
    checkIfProperInput(manufacturer);
    checkIfProperInput(manufacturerWebsite);
    checkIfProperInput(keywords);
    checkIfProperInput(categories);
    checkIfProperInput(dateReleased);
    if (discontinued === undefined) throw "Error: Input parameter not provided";
  
    checkIfString(productName);
    checkIfString(productDescription);
    checkIfString(modelNumber);
    checkIfString(manufacturer);
    checkIfString(manufacturerWebsite);
    checkIfString(dateReleased);
  
    checkIfPositiveNumber(price);
    checkIfValidURL(manufacturerWebsite);
    checkIfValidArray(keywords);
    checkIfValidArray(categories);
    checkIfValidDate(dateReleased);
    checkIfBoolean(discontinued);
  
    keywords = keywords.map(string => string.trim());
    categories = categories.map(string => string.trim());
  
    let newProduct = {
      productName: productName.trim(),
      productDescription: productDescription.trim(),
      modelNumber: modelNumber.trim(),
      price: price,
      manufacturer: manufacturer.trim(),
      manufacturerWebsite: manufacturerWebsite.trim(),
      keywords: keywords,
      categories: categories,
      dateReleased: dateReleased.trim(),
      discontinued: discontinued,
      reviews: [],
      averageRating: 0
    };
  
    const productCollection = await posts();
    const insertInfo = await productCollection.insertOne(newProduct);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Error: Could not add the product';
  
    insertInfo.insertedId = insertInfo.insertedId.toString();
    const id = insertInfo.insertedId;
    const productInfo = await this.get(id);
    return productInfo;
  },
  
  async getAll(){       
    const productCollection = await posts();
    let allProducts = await productCollection.find({}).toArray();
    if (!allProducts) throw 'Error: Could not get all products';
    allProducts = allProducts.map((element) => {
      element._id = element._id.toString();
      return {
      _id:element._id,
      productName:element.productName}
    });
    if (allProducts.length === 0) return [];
    return allProducts;
  },
  
  async remove(id){
    checkIfProperInput(id);
    checkIfString(id);
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'Error: Invalid object ID';
  
    const productCollection = await posts();
    const removeProduct = await productCollection.findOneAndDelete({ _id: new ObjectId(id) })
    if (!removeProduct) throw `Error: Could not remove the product with id ${id}`;
    return {_id: id, deleted: true};
  },
  
  async update(
    productId,
    productName,
    productDescription,
    modelNumber,
    price,
    manufacturer,
    manufacturerWebsite,
    keywords,
    categories,
    dateReleased,
    discontinued
  ){
    checkIfProperInput(productId);
    checkIfProperInput(productName);
    checkIfProperInput(productDescription);
    checkIfProperInput(modelNumber);
    checkIfProperInput(price);
    checkIfProperInput(manufacturer);
    checkIfProperInput(manufacturerWebsite);
    checkIfProperInput(keywords);
    checkIfProperInput(categories);
    checkIfProperInput(dateReleased);
    if (discontinued === undefined) throw "Error: Input parameter not provided";
  
    checkIfString(productId)
    checkIfString(productName);
    checkIfString(productDescription);
    checkIfString(modelNumber);
    checkIfString(manufacturer);
    checkIfString(manufacturerWebsite);
    checkIfString(dateReleased);
  
    checkIfPositiveNumber(price);
    checkIfValidURL(manufacturerWebsite);
    checkIfValidArray(keywords);
    checkIfValidArray(categories);
    checkIfValidDate(dateReleased);
    checkIfBoolean(discontinued);
    if (!ObjectId.isValid(productId)) throw 'Error: Invalid object ID';
  
    const updateProduct = {
      _id: new ObjectId(productId),
      productName: productName.trim(),
      productDescription: productDescription.trim(),
      modelNumber: modelNumber.trim(),
      price: price,
      manufacturer: manufacturer.trim(),
      manufacturerWebsite: manufacturerWebsite.trim(),
      keywords: keywords,
      categories: categories,
      dateReleased: dateReleased.trim(),
      discontinued: discontinued,
    };
    const productCollection = await posts();
    const updatedProduct = await productCollection.findOneAndUpdate(
      { _id: new ObjectId(productId) },
      { $set: updateProduct },
      { returnDocument: 'after' });
      updatedProduct._id = updatedProduct._id.toString();
      if (!updatedProduct) throw "Error: Could not update product";
      return updatedProduct;
  }
};
export default exportMethods;