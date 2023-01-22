const express = require('express')
const routes = express.Router();
const path = require('path');
const users = require('../models/users');
const usersModules = require('../modules/users')
const createError = require('http-errors')


routes.use((req,res,next)=>{
    req.app.set("layout", path.join(__dirname,'../views/layout/base-layout'))
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
routes.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/auth/login');
})
routes.use(async (req,res,next)=>{
    let isUserLoggedin = await usersModules.authCheck(req);
    if(isUserLoggedin){
        res.locals.login = true;
        if(req.query.backto){

            res.redirect(req.query.backto);
        }else{
            res.redirect('/');

        }
    }else{
        res.locals.login = false;
        next();
    }
})


routes.get('/login',(req,res)=>{
    res.render('./auth/login', {pageName: "Login"})
})
routes.get('/register',(req,res)=>{
    res.render('./auth/register', {pageName: "Register"})
}) 
routes.get('/reset',(req,res)=>{
    res.render('./auth/forgot', {pageName: "Reset Password"})
}) 
routes.get('/reset/:key/:id',async (req,res,next)=>{
    try {
        let uData = await users.findOne({_id:req.params.id})
        if(uData){
            if(uData.email_id==req.params.key){
                res.render('./auth/reset', {pageName: "Reset Password", validated:true, key:req.params.key, id:req.params.id })
            }else{
                res.render('./auth/reset', {pageName: "Reset Password", validated:false})
            }
        }
    } catch (err) {
        console.log(err);
        next(createError(400))
    }
    
    // res.render('./auth/reset', {pageName: "Reset Password", validated:false})
}) 


routes.get('/test',(req,res)=>{
    res.render('./auth/testLogin', {pageName: "Login"})
})

module.exports = routes;