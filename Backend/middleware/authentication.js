const jwt = require('jsonwebtoken');

const authentication = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    
    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({ msg: "Token missing or invalid." });
    }


    token = token.split(' ')[1].replace(/^"|"$/g, '');
    
    const payload = jwt.verify(token,'abc');
    req.user = payload;
    // console.log("payload is:",payload);
  
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ msg: "Authentication failed." });
  }
};


const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ msg: "Access denied. No user logged in." });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({ msg: "Access denied. Admin privileges required." });
  }

  next();
};

module.exports = {authentication,isAdmin};
