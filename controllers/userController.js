const category = require('../models/category');
const subcategory = require('../models/sub_category');
const extracategory = require('../models/extra_category');
const product = require('../models/product');
const user = require('../models/user');
const cart = require('../models/cart');
const bcrypt = require('bcrypt');
var stripe = require('stripe')("sk_test_wFSjCKx4AW07JCc87b2fUwhH00zzjnRSJv");

module.exports.home = async (req,res)=>{
    try{
        let categoryData = await category.find({});
        let subcatData = await subcategory.find({});
        let extracatData = await extracategory.find({});

        let countCart;
        if(req.user){
            countCart = await cart.find({userId:req.user.id,status:'pending'}).countDocuments();
        }

        return res.render('userPanel/home',{
            'categoryData' : categoryData,
            'subcatData' : subcatData,
            'extracatData' : extracatData,
            'countCart' : countCart?countCart:0,
        });
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

module.exports.productList = async (req,res)=>{
    let categoryData = await category.find({});
    let subcatData = await subcategory.find({});
    let extracatData = await extracategory.find({});
    let proData = await product.find({'procat_name':req.params.catId,'proSubCat_name':req.params.subId,'proExtra_name':req.params.extraId}).populate('probrand_name').exec();

    let countCart;
    if(req.user){
        countCart = await cart.find({userId:req.user.id,status:'pending'}).countDocuments();
    }

    let proprice = [];
    let brandname = [];
    let color = [];
   
    proData.forEach((v,i)=>{
        proprice.push(parseInt(v.product_price));
        color.push({name : v.product_color, id : v.id});
        let pos = brandname.findIndex((v1,i1)=>{v1.id==v.probrand_name.id});
        if(pos == -1){
            brandname.push({id : v.probrand_name.id, name : v.probrand_name.brand_name});
        }
    })

    var brandNew = [];
    brandname.map((v,i)=>{
        let pos = brandNew.findIndex((v1,i1)=>v1.name == v.name);
        if(pos == -1){
            brandNew.push(v);
        }
    })

    var colorNew = [];
    color.map((v,i)=>{
        let pos = colorNew.findIndex((v1,i1)=>v1.name == v.name);
        if(pos == -1){
            colorNew.push(v);
        }
    })

    var max = Math.max(...proprice);
    var min = Math.min(...proprice);

    return res.render('userPanel/productList',{
        'categoryData' : categoryData,
        'subcatData' : subcatData,
        'extracatData' : extracatData,
        'proData' : proData,
        'max' : max,
        'min' : min,
        'brandList' : brandNew,
        'colorList' : colorNew,
        'countCart' : countCart?countCart:0,
    });
}


module.exports.ajexPriceFilter = async(req,res)=>{
    let productData = await product.find({'procat_name':req.body.cId,'proSubCat_name':req.body.sId,'proExtra_name':req.body.extraId}).find({product_price : {$gte : req.body.price_min, $lte : req.body.price_max}});
    return res.render('userPanel/ajexPriceFilter',{
        proData : productData
    })
}

module.exports.ajexBrandFilter = async(req,res)=>{
    let productData = await product.find({'procat_name':req.body.cId,'proSubCat_name':req.body.sId,'proExtra_name':req.body.extraId,'probrand_name': req.body.brandId});
    return res.render('userPanel/ajexPriceFilter',{
        proData : productData
    })
}
module.exports.ajexcolorFilter = async(req,res)=>{
    let productData = await product.find({'procat_name':req.body.cId,'proSubCat_name':req.body.sId,'proExtra_name':req.body.extraId,'product_color': req.body.procolorname});
    return res.render('userPanel/ajexPriceFilter',{
        proData : productData
    })
}

module.exports.product_detais = async (req,res)=>{
    let categoryData = await category.find({});
    let subcatData = await subcategory.find({});
    let extracatData = await extracategory.find({});
    let singleproData = await product.findById(req.params.id);

    let countCart;
    if(req.user){
        countCart = await cart.find({userId:req.user.id,status:'pending'}).countDocuments();
    }

    return res.render('userPanel/product_detais',{
        'categoryData' : categoryData,
        'subcatData' : subcatData,
        'extracatData' : extracatData,
        'spData' : singleproData,
        'countCart' : countCart?countCart:0,
    })
}


module.exports.userLogin = async(req,res)=>{
    let categoryData = await category.find({});
    let subcatData = await subcategory.find({});
    let extracatData = await extracategory.find({});

    let countCart;
    if(req.user){
        countCart = await cart.find({userId:req.user.id,status:'pending'}).countDocuments();
    }
    
    return res.render('userPanel/userLogin',{
        'categoryData' : categoryData,
        'subcatData' : subcatData,
        'extracatData' : extracatData,
        'countCart' : countCart?countCart:0,
    })
}

module.exports.userRegister = async(req,res)=>{
    req.body.role = 'user';
    req.body.create_date = new Date().toLocaleString();
    req.body.updated_date = new Date().toLocaleString();

    let checkemail = await user.findOne({email:req.body.email});
    if(checkemail){
        console.log("Email already register");
        return res.redirect('back');
    }
    else{
        if(req.body.password == req.body.cpassword){
            req.body.password = await bcrypt.hash(req.body.password,10);
            await user.create(req.body);
            return res.redirect('/');
        }
        else{
            console.log("Password not match");
            return res.redirect('back');
        }
    }

}

module.exports.checkuserLogin = async(req,res)=>{
    try{
        return res.redirect('/');
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}


module.exports.insertCart = async(req,res)=>{
    try{
        let cartProduct = await cart.findOne({productId : req.body.productId,userId:req.user.id});
        if(cartProduct){
            console.log("Product is already into cart");
            return res.redirect("back");
        }
        else{
            req.body.userId = req.user.id;
            req.body.status = "pending";
            req.body.create_date = new Date().toLocaleString();
            req.body.updated_date = new Date().toLocaleString();
            let AddCart = await cart.create(req.body);
            if(AddCart){
                console.log("Product add into cart");
                return res.redirect("back");
            } 
            else{
                console.log("something is wrong");
                return res.redirect("back");
            }
        }
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}


module.exports.viewcart = async(req,res)=>{
    try{
        let countCart;
        if(req.user){
            countCart = await cart.find({userId:req.user.id,status:'pending'}).countDocuments();
            cartPendingData = await cart.find({userId:req.user.id,status:'pending'}).populate('productId').exec();
        }
        let categoryData = await category.find({});
        let subcatData = await subcategory.find({});
        let extracatData = await extracategory.find({});

        return res.render('userPanel/viewcart',{
            'cartData' : cartPendingData,
            'categoryData' : categoryData,
            'subcatData' : subcatData,
            'extracatData' : extracatData,
            'countCart' : countCart
        })
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}


module.exports.changeQuantity = async(req,res)=>{
    try{
        await cart.findByIdAndUpdate(req.body.cartId,{quantity : req.body.quantity});
        return res.status(200).json({msg: "Successfully change "});
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}



module.exports.deleteCart = async(req,res)=>{
    try{
       let de = await cart.findByIdAndDelete(req.params.id)
       if(de){
            console.log("Cart delete successfully");
            return res.redirect('back');
        }
        else{
            console.log("Record not found");
            return res.redirect('back');
        }
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}


module.exports.checkout = async(req,res)=>{
    try{
        let countCart;
        if(req.user){
            countCart = await cart.find({userId:req.user.id,status:'pending'}).countDocuments();
            cartPendingData = await cart.find({userId:req.user.id,status:'pending'}).populate('productId').exec();
        }
        let categoryData = await category.find({});
        let subcatData = await subcategory.find({});
        let extracatData = await extracategory.find({});

        return res.render('userPanel/checkout',{
            'cartData' : cartPendingData,
            'categoryData' : categoryData,
            'subcatData' : subcatData,
            'extracatData' : extracatData,
            'countCart' : countCart
        })
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}


module.exports.payment = async(req,res)=>{
    try{
       
        var countCart = await cart.find({userId:req.user.id,status:'pending'}).countDocuments();
        cartPendingData = await cart.find({userId:req.user.id,status:'pending'}).populate('productId').exec();
    var sum =0; var i=1;
    for(var cd of cartPendingData){
        var total = cd.quantity * cd.productId.product_price;
        sum += sum + total;
        ++i;
    }
    sum = sum *100;

    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Gourav Hammad',
        address: {
            line1: 'TC 9/4 Old MES colony',
            postal_code: '452331',
            city: 'Indore',
            state: 'Madhya Pradesh',
            country: 'India',
        }
    })
    .then((customer) => {

        return stripe.charges.create({
            amount: sum,  
            description: 'Web Development',
            currency: 'INR',
            customer: customer.id
        });
    })
    .then(async(charge) => {
          // If no error occurs
        let proID = [];
        let cartID = [];

        cartPendingData.forEach((v,i)=>{
            proID.push(v.productId);
            cartID.push(v.id);
        })

       
        req.body.userId = req.user.id;
        req.body.productId = proID;
        req.body.cartID = cartID;
        req.body.status = 'confirm';

        var upcart =  await cart.create(req.body);
        if(upcart){
            cartPendingData.map(async(v,i)=>{
                await cart.findByIdAndUpdate(v.id,{status:"confirm"})
            })
           return res.redirect('/')
        }

        cartID.forEach(async(v,i)=>{
            await cart.findByIdAndUpdate(v,{status : 'confirm'})
        })

        res.send("Success")
    })
    .catch((err) => {
        res.send(err)       // If some error occurs
    });
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}






