const admins = require("../models/admins")

let adminModules = {
    authCheck : (reqData)=>{
        return new Promise( async(resolve,reject)=>{

            let isUserLogged = false;
            let userData = await admins.findOne({_id:reqData.session.adminid})
            if(userData){
                if(userData._id == reqData.session.adminid && userData.login_sess == reqData.session.login_sess_admin){
                    isUserLogged = true;
                }
            }
            resolve(isUserLogged)
        })
    }
}

module.exports = adminModules;