const category = require('../models/category');
const sub_category = require('../models/sub_category');
const extra_category = require('../models/extra_category');
const brand = require('../models/brand');
const type = require('../models/type');


// type
module.exports.add_type = async(req,res)=>{
    try{
        let categoryData = await category.find({});
        let subCatData = await sub_category.find({});
        let extraData = await extra_category.find({});
        let brandData = await brand.find({});
        return res.render('add_type',{
            'categoryData' : categoryData,
            'subCatData' : subCatData,
            'extraData' : extraData,
            'brandData' :brandData
        });
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// add Type
module.exports.add_TypeData = async(req,res)=>{
    try{
        req.body.isActive = true;
        req.body.create_date = new Date().toLocaleString();
        req.body.updated_date = new Date().toLocaleString();
        let typeData = await type.create(req.body);
        return res.redirect('back')
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// view Type
module.exports.view_type = async(req,res)=>{
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
        let totaladmindata = await type.find({
            $or: [
                { "type_name": { $regex: ".*" + search + ".*", $options: "i" } },
            ]
        }).countDocuments();
        let data = await type.find({
            $or: [
                { "type_name": { $regex: ".*" + search + ".*", $options: "i" } },
            ]
        })
            .limit(parpage)
            .skip(parpage * page)
            .populate(['typecat_name','typeSubCat_name','typeExtra_name']).exec()
        return res.render("view_type", {
            TypeData: data,
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
            let activeData = await type.findByIdAndUpdate(req.params.id,{isActive : false});
        
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
            let activeData = await type.findByIdAndUpdate(req.params.id,{isActive : true});

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

// update Type
module.exports.updateTypeData = async (req, res) => {
    try{
        let record = await type.findById(req.params.id);
        let categoryRecord = await category.find({});
        let sub_catRecord = await sub_category.find({});
        let extra_catRecord = await extra_category.find({});
        return res.render("update_type", {
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

// Edit Type data
module.exports.EditTypeData = async (req, res) => {
    try{
        req.body.isActive = true;
        req.body.updated_date = new Date().toLocaleString();
        await type.findByIdAndUpdate(req.body.EditId, req.body);
        return res.redirect("view_type")
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// Delete Type
module.exports.deleteTypeData = async(req,res)=>{
    try{
        await type.findByIdAndDelete(req.params.id);
        return res.redirect("back");
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// Delete All Type
module.exports.deleteAllType = async(req,res)=>{
    try{
        await type.deleteMany({ _id: { $in: req.body.deleteall}});
        return res.redirect('back')
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}