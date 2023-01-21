const express = require('express')
const routes = express.Router();
const path = require('path');
const users = require('../models/users');
const usersModules = require('../modules/users')
const createError = require('http-errors');
const products = require('../models/products');
const orders = require('../models/orders');

routes.use((req,res,next)=>{
    req.app.set("layout", path.join(__dirname,'../views/layout/user-layout'))
    next()
})

//cache clearing... 
routes.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
next();
});

/*=======
Checking whether loggedin or not
========*/
routes.use(async (req,res,next)=>{
    let isUserLoggedin = await usersModules.authCheck(req);
    if(isUserLoggedin){
        res.locals.userData = await users.findOne({_id:req.session.userid})
        res.locals.login = true;
        if(res.locals.userData.status == 'active'){

            next();
        }else{
            next(createError(401));

        }
    }else{
        res.redirect('/auth/login/?backto='+req.originalUrl)
    }
})

/*=======
Pages
========*/
routes.get('/verify',(req,res)=>{
    res.render('user/dash/smsotp', {pageName: ' Verify | Dashboard',dashPage:'Verify', login:res.locals.login, userData:res.locals.userData})
})
routes.get('/verify/:key/:id',(req,res)=>{
    if(res.locals.userData.email_verified){
        res.render('user/dash/verifyemailtemplate', {pageName: ' Email verification | Dashboard',dashPage:'Email verification', login:res.locals.login, userData:res.locals.userData, emailVerificationSuccess:false})
    }else{
        if(res.locals.userData.email_id == req.params.key && res.locals.userData._id == req.params.id){
            users.updateOne({_id:res.locals.userData._id},{$set:{email_id:'', email_verified:true}}).then(()=>console.log('Userverification updated!')).then((err)=>console.log(err))
            res.render('user/dash/verifyemailtemplate', {pageName: ' Email verification | Dashboard',dashPage:'Email verification', login:res.locals.login, userData:res.locals.userData, emailVerificationSuccess:true})
            
        }else{
            res.render('user/dash/verifyemailtemplate', {pageName: ' Email verification | Dashboard',dashPage:'Email verification', login:res.locals.login, userData:res.locals.userData, emailVerificationSuccess:false})
        }
    }
})

routes.use((req,res,next)=>{
    if(res.locals.userData.phone_verified){
        next();
    }else{
        res.redirect('/dash/verify/')
    }
})
routes.get('/profile',(req,res)=>{
    res.render('user/dash/profile', {pageName: 'Profile | Dashboard',dashPage:'profile', login:res.locals.login, userData:res.locals.userData})
})
routes.get('/settings',(req,res)=>{
    res.render('user/dash/settings', {pageName: 'Settings | Dashboard',dashPage:'settings', login:res.locals.login, userData:res.locals.userData})
})
routes.get('/orders',async (req,res)=>{
    let ordersList = await orders.find({userid:res.locals.userData._id, order_status:'completed'}).sort({ordered_date:-1})
    res.render('user/dash/orders', {pageName: 'Orders | Dashboard',dashPage:'orders', login:res.locals.login, userData:res.locals.userData, ordersList})
})
routes.get('/order/:id',async (req,res,next)=>{
    try {
        let orderData = await orders.findOne({userid:res.locals.userData._id, _id:req.params.id, order_status:'completed'}).populate('products.product_id')
        
        if(orderData){
            res.render('user/dash/orderView', {pageName: 'Order | Dashboard',dashPage:'orders', login:res.locals.login, userData:res.locals.userData, orderData})
        }else{
            next(createError(404))
        }
    } catch (error) {
        next(createError(404))
    }
})

routes.get('/cart',async(req,res,next)=>{
    try {
        
        
        let cartData = await users.findById(res.locals.userData._id)
        let cartIdArr = cartData.cart.map((val)=>{
            return val.product_id
        })
        let productlist = await products.aggregate([{$unwind: "$sizes"},{$match:{"sizes._id":{$in:cartIdArr}}}])
        let prodData=productlist.map((val,i)=>{
            let thisQnty = cartData.cart.reduce((qnty, val2)=>{
                if(val2.product_id.toString()==val.sizes._id.toString()){
                    qnty = val2.quantity;
                }
                return qnty;
            },0)
            let dataTOreturn = {
                id: val.sizes._id,
                name:val.name,
                discription:val.discription,
                price:val.sizes.price,
                size:val.sizes.name,
                qnty: thisQnty,
                total:thisQnty*val.sizes.price,
                limit:val.sizes.stock
            }
            if(val.image[0]){ //set img only if it's exist
                dataTOreturn.image=val.image[0]
            }
            return dataTOreturn;
        })
        res.render('user/dash/cart', {pageName: 'Cart',prodData})
    } catch (err) {
        console.log(err);
        next(createError(500))
    }
})

routes.get('/cart/checkout/:id',async(req,res,next)=>{
    let today = new Date();
    today = today.getDate().toString()+today.getMonth().toString()+today.getFullYear().toString()
    let userCheckout
    try {
         userCheckout = await orders.findOne({_id:req.params.id, userid:res.locals.userData._id,order_status:'pending'})
         
    } catch (error) {
        console.log(error);
    }finally{
        console.log(userCheckout);
        if(userCheckout){
            res.render('user/dash/checkout', {pageName: 'Checkout',userCheckout})
        }else{
            next(createError(404))
        }
    }
    
})

routes.get('/wishlist',async(req,res)=>{
    let wishlistData = await users.aggregate([{$match:{_id:res.locals.userData._id}},{$lookup:{from: 'products', localField:'wishlist', foreignField:'_id', as:'wishData'}}])
    wishlistData = wishlistData[0];
    res.render('user/dash/wishlist', {pageName: 'Wishlist | Dashboard',dashPage:'wishlist', login:res.locals.login, userData:res.locals.userData,wishlistData})
})

module.exports = routes;