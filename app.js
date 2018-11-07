var express                 = require("express"),
    app                     = express(),
    bodyParse               = require("body-parser"),
    mongoose                = require("mongoose"),
    flash                   = require("connect-flash"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    LocalStrategy           = require("passport-local"),
    methodOverride          = require("method-override"),
    User                    = require("./models/user"),
    Service                 = require("./models/service"),
    CreditCart              = require("./models/creditcard"),
    Invoice                 = require("./models/invoice");
  
    
var servicesRoutes          = require("./routes/services"),
    creditcardsRoutes       = require("./routes/creditcards"),
    invoicesRoutes          = require("./routes/invoices"),
    indexRoutes             = require("./routes/index");
    

//Base de Datos 
//mongoose.connect("mongoose://localhost/Yelp_camp");
mongoose.connect('mongodb://localhost:27017/FacilPago', { useNewUrlParser: true });

app.use(bodyParse.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
// Comment for practice
// seedDB();

//---------------------------------------------------
// PASSPORT CONFIGURATION
//---------------------------------------------------
app.use(require("express-session")({
        secret: "clave secreta de express session",
        resave: false,
        saveUninitialized: false
    }
));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   res.locals.info = req.flash("info");
   res.locals.warning = req.flash("warning");
   next();
});


app.use("/",indexRoutes);
app.use("/services",servicesRoutes);
app.use("/creditcards",creditcardsRoutes);
app.use("/invoices",invoicesRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("The FacilPago Server Started OK!!!")
});