const express = require('express');
const routes = express.Router();

const userController = require('../controllers/userController');
const product = require('../models/product');
const passport = require('passport');
const cart = require('../models/cart');
// const stripe = require('stripe')("sk_test_wFSjCKx4AW07JCc87b2fUwhH00zzjnRSJv");


routes.get('/',userController.home);
routes.get('/productList/:catId/:subId/:extraId',userController.productList);
routes.post('/ajexPriceFilter',userController.ajexPriceFilter);
routes.post('/ajexBrandFilter', userController.ajexBrandFilter);
routes.post('/ajexcolorFilter', userController.ajexcolorFilter);

routes.get('/product_detais/:id',userController.product_detais);

routes.get('/userLogin',userController.userLogin);
routes.post('/userRegister',userController.userRegister);
routes.post('/checkuserLogin',passport.authenticate('user',{failureRedirect:'/userLogin'}),userController.checkuserLogin);

routes.post('/insertCart',passport.checkUserAuthentication,userController.insertCart);
routes.get('/viewcart',passport.checkUserAuthentication,userController.viewcart);

routes.post('/changeQuantity', passport.checkUserAuthentication , userController.changeQuantity);
routes.get('/deleteCart/:id', passport.checkUserAuthentication, userController.deleteCart);

routes.get('/checkout', passport.checkUserAuthentication , userController.checkout);
routes.post('/payment',passport.checkUserAuthentication,userController.payment);

// routes.post('/payment', async(req,res)=>{
//     let countCart;
//     if(req.user){
//         countCart = await cart.find({userId:req.user.id,status:'pending'}).countDocuments();
//         cartPendingData = await cart.find({userId:req.user.id,status:'pending'}).populate('productId').exec();
//     }
//     return res.render('userPanel/payment',{
//         cartData : cartPendingData
//     })
// })
// routes.post('/payment',async function(res,req){
//     let countCart;
//     if(req.user){
//         countCart = await cart.find({userId:req.user.id,status:'pending'}).countDocuments();
//         cartPendingData = await cart.find({userId:req.user.id,status:'pending'}).populate('productId').exec();
//     }
//     var sum =0; var i=1;
//     for(var cd of cartPendingData){
//         var total = cd.quantity * cd.productId.product_price;
//         sum += sum + total;
//         ++i;
//     }
//     sum = sum *100;

//     stripe.customers.create({
//         email: req.body.stripeEmail,
//         source: req.body.stripeToken,
//         name: req.user.name,
//     })
//     .then((customer) => {

//         return stripe.charges.create({
//             amount: sum,  
//             description: 'Web Development',
//             currency: 'INR',
//             customer: customer.id
//         });
//     })
//     .then(async(charge) => {
//           // If no error occurs
//         let proID = [];
//         let cartID = [];

//         cartPendingData.forEach((v,i)=>{
//             proID.push(v.productId);
//             cartID.push(v.id);
//         })

//         let orderobj = {
//             userId  : req.user.id,
//             productId : proID,
//             cartID : cartID,
//             status : 'confirm'
//         }

//         await cart.create(orderobj);

//         cartID.forEach(async(v,i)=>{
//             await cart.findByIdAndUpdate(v,{status : 'confirm'})
//         })

//         res.send("Success")
//     })
//     .catch((err) => {
//         res.send(err)       // If some error occurs
//     });
// })

module.exports = routes;