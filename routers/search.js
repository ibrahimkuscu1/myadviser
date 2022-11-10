const express = require('express')
const  router= express.Router()
const Adviser= require("../database/models/adviser")
const auth=require("../middlewares/auth")

router.route("/search/:key").get( async (req,res)=>{
 let data = await Adviser.find(
    {
        "$or":[
            {
                category:{$regex:req.params.key }
                
            },
            {
                name:{$regex:req.params.key }
            }
        ]
    }
 )
 res.send(data)
})

// router.route('/search2/:id').get((req, res) => {
//     Adviser.findById(req.params.id)
//         .then(Adviser => res.json(Adviser))
//         .catch(err => res.status(400).json('Error: ' + err));
// });

router.route("/search2/").get( auth, async (req,res)=>{
    let data = await Adviser.find(
    )
    .then(Adviser => res.json(Adviser))
        .catch(err => res.status(400).json('Error: ' + err));
   })

module.exports=router