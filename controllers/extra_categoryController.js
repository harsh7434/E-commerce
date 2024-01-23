const category = require('../models/category');
const sub_category = require('../models/sub_category');
const extra_category = require('../models/extra_category');
const brand = require('../models/brand');
const type = require('../models/type');
const routes = require('../routes/extra_category');


// extra Category
module.exports.add_ex_category = async(req,res)=>{
    try{
        let categoryData = await category.find({});
        let sub_categoryData = await sub_category.find({});
        return res.render('add_ex_category',{
            'categoryData' : categoryData,
            'sub_categoryData' : sub_categoryData
        });
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// add extra category
module.exports.add_extracatData = async(req,res)=>{
    try{
        req.body.isActive = true;
        req.body.create_date = new Date().toLocaleString();
        req.body.updated_date = new Date().toLocaleString();
        let extra_categoryData = await extra_category.create(req.body);
        return res.redirect('back')
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// view extra category
module.exports.view_ex_category = async(req,res)=>{
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
        let totaladmindata = await extra_category.find({
            $or: [
                { "extra_category_name": { $regex: ".*" + search + ".*", $options: "i" } },
            ]
        }).countDocuments();
        let data = await extra_category.find({
            $or: [
                { "extra_category_name": { $regex: ".*" + search + ".*", $options: "i" } },
            ]
        })
            .limit(parpage)
            .skip(parpage * page)
            .populate(['extracat_name','extra_sub_category_name']).exec()
        return res.render("view_ex_category", {
            extra_CategoryData: data,
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
            let activeData = await extra_category.findByIdAndUpdate(req.params.id,{isActive : false});
        
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
            let activeData = await extra_category.findByIdAndUpdate(req.params.id,{isActive : true});

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

// update Extra category
module.exports.updateExtraData = async (req, res) => {
    try{
        let record = await extra_category.findById(req.params.id);
        let categoryRecord = await category.find({});
        let sub_catRecord = await sub_category.find({});
        return res.render("update_extraCat", {
            up: record,
            cr : categoryRecord,
            sr : sub_catRecord
        });
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// Edit Sub category data
module.exports.EditExtraData = async (req, res) => {
    try{
        req.body.isActive = true;
        req.body.updated_date = new Date().toLocaleString();
        await extra_category.findByIdAndUpdate(req.body.EditId, req.body);
        return res.redirect("view_ex_category")
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// Delete Extra Category
module.exports.deleteexcatData = async(req,res)=>{
    try{
        await extra_category.findByIdAndDelete(req.params.id);
        return res.redirect("back");
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// Delete All Extra Category
module.exports.deleteAllExtraCat = async(req,res)=>{
    try{
        await extra_category.deleteMany({ _id: { $in: req.body.deleteall}});
        return res.redirect('back')
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// get Subcategory
module.exports.getSubcat = async (req, res) => {
    try{
        let subcatData = await sub_category.find({cat_name : req.body.catid});
        var optionData = `<option value="">-- selecte-subcategary --</option>`;
        subcatData.map((v,i)=>{
            optionData += `<option value="${v.id}">${v.sub_category_name}</option>`
        })
        return res.json(optionData);
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// get extra category
module.exports.getExtra = async (req, res) => {
    try{
        let extraData = await extra_category.find({extra_sub_category_name : req.body.subid});
        var optionData = `<option value="">-- selecte Extra Category --</option>`;
        extraData.map((v,i)=>{
            optionData += `<option value="${v.id}">${v.extra_category_name}</option>`
        })
        return res.json(optionData);
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

module.exports.getBrandTypeData = async(req,res)=>{
    let brandData = await brand.find({'brandSubCat_name' : req.body.subCatId,"brandcat_name":req.body.categoryId , 'brandExtra_name' : req.body.extraCatId});
    let typeData = await type.find({'typeSubCat_name' : req.body.subCatId,"typecat_name":req.body.categoryId , 'typeExtra_name' : req.body.extraCatId});
    return res.render("ajaxBrandType",{
        brand : brandData,
        type : typeData
    })
}