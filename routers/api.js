
const express = require('express')
const bcrypt = require("bcrypt")
const  router= express.Router()
const jwt=require("jsonwebtoken")
require("dotenv").config();
const userModel=require("../database/models/user")





router.route("/signup").post( async(req,res)=>{
    console.log("helloşljlşljlllkl")
    try{
        const userInfo={
            userName:req.body.userName,
            email:req.body.email,
            password:req.body.password
        }
    
        if (!req.body.userName || !req.body.email ||!req.body.password )
        {return res.send({msg:"username, email and password are neccesary"})}

        
    
        const oldUser= await userModel.findOne({email:req.body.email});
        if(oldUser){
            res.status(409).send({msg:"please login, or use another email to register"})
        }
        else{
            const encryptedPassword= await bcrypt.hash(req.body.password,11);
            const newUser=userModel.create({
                userName:req.body.userName,
                email:req.body.email,
                password:encryptedPassword
            }, (err)=>{
                if (err) {console.log(err)
                    
                }
                res.send({msg:"user registered",newUser})
            })
        }
    }

        
    catch(err){
        
    }
})

router.route("/login").post( async(req,res)=>{
    // const user ={
    //         email:req.body.email,
    //         password:req.body.password
    // }
    try{
        if(!req.body.email || !req.body.password){
            return res.send({msg:"please fulfill email or password"})
        }
    
        const user= await userModel.findOne({email:req.body.email});
        if(!user){
            res.send({msg:"please enter valid email and password"})
        }
        else{
            const validatePassword= await bcrypt.compare(
                req.body.password,
                user.password
            )
            if(validatePassword){
                // const payload={
                //     email:user.email,
                //     userName:req.body.userName
                // }
                const token= jwt.sign({ id: user.id }, process.env.JWT_SECRET,{expiresIn:"1h"});
                res.send(token) 
                console.log("success")
        }
        else{
            res.send({msg:"password is wrong"})
        }
      
    }       
        
    }

    catch(err){
        console.log(err)
    }
   
});

module.exports=router