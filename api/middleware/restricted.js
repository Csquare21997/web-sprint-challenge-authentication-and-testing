const jwt = require('jsonwebtoken');
const secret = process.env.SECRET || 'secret';

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

 console.log(token)
  if (!token) {
    res.status(401).json({ message: 'token required' });
    return;
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      console.log(err)
      res.status(401).json({ message: 'token invalid' });
    } else {
      req.token = decoded;
      next();
    }
  });
};


  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */


