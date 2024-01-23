const mongoose = require('mongoose');
const path = require('path');

const BrandSchema = mongoose.Schema({
    brandcat_name : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "category",
        required : true
    },
    brandSubCat_name : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "sub_category",
        required : true
    },
    brandExtra_name : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "extra_category",
        required : true
    },
    brand_name : {
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

const BrandData = mongoose.model('Brand',BrandSchema);
module.exports = BrandData;