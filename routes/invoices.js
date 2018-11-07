//---------------------------------------------------------
// INVOICES ROUTES
//---------------------------------------------------------

var express     = require("express");
var router      = express.Router({mergeParams: true});
var middleware  = require("../middleware"); // Toma el archivo que se llame index en la carpeta indicada
var Service     = require("../models/service");
var Invoice     = require("../models/invoice");
var passport    = require("passport");
var User        = require("../models/user");

// Root route
router.get("/",function(req,res){
    
    //res.render("invoices/index");

    Invoice.find({"author.username": req.user.username, paid: 0},function(err,allInvoices){
       if (err){
           
       } else {
           res.render("invoices/index",{allInvoices: allInvoices});       
       }
    });
    
});

// New Invoice
router.get("/new", middleware.isLoggedIn, function(req,res){
    Service.find({"author.username": req.user.username}, function(err,allServices) {
       if (err){
           
       } else {
            res.render("invoices/new",{allServices: allServices});        
       }
    });
    
});


// Save Credit Card
router.post("/",middleware.isLoggedIn, function(req,res){
    // get data from form and add to services array
    var service         = req.body.service;
    var limitedate      = req.body.limitedate;
    var amount          = req.body.amount;

    var auth    = {id: req.user._id,
                  username: req.user.username };
                  
    //res.send(req.body);
    Service.findOne({noservice:service, "author.username":req.user.username },function(err,foundService){
        if (err) {
            
        } else {
            var selServicio = {id: foundService.id, noservice: foundService.noservice, 
                               service: foundService.service, phone: foundService.phone};
         
            var newInvoice = {servicereg: selServicio, amount: amount, paid: 0,
                              limitedate: limitedate,  author: auth};
         
                Invoice.findOne({"servicereg.noservice": newInvoice.servicereg.noservice, 
                                 limitedate: newInvoice.limitedate,
                                 "author.username": req.user.username}, function(err,foundInvoice){
                                    if (err){
                                        req.flash("error", "Error, Invoice was not saved");
                                        return res.redirect("/invoices");
                                    } else {
                                        if (foundInvoice && foundInvoice.servicereg.noservice === newInvoice.servicereg.noservice
                                            && foundInvoice.limitedate === newInvoice.limitedate) {
                                                req.flash("error", "Error, This Invoice Alredy Exist");
                                                res.redirect("/invoices");
                                            } else {
                                                // Create a new credit card and save to DB
                                                Invoice.create(newInvoice, function(err, newInvoice) {
                                                    if (err) {
                                                         req.flash("error","Error, Invoice wasn't save");
                                                         res.redirect("/invoices");
                                                    } else {
                                                        //Redirect back to credit card page
                                                        req.flash("success","Successfully added Invoice");
                                                        res.redirect("/invoices");
                                                    }
                                            });
                                        }
                                 }
            });
        }            
    });               
});

module.exports = router;