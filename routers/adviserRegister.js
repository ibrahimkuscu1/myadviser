const express = require('express')
const bcrypt = require("bcrypt")
const  router= express.Router()
const jwt=require("jsonwebtoken")
const auth=require("../middlewares/auth")
require("dotenv").config();
const advicerModel=require("../database/models/adviser")

router.route("/register").post( auth, async(req,res)=>{
    console.log("hello22")
    try{
        const adviserInfo={
            name:req.body.name,
            surname:req.body.surname,
            category:req.body.category,
            email:req.body.email,
            password:req.body.password,
            information:req.body.information,
            contact:req.body.contact
        }
    
        if (!req.body.name || !req.body.surname ||!req.body.category ||!req.body.email ||!req.body.password )
        {return res.send({msg:"username, email and password are neccesary"})}

        
    
        const oldAdviser= await advicerModel.findOne({email:req.body.email});
        if(oldAdviser){
            res.send({msg:"please login, or use another email to register"})
        }
        else{
            const encryptedPassword= await bcrypt.hash(req.body.password,12);
            const newAdviser=advicerModel.create({
                name:req.body.name,
                surname:req.body.surname,
                category:req.body.category,
                email:req.body.email,
                password:encryptedPassword,
                information:req.body.information,
                contact:req.body.contact
            }, (err)=>{
                if (err) {console.log(err)
                    
                }
                res.send({msg:"adviser registered",newAdviser})
            })
        }
    }

        
    catch(err){
        res.send(err)
    }
})

router.route("/loginAdviser").post( auth, async(req,res)=>{
    // const user ={
    //         email:req.body.email,
    //         password:req.body.password
    // }
    try{
        if(!req.body.email || !req.body.password){
            return res.send({msg:"invalid email or password"})
        }
    
        const advisers= await advicerModel.findOne({email:req.body.email});
        if(!advisers){
            res.send({msg:"please enter valid email and password"})
        }
        else{
            const validatePassword= await bcrypt.compare(
                req.body.password,
                advisers.password
            )
            if(validatePassword){
                // const payload={
                //     name:advisers.name,
                //     email:advisers.email
                // }
                // const token= jwt.sign(payload, process.env.Private_Key,{expiresIn:"2h"});
                res.send({msg:"Successful Login"}) 
                console.log("success")
        }
      
    }       
        
    } 

    catch(err){
        console.log(err)
    }
   
});

module.exports=router