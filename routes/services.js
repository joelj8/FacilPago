//---------------------------------------------------------
// SERVICES ROUTES
//---------------------------------------------------------

var express     = require("express");
var router      = express.Router({mergeParams: true});
var passport    = require("passport");
var Service  = require("../models/service");
var middleware  = require("../middleware"); // Toma el archivo que se llame index en la carpeta indicada

var meses = require('date-names');

// Root route
router.get("/", middleware.isLoggedIn,function(req,res){
    Service.find({"author.username": req.user.username},function(err,allServices){
       if (err){
           
       } else {
           res.render("services/index",{allServices: allServices});       
       }
    });
    
});

// New Credit Card
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("services/new"); 
});

// Save Credit Card
router.post("/",middleware.isLoggedIn, function(req,res){
    // get data from form and add to services array
    var noservice       = req.body.noservice;
    var service         = req.body.service;
    var phone           = req.body.phone;

    var auth    = {id: req.user._id,
                   username: req.user.username };
     
    var newService = {noservice: noservice, service: service,
   phone: phone,  author: auth};
   
   Service.findOne({noservice:noservice, "author.username":req.user.username },function(err,foundService){
      if (err) {
        req.flash("error","Error, Service is not found");
        return res.redirect("/services");
      } else {

          if (foundService && foundService.noservice === noservice) {
            req.flash("error","This Service Number Alredy Exist");
            res.redirect("/services");
          } else { 
              
                // Create a new credit card and save to DB
                Service.create(newService, function(err, newService) {
                    if (err) {
                         req.flash("error","Error, Service wasn't save");
                         res.redirect("/services");
                    } else {
                        //Redirect back to credit card page
                        req.flash("success","Successfully added Service");
                        res.redirect("/services");          
                    };
                });              
          }
      }
   });

});

module.exports = router;