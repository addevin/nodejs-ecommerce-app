const express = require('express')
const app = express()
const path = require("path")
const ejsLayout = require('express-ejs-layouts')
const createError = require('http-errors')
const logger = require("morgan")
const mongoose = require('mongoose')
const dotenv = require("dotenv")
const session = require("express-session")
const  mainModule  = require('./modules/main')



//cache clearing... 
app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
next();
});




/**DB CONFIG */
dotenv.config()
mongoose.connect(process.env.DB_SECRET+process.env.DB_NAME).then(()=>console.log('Db connected...'))
.catch((err)=>{
    console.log(err)
    next(createError(500))
})



const adminRoutes = require('./routes/admin')
const userRoutes = require('./routes/user')
const authRoutes = require('./routes/auth')
const apiRoutes = require('./routes/api') 
const adminapiRoutes = require('./routes/adminApi') 
const userDashRoutes = require('./routes/userdash') 


app.use(express.static(path.join(__dirname,"public")))
app.use('/shop',express.static(path.join(__dirname,"public/uploads/product")))
app.use('/cat',express.static(path.join(__dirname,"public/uploads/category")))
app.use(logger('dev'))
app.use(ejsLayout)
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({secret: mainModule.randomGen(15), cookie:{maxAge:60000000000}}))

app.set("view engine", "ejs")
app.set("layout", path.join(__dirname,'views/layout/base-layout'))
app.set("views", path.join(__dirname,'views'))


app.use('/admin',adminRoutes)
app.use('/',userRoutes)
app.use('/auth',authRoutes)
app.use('/api',apiRoutes)
app.use('/adminapi',adminapiRoutes)
app.use('/dash',userDashRoutes)




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});
  
  // error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    let errStatus = err.status || 500;
    // render the error page
    console.log(err);
    res.status(errStatus);
    if(errStatus==404){ //401 Unauthorized
        res.render('error/404',{pageName:"404 Page not found", page:"err",userData: res.locals.userData, pages: ['404_page_not_found'],});
    }else if(errStatus==401){ //401 Unauthorized
        res.render('error/401',{pageName:"401 Unauthorized", page:"err",userData: res.locals.userData, pages: ['401_unauthorized'],});
    }else if(errStatus==400){ //401 Unauthorized
        res.render('error/400',{pageName:"400 Bad Request", page:"err",userData: res.locals.userData, pages: ['400_bad_request'],});
    }else{
        res.send('<div style="font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif; text-align:center;"><h2 style="color:red;">500 |  Internal error detucted!</h2> We will be back soon..</div>')
        // res.render('error');
    }
});


const PORT = process.env.PORT || 80;
app.listen(PORT, ()=>{
    console.log('Server is running...');
    console.log('\x1b[33m%s\x1b[0m', "developed by :"+
    "\n  __   __    ____  ____  ____  _  _  _ __  \n / /  /__\\  (  _ \\(  _ \\( ___)( \\/ )/ )\\ \\ \n< <  /(__)\\  )(_) ))(_) ))__)  \\  // /  > > \n \\_\\(__)(__)(____/(____/(____)  \\/(_/  /_/ ")
})


/*    const protocol = req.protocol;
    const host = req.hostname;
    const url = req.originalUrl;
    const port = process.env.PORT || PORT;

    const fullUrl = `${protocol}://${host}:${port}${url}`
    
    const responseString = `Full URL is: ${fullUrl}`;
    */