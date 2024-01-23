const category = require('../models/category');
const sub_category = require('../models/sub_category');
const extra_category = require('../models/extra_category');
const brand = require('../models/brand');
const type = require('../models/type');
const product = require('../models/product');
const fs = require('fs');
const path = require('path');


// product
module.exports.add_product = async(req,res)=>{
    try{
        let categoryData = await category.find({});
        let subCatData = await sub_category.find({});
        let extraData = await extra_category.find({});
        let brandData = await brand.find({});
        let typeData = await type.find({});
        return res.render('add_product',{
            'categoryData' : categoryData,
            'subCatData' : subCatData,
            'extraData' : extraData,
            'brandData' :brandData,
            'typeData' : typeData,
        });
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// add product
module.exports.add_ProductData = async (req, res) => {
    try {
        var SIimagePath = '';
        var MTimagePath = [];
        req.body.isActive = true;
        req.body.create_date = new Date().toLocaleString();
        req.body.updated_date = new Date().toLocaleString();
        if (req.files) {
            SIimagePath = product.singleImagePath + "/" + req.files.Product_Image[0].filename;
            for(var i=0; i<req.files.Product_multi_Image.length; i++){
                MTimagePath.push(product.multipleImagePath+"/"+req.files.Product_multi_Image[i].filename);
            }
        }
        req.body.Product_Image = SIimagePath;
        req.body.Product_multi_Image = MTimagePath;
        let addData = await product.create(req.body);
        if (addData) {
            console.log("Data Insert successfuly");
            return res.redirect("back");
        }
        else {
            console.log("Data Not Inserted");
            return res.redirect("back");
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect("back");
    }
}
// view Product
module.exports.view_product = async(req,res)=>{
    try {
        let search = '';
        if (req.query.search) {
            search = req.query.search;
        }

        if (req.query.page) {
            page = req.query.page;
        }
        else {
            page = 0;
        }

        var parpage = 3;
        let totaladmindata = await product.find({
            $or: [
                { "product_title": { $regex: ".*" + search + ".*", $options: "i" } },
            ]
        }).countDocuments();
        let data = await product.find({
            $or: [
                { "product_title": { $regex: ".*" + search + ".*", $options: "i" } },
            ]
        })
            .limit(parpage)
            .skip(parpage * page)
            .populate(['procat_name','proSubCat_name','proExtra_name','probrand_name','protype_name']).exec()
        return res.render("view_product", {
            ProductData: data,
            cpage : page,
            search : search,
            totaldoc: Math.ceil(totaladmindata / parpage)
        });
    }
    catch (err) {
        console.log(err);
        return res.redirect("back");
    }
}

// view More
module.exports.view_more = async(req,res)=>{
    try{
        let data = await product.findById(req.params.id).populate(['procat_name','proSubCat_name','proExtra_name','probrand_name','protype_name']).exec();
        let upData = await product.findById(req.params.id);
        let categoryRecord = await category.find({});
        let sub_catRecord = await sub_category.find({});
        let extra_catRecord = await extra_category.find({});
        let brand_Record = await brand.find({});
        let type_Record = await type.find({});
        return res.render('view_more',{
            pd : data,
            up : upData,
            cr : categoryRecord,
            sr : sub_catRecord,
            er: extra_catRecord,
            br: brand_Record,
            tr : type_Record
        })
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// de-active data
module.exports.setDeactive = async(req,res)=>{
    try{
        if(req.params.id)
        {
            let activeData = await product.findByIdAndUpdate(req.params.id,{isActive : false});
        
            if(activeData)
            {
                console.log("Data is Deactive");
                return res.redirect("back");
            }
            else{
                console.log("Data is Active");
                return res.redirect("back");
            }
        }
        else
        {
             console.log("Params is Not Found!!!");
             return redirect("back");
        }
    }
    catch(err)
    {
        console.log(err);
        return res.redirect("back");
    }
}


// active data
module.exports.setActive = async(req,res)=>{
    try{
        if(req.params.id)
        {
            let activeData = await product.findByIdAndUpdate(req.params.id,{isActive : true});

            if(activeData)
            {
                console.log("Data is Active");
                return res.redirect("back");
            }
            else{
                console.log("Data is Deactive");
                return res.redirect("back");
            }
        }
        else
        {
            console.log("Params is Not Found!!!");
            return redirect("back");
        }
    }
    catch(err)
    {
        console.log(err);
        return res.redirect("back");
    }
}

// update Product
module.exports.updateproductData = async (req, res) => {
    try{
        let record = await product.findById(req.params.id);
        let categoryRecord = await category.find({});
        let sub_catRecord = await sub_category.find({});
        let extra_catRecord = await extra_category.find({});
        let brand_Record = await brand.find({});
        let type_Record = await type.find({});
        return res.render("update_product", {
            up: record,
            cr : categoryRecord,
            sr : sub_catRecord,
            er: extra_catRecord,
            br: brand_Record,
            tr : type_Record
        });
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// Edit Product data
module.exports.EditProductData = async (req, res) => {    
    try{
            let oldData = await product.findById(req.body.EditId);
            if(req.files){   
                if(req.files.Product_Image)
                {
                    if(oldData.Product_Image){
                        let SinglePath = path.join(__dirname, "..", oldData.Product_Image);
                        await fs.unlinkSync(SinglePath);
                    }
                    var SIimagePath = '';
                    SIimagePath = product.singleImagePath + "/" + req.files.Product_Image[0].filename;
                    req.body.Product_Image = SIimagePath
                }
                
                if(req.files.Product_multi_Image){
                    if(oldData.Product_multi_Image){
                        for(var i=0; i<oldData.Product_multi_Image.length; i++){
                            let MultiplePath = path.join(__dirname, "..", oldData.Product_multi_Image[i]);
                            await fs.unlinkSync(MultiplePath);
                        }
                    }

                var MTimagePath = [];
                 for(var i=0; i<req.files.Product_multi_Image.length; i++){
                     MTimagePath.push(product.multipleImagePath+"/"+req.files.Product_multi_Image[i].filename);
                 }
                 req.body.Product_multi_Image = MTimagePath;
                }
            }            
            req.body.Upadate_Date = new Date().toLocaleString();
            let ad = await product.findByIdAndUpdate(req.body.EditId, req.body);
            if (ad) {
                console.log("Record & Image Update Succesfully");
                return res.redirect('/admin/product/view_product');
            }
            else {
                console.log("Record Not Updated");
                return res.redirect('/admin/product/view_product');
            }
     }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// Delete product
module.exports.deleteProductData = async(req,res)=>{
    try {
        let oldData = await product.findById(req.params.id);
        if (oldData) {
            var oldsingleImage = oldData.Product_Image;
            if (oldsingleImage) {
                let SinglePath = path.join(__dirname, "..", oldData.Product_Image);
                await fs.unlinkSync(SinglePath);
            }
            else{
                console.log("Single image is not found");
                return res.redirect("back");   
            }
            var oldMultipleImage = oldData.Product_multi_Image;
            if(oldMultipleImage){
                for(var i=0; i<oldData.Product_multi_Image.length; i++){
                let MultiplePath = path.join(__dirname, "..", oldData.Product_multi_Image[i]);
                await fs.unlinkSync(MultiplePath);
                }   
            }
            else{
                console.log("Multiple images not found");
                return res.redirect("back");
            }
            
            await product.findByIdAndDelete(req.params.id);
            return res.redirect('back');
        }
        else {
            console.log("Params not found");
            return res.redirect("back");
        }
        
    }
    catch (err) {
        console.log(err);
        return res.redirect("back");
    }
}