const mongoose = require('mongoose');
const path = require('path');

const sub_categorySchema = mongoose.Schema({
    cat_name : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "category",
        required : true
    },
    sub_category_name : {
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

const sub_categoryData = mongoose.model('sub_category',sub_categorySchema);
module.exports = sub_categoryData;