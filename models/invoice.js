var mongoose = require("mongoose");

//SCHEMA SETUP
var invoiceSchema = new mongoose.Schema({
   servicereg: {
      id:  {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Service"
      },
      noservice: String,
      service: String,
      phone: String
   },    
   amount: Number,
   paid: Number,
   limitedate: String,
   paiddate: String,
   confirmnum: String,
   creditcardpaid: {
      id:  {
         type: mongoose.Schema.Types.ObjectId,
         ref: "CreditCard"
      },
      cardnumber: String
   }, 
   comment: String,
   author: {
      id:  {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String 
   }  
});

module.exports = mongoose.model("Invoice", invoiceSchema);

