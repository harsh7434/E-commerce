const category = require('../models/category');


// Add category
module.exports.add_category = async(req,res)=>{
    try{
        req.body.isActive = true;
        req.body.create_date = new Date().toLocaleString();
        req.body.updated_date = new Date().toLocaleString();
        let categoryData = await category.create(req.body);
        return res.redirect('back')
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// View Category
module.exports.view_category = async(req,res)=>{
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
        let totaladmindata = await category.find({
            $or: [

                { "category_name": { $regex: ".*" + search + ".*", $options: "i" } },
            ]
        }).countDocuments();
        let data = await category.find({
            $or: [

                { "category_name": { $regex: ".*" + search + ".*", $options: "i" } },
            ]
        })
            .limit(parpage)
            .skip(parpage * page);
        return res.render("view_category", {
            CategoryData: data,
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
            let activeData = await category.findByIdAndUpdate(req.params.id,{isActive : false});
        
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
            let activeData = await category.findByIdAndUpdate(req.params.id,{isActive : true});

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

// update category
module.exports.updatecategoryData = async (req, res) => {
    try{
        let record = await category.findById(req.params.id);
        return res.render("update_category", {
            up: record,
        });
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// Edit category data
module.exports.EditCategoryData = async (req, res) => {
    try{
        req.body.isActive = true;
        req.body.updated_date = new Date().toLocaleString();
        await category.findByIdAndUpdate(req.body.EditId, req.body);
        return res.redirect("view_category")
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// Delete Category
module.exports.deletecategoryData = async(req,res)=>{
    try{
        await category.findByIdAndDelete(req.params.id);
        return res.redirect("back");
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// Delete All Category
module.exports.deleteAllcategory = async(req,res)=>{
    try{
        await category.deleteMany({ _id: { $in: req.body.deleteall}});
        return res.redirect('back')
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}