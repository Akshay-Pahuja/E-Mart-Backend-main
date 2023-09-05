const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
 exports.authMiddleware = asyncHandler(async(req,res,next)=>{
    let token;
    if(req?.headers?.authorization ?.startsWith('Bearer')){
       token = req.headers.authorization.split(" ")[1];
       try{
        if(token)
        {
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id);
            next();

        }
       } catch(error){
        throw new Error("Not authorized token expired,Please login again");
       }
    }
    else{
        throw new Error("There is no token attached to header");
    }
})

exports.isAdmin = asyncHandler(async(req,res,next)=>{
    const {email} = req.user;
    const user = await User.findOne({email});
    if(user.role !== "admin")
    {
        throw new Error("Only admin is allowed");
    }
    else{
        next();
    }
})