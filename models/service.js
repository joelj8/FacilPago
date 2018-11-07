var mongoose = require("mongoose");

//SCHEMA SETUP
var serviceSchema = new mongoose.Schema({
   noservice: String,
   service: String,
   phone: String,
   author: {
      id:  {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String 
   }  
});

module.exports = mongoose.model("Service", serviceSchema);

