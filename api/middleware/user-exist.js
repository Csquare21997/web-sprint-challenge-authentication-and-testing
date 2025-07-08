const Auth = require('../auth/auth-model')

module.exports = async function  (req, res,next){
    const { username } = req.body

    if(!username){
        return res.status(400).json({message:"username and password required"})
        }

        try{
            const user = await Auth.find(username) 
            if(!user){
                return res.status(404).json({message:"invalid credentials"})
            }

            req.user = user
            next()
        }catch(err){
            res.status(500).json({message:err.message})
        }

    

   
}



