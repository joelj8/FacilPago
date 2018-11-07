//---------------------------------------------------------
// AUTHENTICATION ROUTES
//---------------------------------------------------------

var express     = require("express");
var router      = express.Router({mergeParams: true});

var passport    = require("passport");
var User         = require("../models/user");

// Root route
router.get("/",function(req,res){
    if (typeof req.user === "undefined"){
        res.render("landing");
    } else {
        res.redirect("/invoices");
    }    
});

// Show Register Form
router.get("/register",function(req, res) {
   res.render("register"); 
});

// Handle Sing Up Logic
router.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser,req.body.password, function(err, user) {
        if (err){
            // console.log(err);
            req.flash("error",err.message);
            return res.redirect("register");
        }
        
        passport.authenticate("local")(req, res, function(){
            req.flash("success","Welcome to FacilPago "+user.username);
            res.redirect("/invoices");     
        });
    });
});


// Show Login Form
router.get("/login",function(req, res) {

    if (typeof req.user === "undefined"){
        res.render("login"); 
    } else {
        res.redirect("/invoices");
    }
});

// Handle Login Logic
router.post("/login", passport.authenticate("local",
    {successRedirect: "/invoices",
        failureRedirect: "/login"}), 
   function(req,res){
    
});

// LogOut Logic
router.get("/logout",function(req, res){
   req.logout();
   req.flash("success","Logged you out!");
   res.redirect("/login"); 
//   res.redirect("/campgrounds"); 
});

module.exports = router;