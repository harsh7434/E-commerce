const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1/e_commerce");

const db = mongoose.connection;

db.once('open', function(err){
    if(err){
        console.log("db is not connected",err);
    }
    console.log("DB is connect");
})

module.exports = db;