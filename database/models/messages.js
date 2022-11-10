const mongoose= require("mongoose")

let messagesSchema = new mongoose.Schema({
    adviser:{
        type:mongoose.Schema.Types.ObjectId
    },
    user:{
        type:mongoose.Schema.Types.ObjectId
    },
    message:{
        type:String
    }
    

})

let Messages= new mongoose.model("messages", messagesSchema);



module.exports=Messages;