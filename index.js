const express = require('express');
const port = 9001;
const app = express();
const path = require('path');

// const db = require("./config/mongoose");
const Admin = require('./models/admin');

const mongoose = require('mongoose');
mongoose.connect(("mongodb+srv://paghadalavadhpaghadalavadh607:avadh123cluster@cluster0.0ps7jfm.mongodb.net/Ecommerce"), {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(() => console.log('Database Connected'))
    .catch((err) => console.log(err));
// view engine
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

// cookie
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// session
const session = require('express-session');
// passport
const passport = require('passport');
const passportlocal = require('./config/passport_local_strategy');


var Publishable_Key = 'pk_test_5RzHjUwGCx0aBvQYxmMprB1200k4WeKjIa'
var Secret_Key = 'sk_test_wFSjCKx4AW07JCc87b2fUwhH00zzjnRSJv'
const stripe = require('stripe')("sk_test_wFSjCKx4AW07JCc87b2fUwhH00zzjnRSJv")

app.use(express.urlencoded());

// session
app.use(session({
    name : "avadh",
    secret : "avadh",
    resave : false,
    saveUninitialized : true,
    cookie : {
        maxAge : 1000*60*100
    }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);




// user Routing
app.use('/',require('./routes/user'));
app.use(express.static(path.join(__dirname,"user_assets")));
// routing
app.use('/admin',require('./routes/admin'));
app.use(express.static(path.join(__dirname,"assets")));
app.use("/uploades",express.static(path.join(__dirname,"uploades")));



app.listen(port , function(err){
    if(err)
    console.log(err);
    console.log(`server is running port : ${port}`);
})