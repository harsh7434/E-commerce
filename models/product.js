const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const singleImgPath = '/uploades/ProductImages/SingleImages';
const MultiImgPath  = '/uploades/ProductImages/MultipleImages';

const ProductSchema = mongoose.Schema({
    procat_name : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "category",
        required : true
    },
    proSubCat_name : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "sub_category",
        required : true
    },
    proExtra_name : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "extra_category",
        required : true
    },
    probrand_name : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Brand",
        required : true
    },
    protype_name : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Type",
        required : true
    },
    product_title : {
        type : String,
        required : true
    },
    product_price : {
        type : Number,
        required : true
    },
    product_oldprice : {
        type : Number,
        required : true
    },
    product_color : {
        type :String,
    },
    product_size : {
        type :Number,
    },
    product_description : {
        type :String,
        required : true
    },
    Product_Image : {
        type :String,
        required : true
    },
    Product_multi_Image : {
        type :Array,
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

const ImageStorage = multer.diskStorage({
    destination : function(req,file,cb){
        if(file.fieldname == 'Product_Image'){
            cb(null,path.join(__dirname,"..",singleImgPath));
        }
        else{
            cb(null,path.join(__dirname,"..",MultiImgPath));
        }
    },
    filename : function(req,file,cb){
        cb(null,file.fieldname+"-"+Math.random()*10000000);
    } 
})

ProductSchema.statics.uploadProductImage = multer({storage :ImageStorage}).fields([{name : 'Product_Image',maxCount :1},{name : 'Product_multi_Image',maxCount : 5}]);
ProductSchema.statics.singleImagePath = singleImgPath;
ProductSchema.statics.multipleImagePath = MultiImgPath;

const ProductData = mongoose.model('Product',ProductSchema);
module.exports = ProductData;