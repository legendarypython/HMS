
const _ = require('lodash');
const User = require('../models/User');

 accessRightsValidation =  async (accessRights) => {
    try {

        const accessRightsValues = [2, 3]; 
        if(!accessRightsValues.includes( accessRights))
        {
          const error = new Error(""); 
        throw (error);
        }
        
        return;
    }




catch (error) {
    // Handle any errors that occur during validation
    console.error("Access rights validation error:", error);
      throw (error);
}
 }


 exports.userAuthentication = async (req, res, next) => {
  try{
  
    if(req.protocol === "http")
    {
      next(); 
      return;
    }
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
   throw (new Error("Error in User Authentication"));
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!decodedToken) {
   throw (new Error("Error in  verifying token"));
  }
  const userId = decodedToken.userId;
  const user = await User.findOne({_id: userId});
  if (!user) {
   throw (new Error("Error in User Authentication - User not found"));
  }

  next();

  }
  catch (error) {
    // Handle any errors that occur during authentication
    console.error("User authentication error:", error);
    next(error);
  }
}


module.exports = accessRightsValidation;