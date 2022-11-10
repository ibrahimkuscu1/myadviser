const jwt=require("jsonwebtoken");
require("dotenv").config();
const config= process.env;

const verifyToken = async (req,res,next)=>{
    // console.log(req.headers.authorization);
    const token= req.headers.authorization.split(" ")[1]
    console.log(token,"token")
    if(!token){
        return res.status(403).send("a token is required for authentication")
    }
    if (token === 'null') {
        return res.status(401).send('Unauthorized request');
      }
    try{
        const payload= await jwt.verify(token, process.env.JWT_SECRET);
        req.user=payload;
        next()
    } catch(err){
        return res.status(401).send(err);
    }
    
}

module.exports = verifyToken 