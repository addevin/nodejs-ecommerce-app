const express = require('express')
const routes = express.Router();
const path = require('path');
const categories = require('../models/categories');
const users = require('../models/users');
const usersModules = require('../modules/users')
const products = require('../models/products');
const createError = require('http-errors');
const banners = require('../models/banners');


routes.use((req,res,next)=>{
    req.app.set("layout", path.join(__dirname,'../views/layout/user-layout'))
    next()
})

/*=======
Checking whether loggedin or not
========*/
routes.use(async (req,res,next)=>{
    let isUserLoggedin = await usersModules.authCheck(req);
    res.locals.catList = await categories.find({}) ;
    if(isUserLoggedin){
        res.locals.userData = await users.findOne({_id:req.session.userid})
        res.locals.login = true;
        next();
    }else{
        res.locals.userData = {username:'',name:''}
        res.locals.login = false;
        next();
    }
})

/*=======
Pages
========*/
routes.get('/',async (req,res)=>{
    let bannerList = await banners.find({})
    res.render('user/index', {pageName: 'Home', login:res.locals.login, userData:res.locals.userData, catList:res.locals.catList, bannerList})
})
routes.get('/about',(req,res)=>{
    res.render('user/about', {pageName: 'About Us'})
})
routes.get('/shop',async (req,res,next)=>{
    let productsList;
    let typeData = {
        type: 'listing',
        key:null
    }
    if(req.query.cat){
        try {
            
            productsList = await products.find({category:req.query.cat}).populate('category')
        } catch (error) {
            console.log(error);
            next(createError(404))
        }
        typeData.type = 'catlisting'
    }else if(req.query.q){
        typeData.type = 'qlisting'
        typeData.key = req.query.q.toString()

        try {
            let skey = req.query.q;
            // productsList  = await products.find({ name: { $regex: new RegExp('^'+req.query.q.toString()+'.*','i')}})
            let regex = new RegExp('^'+skey+'.*','i');
            productsList  = await products.aggregate([{$match:{ $or: [{name: regex },{discription: regex},{specification: regex},{tags: regex}] }}])
        } catch (error) {
            console.log(error);
            next(createError(404))
        }
    }else{
         productsList = await products.find({})
    }
    let catlist = await categories.find({});
    console.log(catlist);
    res.render('user/shop', {pageName: 'Shop',catlist, productsList, typeData})
})

routes.get('/product/:size/:id',async (req,res,next)=>{

    try {
        let product = await products.findOne({_id:req.params.id})
        if(product.sizes.length>=req.params.size){
            res.render('user/product', {pageName: product.name, product,selectedSize:req.params.size})
        }else{
            next(createError(404))
        }
        
    } catch (error) {
        console.log(error);
        next(createError(404))
    }
})
routes.get('/contact',(req,res)=>{
    res.render('user/contact', {pageName: 'Contact Us'})
})



module.exports = routes;