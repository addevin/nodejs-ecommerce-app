// let express = require('express')
// let app = express();
let bcrypt = require('bcrypt')
const path = require('path')
var fs = require('fs');
const sharpe = require('sharp')


var mainFunctions = {
    randomGen: (length)=>{
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        // console.log(makeid(5));
    },
    validateEmail : (email) => {
        return email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    },
    hashPassword:  (plaintextPassword)=>{
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(plaintextPassword, salt);
        return hash
           
    },
    hashPasswordvalidate : async (plaintextPassword, hash)=> {
        const result = await bcrypt.compare(plaintextPassword, hash)
        return result;
    },
    mailer: (data)=>{
        //https://account.sendinblue.com/advanced/api
        var nodemailer = require('nodemailer');

            var transporter = nodemailer.createTransport({
                host: "smtp-relay.sendinblue.com",
                port: 587,
            auth: {
                user: 'addev.connect@gmail.com',
                pass: '6NQFrDCIn1ajMbkG'
            }
            });

            var mailOptions = data.mailOptions;
            /* {
            from: 'addev.connect@gmail.com',
            to: 'adil.akp1@gmail.com',
            subject: 'Sending Email using Node.js',
            text: 'That was easy!'
            };*/

            transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
            });
    },
    uploadimage: async function(req,toDir,prefix,crop){
        return new Promise( async(resolve,reject)=>{
            
            let dataToReturn = {message:'No data is available!', error:'No error'}
            const tempPath = req.file.path;
            const newFileName = prefix+this.randomGen(15)+path.extname(req.file.originalname).toLowerCase();
            const targetPath = path.join(__dirname, "../public/uploads/"+toDir+"/"+newFileName);
            const ext = path.extname(req.file.originalname).toLowerCase();
            console.log('temp path :'+tempPath);
            if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
                
                if(crop){
                    this.cropImage(tempPath,targetPath,(err)=>{
                        if (err) {
                            dataToReturn.error = err;
                            reject(new Error('Internal server error detucted!'));
                            console.log(err);
                        }
                    })
                }else{
                    fs.renameSync(tempPath, targetPath, err => {
                        if (err) {
                            dataToReturn.error = err;
                            reject(new Error('Internal server error detucted!'));
                            console.log(err);
                        } 
                    });
                }
                dataToReturn.message = 'File uploaded successfully!'
                dataToReturn.imageName = newFileName;
                resolve(dataToReturn)
            } else {
                fs.unlinkSync(tempPath, err => {
                    if (err) {
                        console.log(err);
                        reject( new Error('Internal server error detucted!'));
                    }
                });
                reject(new Error('Invalid file format, only images are supported!'));
            }
        })
    },
    uploadimages: function(req,toDir,prefix){
        return new Promise((resolve,reject)=>{
            let dataToReturn = {message:'No data is available!', error:'No error'}
            dataToReturn.imageName = []
            for (let i = 0; i < req.files.length; i++) {
                
                const tempPath = req.files[i].path;
                // const tempPath = 'D:/programing/Brototype/weekly tasks/project1/project/public/uploads/temp/11939e5f3d62d2f958907c861482ef26';
                const newFileName = prefix+this.randomGen(15)+path.extname(req.files[i].originalname).toLowerCase();
                const targetPath = path.join(__dirname, "../public/uploads/"+toDir+"/"+newFileName);
                const ext = path.extname(req.files[i].originalname).toLowerCase();
                console.log('temp path :'+tempPath);
                if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
                    fs.renameSync(tempPath, targetPath, err => {
                        if (err) {
                            dataToReturn.error = err;
                            reject(new Error('Internal server error detucted!'));
                            console.log(err);
                        } 
                    });
                    dataToReturn.message = 'File uploaded successfully!'
                    dataToReturn.imageName.push(newFileName);
                    resolve(dataToReturn)
                } else {
                    fs.unlinkSync(tempPath, err => {
                        if (err) {
                            console.log(err);
                            reject( new Error('Internal server error detucted!'));
                        }
                    });
                    reject(new Error('Invalid file format, only images are supported!'));
                }
            }
        })
    },
    deleteFile: (path)=>{
        
        fs.unlinkSync(path, err => {
            if (err) {
                console.log(err);
            }
        });
    },
    cropImage: (path, topath, cb)=>{
        sharpe(path)
            .resize({
              width: 300,
              height: 300
            }).toFile(topath, function(err) {
                if(err){
                    cb(err)
                }else{
                    cb()
                }
            });
    }
}

module.exports = mainFunctions;