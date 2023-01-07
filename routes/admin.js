const express = require('express')
const routes = express.Router();
const path = require('path')
const createError = require('http-errors');
const adminModule = require('../modules/admin');
const admins = require('../models/admins');
const users = require('../models/users');
const categories = require('../models/categories');
const products = require('../models/products');
const coupons = require('../models/coupons');
const orders = require('../models/orders');

/*=======
Setting a layout for all admin pages
========*/
routes.use((req,res,next)=>{
    ///////CHECKING AJAX LOAD OR NOT!
    if(req.query.load){
        req.app.set("layout", path.join(__dirname,'../views/layout/admin-ajax-layout'))
        console.log('Ajax called!');
    }else{
        req.app.set("layout", path.join(__dirname,'../views/layout/admin-layout'))
    }
    next()
})

/*=======
Login page
========*/
routes.get('/login',async (req,res,next)=>{
    let isUserLoggedin = await adminModule.authCheck(req);
    if(isUserLoggedin){
        res.redirect('/admin/')
    }else{
        next();
    }
},
(req,res)=>{
    res.render('./admin/login', {page:'home', pageName:"Login", layout:'layout/admin-base-layout', successLoginAttempt:false})
})


/*=======
Checking whether loggedin or not
========*/
routes.use(async (req,res,next)=>{
    let isUserLoggedin = await adminModule.authCheck(req);
    if(isUserLoggedin){
        res.locals.userData = await admins.findOne({_id:req.session.adminid})
        next();
    }else{
        res.redirect('/admin/login')
    }
})
routes.get('/', async(req,res)=>{
    let usersCount = await users.countDocuments({});
    let catCount = await categories.countDocuments({});
    let prodCount = await products.countDocuments({});
    res.render('./admin/index', {page:'home', pageName:"Dashboard", userData: res.locals.userData, pages: ['dashboard'], usersCount,catCount,prodCount})
})
routes.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/admin/login')
})
routes.get('/users',async (req,res)=>{
    let userslist = await users.find({});

        res.render('./admin/users', {page:'users', pageName:"Users ", userData: res.locals.userData, pages: ['users'],userslist})
    
})
routes.get('/users/update/:id',async (req,res,next)=>{
    let updateuserData = await users.findOne({_id:req.params.id.toString()}).catch((e)=>{
        next(createError(400));
    })
    if(updateuserData){

        res.render('./admin/user-update', {page:'users', pageName:"Users ", userData: res.locals.userData, pages: ['users'],updateuserData})
    }else{
        next(createError(404))
    }
})

routes.get('/categories',async (req,res)=>{
    let catlist = await categories.find({});

        res.render('./admin/category', {page:'category', pageName:"Category ", userData: res.locals.userData, pages: ['category'],catlist})
})


routes.get('/products',async (req,res)=>{
    // let prodlist = await products.aggregate([{$lookup:{from:'categories',localField:'category', foreignField:'_id', as:'catData'}}]);
    let prodlist = await products.find({}).populate('category');
    res.render('./admin/products', {page:'products', pageName:"Products ", userData: res.locals.userData, pages: ['products'], prodlist})
})
routes.get('/products/add',async (req,res)=>{
    let catlist = await categories.find({});

        res.render('./admin/products-add', {page:'products', pageName:"Create Products ", userData: res.locals.userData, pages: ['products','add'],catlist})
})
routes.get('/products/edit/:id',async (req,res,next)=>{
    try {
        
        let catlist = await categories.find({});
        let product = await products.findOne({_id: req.params.id}).populate('category');
         res.render('./admin/products-edit', {page:'products', pageName:"Update Products ", userData: res.locals.userData, pages: ['products','edit',product.name],catlist, product})
    } catch (err) {
        console.log(err);
        next(createError(404))    
    }
})

routes.get('/coupons',async (req,res)=>{
    let couplist = await coupons.find({});

        res.render('./admin/coupons', {page:'coupons', pageName:"Coupons ", userData: res.locals.userData, pages: ['coupons'],couplist})
})
routes.get('/orders',async (req,res)=>{
    let successOrders = await orders.find({order_status:'completed'}).populate('userid').sort({ordered_date:-1})

        res.render('./admin/orders', {page:'orders', pageName:"Orders ", userData: res.locals.userData, pages: ['orders'],successOrders})
})
routes.get('/order/:oid',async (req,res,next)=>{
    try {
        let orderData = await orders.findOne({order_status:'completed',_id:req.params.oid}).populate('products.product_id').populate('userid')
        res.render('./admin/order-view', {page:'orders', pageName:"Order ", userData: res.locals.userData, pages: ['orders','View'],orderData})
    } catch (error) {
     console.log(error);
     next(createError(404))   
    }
})
routes.get('/settings/banner',async (req,res,next)=>{
    res.render('./admin/settings-banner', {page:'banner', pageName:"Banner Management", userData: res.locals.userData, pages: ['settings','banner_management']})  
})

/*=======
catch 404 and forward to error handler
========*/
routes.use(function(req, res, next) {
    next(createError(404));
});

module.exports = routes;