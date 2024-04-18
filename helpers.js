import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

const validate = {
  async hashPassword(inp) {
    const saltRounds = 10;
    let hash = null;
    inp = inp.trim();
    hash = await bcrypt.hash(inp, saltRounds);
    return hash;
  },

  checkIfProperInput: (inp) => {
    if (!inp || inp === undefined) throw "Error: Input parameter not provided";
  },

  checkIfString: (inp) => {
    validate.checkIfProperInput(inp);
    if (typeof inp !== "string" || inp.trim().length === 0)
      throw "Error: Input parameter must be non-empty string";
  },
  checkIfValidObjectId: (inp) => {
    //function to check if id is a valid ObjectId
    validate.checkIfProperInput(inp);
    validate.checkIfString(inp);
    inp = inp.trim();
    if (!ObjectId.isValid(inp)) {
      throw `Error, provided input is not a valid ObjectID`;
    }
  },
  checkIfPositiveNumber: (inp) => {
    checkIfProperInput(inp);
    if (typeof inp !== "number" || inp === NaN)
      throw "Error: Input parameter must be a positive number";
    if (inp < 1) throw "Error: Price must be positive";
    if (!Number.isInteger(inp)) {
      let temp = inp.toString().split(".");
      if (temp[1].length > 2) throw "Error: Only two decimal points allowed";
    }
  },

  checkIfValidURL: (inp) => {
    checkIfProperInput(inp);
    inp = inp.trim();
    let strLength = inp.length;
    const url = new URL(inp);
    if (strLength < 20) throw "Error: Invalid URL";
    if (url.protocol !== "http:") throw "Error: Invalid URL";
    if (inp.substring(strLength - 4, strLength) !== ".com")
      throw "Error: Invalid URL";
    if (inp.slice(11, -4).length < 5) throw "Error: Invalid URL";
    let site = inp.slice(11, -4);
    if (/^[a-zA-Z0-9]+([\-_\.][a-zA-Z0-9]+)*$/.test(site) === false)
      throw "Error: Invalid URL"; // https://javascript.plainenglish.io/check-if-string-is-alphanumeric-in-javascript-e325caa3ee
  },

  checkIfValidArray: (inp) => {
    checkIfProperInput(inp);
    if (typeof inp !== "object" || Array.isArray(inp) !== true)
      throw "Error: Input parameter must be an array";
    // if (inp.length === 0) throw "Error: Empty array provided";
    for (let string of inp) {
      validate.checkIfString(string);
    }
  },

  checkIfValidDate: (inp) => {
    checkIfProperInput(inp);
    inp = inp.trim();
    let inpDate = new Date(inp);
    let todayDate = new Date();
    let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (inp.length !== 10) throw "Error: Invalid date";
    if (parseInt(inp.substring(0, 2)) < 1 || parseInt(inp.substring(0, 2)) > 12)
      throw "Error: Invalid date"; //for checking month
    let month = parseInt(inp.substring(0, 2));
    if (
      parseInt(inp.substring(3, 5)) < 1 ||
      parseInt(inp.substring(3, 5)) > days[month - 1]
    )
      throw "Error: Invalid date"; //for checking day
    if (parseInt(inp.substring(6)) > todayDate.getFullYear())
      throw "Error: Invalid date"; //for checking year
    if (inpDate > todayDate) throw "Error: Invalid Date"; // for checking if date in future
  },

  checkIfBoolean: (inp) => {
    checkIfProperInput(inp);
    if (typeof inp !== "boolean")
      throw "Error: Input parameter must be boolean";
  },

  checkIfValidRating: (inp) => {
    checkIfProperInput(inp);
    if (typeof inp !== "number" || inp === NaN) throw "Error: Invalid Rating";
    if (inp < 1 || inp > 5) throw "Error: Invalid Rating";
    if (!Number.isInteger(inp)) {
      let temp = inp.toString().split(".");
      if (temp[1].length > 1)
        throw "Error: Only one decimal points allowed for rating";
    }
  },

  getTodayDate: () => {
    let temp = new Date();
    let month = temp.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    let day = temp.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    let year = temp.getFullYear();
    return `${month}/${day}/${year}`;
  },

  calculateAverageRating: (arr) => {
    if (arr.length === 0) return 0;

    let sum = null;
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i]["rating"];
    }
    let result = sum / arr.length;
    result = result.toFixed(1);
    result = parseFloat(result);
    return result;
  },

  validateState: (state) => {
    const States = [
      "AL",
      "AK",
      "AZ",
      "AR",
      "CA",
      "CO",
      "CT",
      "DE",
      "FL",
      "GA",
      "HI",
      "ID",
      "IL",
      "IN",
      "IA",
      "KS",
      "KY",
      "LA",
      "ME",
      "MD",
      "MA",
      "MI",
      "MN",
      "MS",
      "MO",
      "MT",
      "NE",
      "NV",
      "NH",
      "NJ",
      "NM",
      "NY",
      "NC",
      "ND",
      "OH",
      "OK",
      "OR",
      "PA",
      "RI",
      "SC",
      "SD",
      "TN",
      "TX",
      "UT",
      "VT",
      "VA",
      "WA",
      "WV",
      "WI",
      "WY",
    ];
    if (state === undefined) throw "Please enter valid state";
    if (typeof state !== "string") throw "Please give valid string";
    if (state.length !== 2) throw "Please enter only State shortforms";
    if (state.trim === "") throw "do not enter blank space";
    if (!States.includes(state.toUpperCase())) throw "State is not valid";
    return true;
  },
};

export default validate;

// // You can add and export any helper functions you want here - if you aren't using any, then you can just leave this file as is

// export function validateString(str) {
//   return typeof str === "string" && str.trim() !== "";
// }

// export function validateArray(arr) {
//   return (
//     Array.isArray(arr) &&
//     arr.length > 0 &&
//     arr.every((item) => validateString(item))
//   );
// }

// export function validatePrice(price) {
//   if (typeof price !== "number" || price < 1 || price === NaN) return false;
//   if (!Number.isInteger(price)) {
//     let parts = price.toString().split(".");
//     if (parts[1].length > 2) return false;
//     // return true
//   }

//   return true;
// }

// export function validateManufacturerWebsite(website) {
//   const websiteRegex = /^http:\/\/www\.([a-zA-Z0-9]{5,})\.com$/;
//   return (
//     typeof website === "string" &&
//     website.trim().startsWith("http://www.") &&
//     website.trim().endsWith(".com") &&
//     website.trim().length > 19 &&
//     websiteRegex.test(website.trim())
//   );
// }

// export function validateEmailAddress(email) {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return typeof email === "string" && emailRegex.test(email.trim());
// }

// export function validateDate(date) {
//   if (!date || typeof date !== "string") {
//     return false;
//   }
//   let sDate = new Date();
//   let userDate = new Date(date);
//   //  const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])\/\d{4}$/;
//   //  if (!dateRegex.test(date)) return false;
//   const [month, day, year] = date.split("/");
//   if (userDate > sDate) return false;

//   const parsedDate = new Date(`${month}/${day}/${year}`);
//   return parsedDate && parsedDate.getMonth() == parseInt(month) - 1;
// }

// export function validateObjectId(id) {
//   const pattern = /^[0-9a-fA-F]{24}$/;
//   return pattern.test(id);
// }

// export function validateRating(rating) {
//   if (rating < 1 || rating > 5) {
//     throw new Error("Rating should be between 1 and 5");
//   }
//   return true;
// }

// export function validateState(state) {
//   const States = [
//     "AL",
//     "AK",
//     "AZ",
//     "AR",
//     "CA",
//     "CO",
//     "CT",
//     "DE",
//     "FL",
//     "GA",
//     "HI",
//     "ID",
//     "IL",
//     "IN",
//     "IA",
//     "KS",
//     "KY",
//     "LA",
//     "ME",
//     "MD",
//     "MA",
//     "MI",
//     "MN",
//     "MS",
//     "MO",
//     "MT",
//     "NE",
//     "NV",
//     "NH",
//     "NJ",
//     "NM",
//     "NY",
//     "NC",
//     "ND",
//     "OH",
//     "OK",
//     "OR",
//     "PA",
//     "RI",
//     "SC",
//     "SD",
//     "TN",
//     "TX",
//     "UT",
//     "VT",
//     "VA",
//     "WA",
//     "WV",
//     "WI",
//     "WY",
//   ];
//   if (state === undefined) throw "Please enter valid state";
//   if (typeof state !== "string") throw "Please give valid string";
//   if (state.length !== 2) throw "Please enter only State shortforms";
//   if (state.trim === "") throw "do not enter blank space";
//   if (!States.includes(state.toUpperCase())) throw "State is not valid";
//   return true
// }

// export function avgRating(rating) {
//   if (rating.length === 0) return 0;
//   let result = 0;
//   for (let index = 0; index < rating.length; index++) {
//     const element = rating[index]["rating"];
//     result += element;
//   }

//   const average = result / rating.length;
//   let finalAvg = average.toFixed(1);
//   finalAvg = parseFloat(finalAvg);

//   return finalAvg;
// }
