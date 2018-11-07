var mongoose = require("mongoose");

//SCHEMA SETUP
var creditcardSchema = new mongoose.Schema({
   cardnumber: String,
   dateexpire: String,
   code: String,
   author: {
      id:  {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String 
   }  
});

module.exports = mongoose.model("CreditCard", creditcardSchema);

