const express = require("express")
const app = express();
const bp = require ("body-parser")
const mongoose = require("mongoose")
var cors = require('cors')
mongoose.connect("mongodb+srv://shiva:Shiva123*@cluster0.l6xxepm.mongodb.net/movieDB?retryWrites=true&w=majority").then(()=>{
    console.log("connected")
}).catch((err)=>{
    console.log(err)
}
)
app.use(cors())
app.use(express.json())
app.use(bp.urlencoded({extended: true}));
app.use(express.static("public"));

let userReqName; 
app.post("/",function(req,res){
     userReqName = req.body.movieName;
     console.log(userReqName);
     
     res.redirect("/"+userReqName)
})
//let userReview={name:"",review:"",rating:""};
app.use('/api/auth',require('./routes/auth'))
app.use('/api/',require('./routes/review'))



app.listen(3001,function(){
    console.log("qwerty")
})