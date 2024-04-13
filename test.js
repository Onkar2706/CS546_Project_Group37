import user from "./data/users.js";
try {

    console.log(
    
        await user.create(
          "Ross",
          "Geller",
          "RS27",
          "RS27@email.com",
          "NJ",
          "Hoboken",
          ["Book", "Arts", "Cars"],
          ["Test1", "Test2", "Test3", "Test4"],
          ["Test5", "Test6", "Test7"],
          ["Test5", "Test6", "Test7"],
          "abc1266665b"
        )
      
      );
    
} catch (error) {
    console.log(error)
    
}

