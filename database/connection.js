const mongoose = require('mongoose');
require("dotenv").config();
let URI=process.env.mongoDB_URI

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  });
  console.log("hello")
} 


module.exports=main;