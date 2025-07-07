const Auth = require('../auth/auth-model')

module.exports = async function  (req, res,next){
    const { username } = req.body
    const user = await Auth.find(username) 

    if(!username){
    res.status(400).json({message:"invalid credentials"})
    }else{
        req.user = user
        next()
    }
}



