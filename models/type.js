const mongoose = require('mongoose');
const path = require('path');

const TypeSchema = mongoose.Schema({
    typecat_name : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "category",
        required : true
    },
    typeSubCat_name : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "sub_category",
        required : true
    },
    typeExtra_name : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "extra_category",
        required : true
    },
    type_name : {
        type : String,
        required : true
    },
    isActive : {
        type : Boolean,
        required : true
    },
    create_date : {
        type : String,
        required : true
    },
    updated_date : {
        type : String,
        required : true
    }
})

const TypeData = mongoose.model('Type',TypeSchema);
module.exports = TypeData;