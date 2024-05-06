import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

const validate = {
    checkIfName: (inp) => {
    let letters = /^[a-zA-Z]+$/;
    inp = inp.trim();
    if(inp.length < 2 || inp.length > 25) throw "Error: Input lenght should be in range on 2 and 25";
    if(!letters.test(inp)) throw "Error: Input should only contain letters";
  },

  checkIfUsername: (inp) => {
    let letters = /^[a-zA-Z]+$/;
    inp = inp.trim();
    if(inp.length < 5 || inp.length > 10) throw "Error: Input lenght should be in range on 5 and 10";
    if(!letters.test(inp)) throw "Error: Input should only contain letters";
  },

  checkIfPassword: (inp) => {
    let password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d\s]).{8,}$/;
    if(!password.test(inp.trim())) "Error: Weak password";
  },

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
    validate.checkIfProperInput(inp);
    if (typeof inp !== "number" || inp === NaN)
      throw "Error: Input parameter must be a positive number";
    if (inp < 1) throw "Error: Price must be positive";
    if (!Number.isInteger(inp)) {
      let temp = inp.toString().split(".");
      if (temp[1].length > 2) throw "Error: Only two decimal points allowed";
    }
  },

  checkIfValidURL: (inp) => {
    validate.checkIfProperInput(inp);
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

  // checkIfValidArray: (inp) => {
  //   checkIfProperInput(inp);
  //   if (typeof inp !== "object" || Array.isArray(inp) !== true)
  //     throw "Error: Input parameter must be an array";
  //   // if (inp.length === 0) throw "Error: Empty array provided";
  //   for (let string of inp) {
  //     validate.checkIfString(string);
  //   }
  // },

  checkIfValidDate: (inp) => {
    validate.checkIfProperInput(inp);
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
    validate.checkIfProperInput(inp);
    if (typeof inp !== "boolean")
      throw "Error: Input parameter must be boolean";
  },

  checkIfValidRating: (inp) => {
    validate.checkIfProperInput(inp);
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
      sum += parseFloat(arr[i]);
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