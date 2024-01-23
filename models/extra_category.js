const mongoose = require('mongoose');
const path = require('path');

const extra_categorySchema = mongoose.Schema({
    extracat_name : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "category",
        required : true
    },
    extra_sub_category_name : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "sub_category",
        required : true
    },
    extra_category_name : {
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

const extra_categoryData = mongoose.model('extra_category',extra_categorySchema);
module.exports = extra_categoryData;