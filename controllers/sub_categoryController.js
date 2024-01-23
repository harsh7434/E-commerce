const category = require('../models/category');
const sub_category = require('../models/sub_category');



// sub category
module.exports.add_sub_category = async(req,res)=>{
   try{
        let categoryData = await category.find({});
        return res.render('add_sub_category',{
        'categoryData' : categoryData
    })     
   }
   catch(err){
        console.log(err);
        return res.redirect("back");
   }
}

// Add Sub category
module.exports.add_subcatData = async(req,res)=>{
    try{
        req.body.isActive = true;
        req.body.create_date = new Date().toLocaleString();
        req.body.updated_date = new Date().toLocaleString();
        let sub_categoryData = await sub_category.create(req.body);
        return res.redirect('back')
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// View Sub category
module.exports.view_sub_category = async(req,res)=>{
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
        let totaladmindata = await sub_category.find({
            $or: [
                { "sub_category_name": { $regex: ".*" + search + ".*", $options: "i" } },
            ]
        }).countDocuments();
        let data = await sub_category.find({
            $or: [
                { "sub_category_name": { $regex: ".*" + search + ".*", $options: "i" } },
            ]
        })
            .limit(parpage)
            .skip(parpage * page)
            .populate('cat_name').exec();
        return res.render("view_sub_category", {
            sub_CategoryData: data,
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
            let activeData = await sub_category.findByIdAndUpdate(req.params.id,{isActive : false});
        
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
            let activeData = await sub_category.findByIdAndUpdate(req.params.id,{isActive : true});

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

// update sub category
module.exports.updatesubcatData = async (req, res) => {
    try{
        let record = await sub_category.findById(req.params.id);
        // console.log(record);
        let categoryRecord = await category.find({});
        // console.log(categoryRecord);
        return res.render("update_sub_category", {
            up: record,
            cr : categoryRecord
        });
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// Edit Sub category data
module.exports.EditSubcatData = async (req, res) => {
    try{
        req.body.isActive = true;
        req.body.updated_date = new Date().toLocaleString();
        await sub_category.findByIdAndUpdate(req.body.EditId, req.body);
        return res.redirect("view_sub_category")
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// Delete sub Category
module.exports.deletesubcatData = async(req,res)=>{
    try{
        await sub_category.findByIdAndDelete(req.params.id);
        return res.redirect("back");
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// Delete All sub Category
module.exports.deleteAllSubCat = async(req,res)=>{
    try{
        await sub_category.deleteMany({ _id: { $in: req.body.deleteall}});
        return res.redirect('back')
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}