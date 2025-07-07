const router = require('express').Router();
const bcrypt = require('bcryptjs')
const User = require ('../auth/auth-model')
const jwt = require('jsonwebtoken');
const { userexist } = require('../middleware/user-exist');
const secretKey = process.env.SECRET || "secret"




function generateAccessToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role
  };
  
  const options = {
    expiresIn: '1h' // Token will expire in 1 hour
  };
  
  return jwt.sign(payload, secretKey, options);
}

router.post('/register', async (req, res) => {
  try{
    const { username, password } = req.body;
    if(!username || !password){
      return res.status(500).json({message:'username and password required'})
    }
    const existingUser = await User.findBy({username});
    
    if(existingUser){
      return res.status(409).json({message:'username taken'})
    }
    const newUser = await User.add({
      username,
      password:bcrypt.hashSync(password, 8)
    })
  res.status(201).json(
    newUser
  )
  }catch(err){
    res.status(500).json({message:err.message})
  }
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', userexist, async (req, res) => {
  try{
    const { body:{password}, user } = req
   
    if ( bcrypt.compareSync (password, user.password)){
      res.json ({message:`welcome, ${user.username}`, token:generateAccessToken(user)})

    }else{
      res.status(401).json({message:'invalid credentials'})
    }
  } catch (err){
    res.status(500).json({message:err.message})
  }
 
 
  
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

module.exports = router;
