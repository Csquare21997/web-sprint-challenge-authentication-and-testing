const jwt = require('jsonwebtoken')

module.exports = {
  authenticateToken,

}

  function authenticateToken(req, res, next){
    const autherHeader = req.headers['authorization']
    const token = autherHeader && autherHeader.split('')[1]
    if(token == null) return res.sendStatu(401)
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
        if(err)return res.sendStatu(403)
        req.user = user
        next()
    })
  }