const users = require("../models/users")

let usersModules = {
    authCheck : (reqData)=>{
        // console.log('User login data: '+reqData.session.adminid + reqData.session.login_sess_admin);
        return new Promise( async(resolve,reject)=>{

            let isUserLogged = false;
            let userData = await users.findOne({_id:reqData.session.userid, 'state.deleted':{$ne:true}})
            if(userData){
                if(userData._id == reqData.session.userid && userData.login_sess == reqData.session.login_sess){
                    isUserLogged = true;
                }
            }
            resolve(isUserLogged)
        })
    }
}

module.exports = usersModules;