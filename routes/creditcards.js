//---------------------------------------------------------
// CREDIT CARDS ROUTES
//---------------------------------------------------------

var express     = require("express");
var router      = express.Router({mergeParams: true});
var passport    = require("passport");
var CreditCard  = require("../models/creditcard");
var middleware  = require("../middleware"); // Toma el archivo que se llame index en la carpeta indicada

var meses = require('date-names');

// Root route
router.get("/", middleware.isLoggedIn,function(req,res){
    CreditCard.find({"author.username": req.user.username},function(err,allCreditCards){
       if (err){
           
       } else {
           res.render("creditcards/index",{allCreditCards: allCreditCards});       
       }
    });
    
});

// New Credit Card
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("creditcards/new",{meses: meses }); 
});

router.post("/",middleware.isLoggedIn, function(req,res){
    // get data from form and add to campgrounds array
    var cardnumber      = req.body.cardnumber;
    var monthexpire     = req.body.monthexpire;
    var yearexpire      = req.body.yearexpire;
    var dateExpire      = monthexpire + yearexpire;
    var code            = req.body.code;
    var auth    = {id: req.user._id,
                   username: req.user.username };
     
    var newCreditCard = {cardnumber: cardnumber, dateexpire: dateExpire,
   code: code,  author: auth};
   
   CreditCard.findOne({cardnumber:cardnumber, "author.username":req.user.username },function(err,foundCreditCard){
      if (err) {
        req.flash("error","Error, Credit Card is not found");
        return res.redirect("/creditcards");
      } else {

          if (foundCreditCard && foundCreditCard.cardnumber === cardnumber) {
            req.flash("error","This Credit Card Number Alredy Exist");
            res.redirect("/creditcards");
          } else { 
              
                // Create a new credit card and save to DB
                CreditCard.create(newCreditCard, function(err, newCreditCard) {
                    if (err) {
                         req.flash("error","Error, Credit Card wasn't save");
                         res.redirect("/creditcards"); 
                    } else {
                        //Redirect back to credit card page
                        req.flash("success","Successfully added Credit Card");
                        res.redirect("/creditcards");
                    };
                });              
          }
      }
   });

});

module.exports = router;