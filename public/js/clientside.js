// import { response } from "express";
// import validate from "../../helpers.js";
// document.addEventListener("DOMContentLoaded", function () {
//   // Check if the user is logged in
//   const isLoggedIn = true;

//   // Get the sign-in/sign-up and user name elements
//   const signinSignupElement = document.getElementById("signin-signup");
//   const userNameElement = document.getElementById("user-name");

//   // If the user is logged in, hide sign-in/sign-up and show user name
//   if (isLoggedIn) {
//     signinSignupElement.style.display = "none";
//     userNameElement.style.display = "block";
//   } else {
//     signinSignupElement.style.display = "block";
//     userNameElement.style.display = "none";
//   }
// });
const validate = {
  checkIfName: (inp) => {
    let letters = /^[a-zA-Z]+$/;
    inp = inp.trim();
    if (inp.length < 2 || inp.length > 25)
      throw "Error: Input lenght should be in range on 2 and 25";
    if (!letters.test(inp)) throw "Error: Input should only contain letters";
  },

  checkIfUsername: (inp) => {
    let letters = /^[a-zA-Z]+$/;
    inp = inp.trim();
    if (inp.length < 5 || inp.length > 10)
      throw "Error: Input lenght should be in range on 5 and 10";
    if (!letters.test(inp)) throw "Error: Input should only contain letters";
  },

  checkIfPassword: (inp) => {
    let password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d\s]).{8,}$/;
    if (!password.test(inp.trim())) "Error: Weak password";
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
    console.log(typeof inp);
    if (typeof inp !== "number" || isNaN(inp))
      throw "Error: Input parameter must be a positive number";
    if (inp < 1) throw "Error: Price must be positive";
    if (!Number.isInteger(inp)) {
      let temp = inp.toString().split(".");
      if (temp[1].length > 2) throw "Error: Only two decimal points allowed";
    }
  },

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
(function () {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  const searchArtistsForm = document.getElementById("searchForArtists");
  let artistRegForm = document.getElementById("artistRegisterForm");
  let addProductForm = document.getElementById("addProductForm");
  let postForm = document.getElementById("blogForm");
  let searchResults = $("#searchResults");
  if (postForm) {
    postForm.addEventListener("submit", (event) => {
      event.preventDefault();
      try {
        let title = document.getElementById("title").value;
        validate.checkIfString(title);
        let body = document.getElementById("body").value;
        validate.checkIfString(body);
        postForm.submit();
      } catch (e) {
        console.log(e);
        alert(e);
      }
    });
  }
  if (addProductForm) {
    addProductForm.addEventListener("submit", (event) => {
      event.preventDefault();
      try {
        let productName = document.getElementById("productName").value;
        let productDescription = document.getElementById("productDescription").value;
        let price = parseFloat(document.getElementById("price").value);
        // let image = document.getElementById("images").value;
        let tags = document.getElementById("tags").value;
        validate.checkIfString(productName);
        validate.checkIfString(productDescription);
        validate.checkIfPositiveNumber(price);
        // // let imagesArray = images.split(",");
        // // console.log(imagesArray);
        // // // imagesArray.forEach((element) => {
        // // //   validate.checkIfString(element);
        // // // });
        // validate.checkIfString(image);
        let tagsArray = tags.split(",");
        tagsArray.forEach((element) => {
          validate.checkIfString(element);
        });
        addProductForm.submit();
      } catch (e) {
        console.log(e);
        alert(e);
      }
    });
  }
  if (artistRegForm) {
    artistRegForm.addEventListener("submit", (event) => {
      event.preventDefault();
      try {
        let bio = document.getElementById("bio").value;
        // let profilePic = document.getElementById("profilePicture").value;
        validate.checkIfString(bio);
        // validate.checkIfString(profilePic);
        artistRegForm.submit();
      } catch (e) {
        console.log(e);
        alert(e);
      }
    });
  }
  if (searchArtistsForm) {
    searchResults.hide();
    searchArtistsForm.addEventListener("submit", (event) => {
      event.preventDefault();
      try {
        let firstName = document.getElementById("firstNameInput").value;
        let lastName = document.getElementById("lastNameInput").value;
        validate.checkIfString(firstName);
        validate.checkIfString(lastName);
        let requestConfig = {
          method: "POST",
          URL: "/artist",
          contentType: "application/json",
          data: JSON.stringify({ firstName: firstName.toLowerCase(), lastName: lastName.toLowerCase()}),
        };
        $.ajax(requestConfig).then(function (response) {
          // let ulElement = $("<ul/>");
          // ulElement.attr("class", "card-container");
          console.log(response);
          if (response.length === 0) {
            console.log(`Couldn't find an artist with that name!`);
            alert("Couldn't find an artist with that name!");
          }
          searchResults.empty();
          response.forEach((element) => {
            let li = $("<li/>");
            li.attr("class", "card");
            let div = $("<div/>");
            div.attr("class", "artwork-item");
            let img = $("<img/>");
            img.attr("class", "artwork-image");
            img.attr("src", element.profilePic);
            img.attr("alt", "Image of " + element.firstName);
            let h2 = $("<h2/>");
            h2.attr("class", "artwork-name");
            h2.text(element.firstName + " " + element.lastName);
            let p = $("<p/>");
            p.attr("class", "artwork-description");
            p.text(element.bio);
            let a = $("<a/>");
            a.attr("href", "/artist/" + element._id);
            a.attr("class", "buy-button");
            a.text("Visit Profile");
            // let button = $("<button/>");
            // button.attr("class", "buy-button");
            // button.textContent = "Visit Profile";
            // a.append(button);
            div.append(img);
            div.append(h2);
            div.append(p);
            div.append(a);
            li.append(div);
            searchResults.append(li);
          });
          // console.log(responseMessage);
          // searchResults.append(ulElement);
          firstName.value = "";
          lastName.value = "";
        });
        searchResults.show();
      } catch (e) {
        console.log(e);
        alert(e);
      }
    });
  }
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      try {
        let userName = document.getElementById("userName").value;
        validate.checkIfUsername(userName);
        let password = document.getElementById("password").value;
        validate.checkIfPassword(password);
        loginForm.submit();
      } catch (e) {
        console.log(e);
        alert("Woops! Something went wrong! " + e);
      }
    });
  }
  if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      try {
        let firstName = document.getElementById("firstName").value;
        validate.checkIfName(firstName);
        let lastName = document.getElementById("lastName").value;
        validate.checkIfName(lastName);
        let username = document.getElementById("userName").value;
        validate.checkIfUsername(username);
        let password = document.getElementById("password").value;
        validate.checkIfPassword(password);
        let email = document.getElementById("email").value;
        validate.checkIfString(email);
        let age = document.getElementById("age").valueAsNumber;
        validate.checkIfPositiveNumber(age);
        let state = document.getElementById("state").value;
        validate.validateState(state);
        let city = document.getElementById("city").value;
        validate.checkIfString(city);
        registerForm.submit();
        // let requestConfig = {
        //   method: "POST",
        //   URL: "/user/register",
        //   contentType: "application/json",
        //   data: JSON.stringify({
        //     firstName: firstName,
        //     lastName: lastName,
        //     userName: username,
        //     password: password,
        //     email: email,
        //     age: age,
        //     state: state,
        //     city: city,
        //   }),
        // };
        // $.ajax(requestConfig).done(function (responseMessage) {
        //   alert("You're registered!");
        // });
      } catch (e) {
        // let errorMsg = document.getElementById("errorMsg");
        // errorMsg.textContent = e;
        // errorMsg.show();
        console.log(e);
        alert("Woops! Something went wrong! " + e);
      }
    });
  }
})(window.jQuery);
