const category = require('../models/category');
const sub_category = require('../models/sub_category');
const extra_category = require('../models/extra_category');
const brand = require('../models/brand');


// brand
module.exports.add_brand = async(req,res)=>{
    try{
        let categoryData = await category.find({});
        let subCatData = await sub_category.find({});
        let extraData = await extra_category.find({});
        return res.render('add_brand',{
            'categoryData' : categoryData,
            'subCatData' : subCatData,
            'extraData' : extraData
        });
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// add brand
module.exports.add_BrandData = async(req,res)=>{
    try{
        req.body.isActive = true;
        req.body.create_date = new Date().toLocaleString();
        req.body.updated_date = new Date().toLocaleString();
        let brandData = await brand.create(req.body);
        return res.redirect('back')
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// view brand
module.exports.view_brand = async(req,res)=>{
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

        var parpage = 2;
        let totaladmindata = await brand.find({
            $or: [
                { "brand_name": { $regex: ".*" + search + ".*", $options: "i" } },
            ]
        }).countDocuments();
        let data = await brand.find({
            $or: [
                { "brand_name": { $regex: ".*" + search + ".*", $options: "i" } },
            ]
        })
            .limit(parpage)
            .skip(parpage * page)
            .populate(['brandcat_name','brandSubCat_name','brandExtra_name']).exec()
        return res.render("view_brand", {
            BrandData: data,
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

// de-active data
module.exports.setDeactive = async(req,res)=>{
    try{
        if(req.params.id)
        {
            let activeData = await brand.findByIdAndUpdate(req.params.id,{isActive : false});
        
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
            let activeData = await brand.findByIdAndUpdate(req.params.id,{isActive : true});

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

// update Brand
module.exports.updateBrandData = async (req, res) => {
    try{
        let record = await brand.findById(req.params.id);
        let categoryRecord = await category.find({});
        let sub_catRecord = await sub_category.find({});
        let extra_catRecord = await extra_category.find({});
        return res.render("update_brand", {
            up: record,
            cr : categoryRecord,
            sr : sub_catRecord,
            er : extra_catRecord
        });
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// Edit Brand data
module.exports.EditBrandData = async (req, res) => {
    try{
        req.body.isActive = true;
        req.body.updated_date = new Date().toLocaleString();
        await brand.findByIdAndUpdate(req.body.EditId, req.body);
        return res.redirect("view_brand")
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// Delete brand
module.exports.deleteBrandData = async(req,res)=>{
    try{
        await brand.findByIdAndDelete(req.params.id);
        return res.redirect("back");
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// Delete All Brand
module.exports.deleteAllBrand = async(req,res)=>{
    try{
        await brand.deleteMany({ _id: { $in: req.body.deleteall}});
        return res.redirect('back')
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}
