const express = require("express")
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
const bp = require("body-parser")
const Movie = require( "../models/movie")
const fetchuser = require("../middleware/fetchuser");
const User = require("../models/User");
const UserReview = require("../models/UserReview");


//////  1
router.post("/:movie/addreview",fetchuser,[
    body('review').isLength({min:3}),
    body('rating').isInt({min:1,max:5})
],async function(req,res){
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try{
    const {review,rating}=req.body;
    const reqMovie = req.params.movie;
    let movie= await Movie.findOne({title : reqMovie})
    if(!movie){
        return res.status(404).json({errors : "not found 404",reqMovie})
    }
    else{
    // let check = await UserReview.findOne({user:req.user.id})
    // if(check){
    //   res.send("already reviewed")
    // }
   
    let reqUser= await User.findOne({_id:req.user.id})
    const reqReview = await UserReview.create({
      title:reqMovie,
      review,
      rating,
      user:req.user.id,
      username:reqUser.name
    })
    return res.json(reqReview);
    
  }
}
catch{
   return res.status(500).json({errors:"internal server error"})
}
})


/////   2
router.get("/:movie/review",async function(req,res){
  const reqMovie=req.params.movie;
  try{
   const movie= await Movie.findOne({title:reqMovie});
   if(!movie){
    return res.status(404).json({errors:"not found......"})
   }
   const userreviews =await  UserReview.find({title:reqMovie})
   return res.json(userreviews)
   }
  catch(error){
    console.error(error.message);
    return res.status(500).json({errors:"internal server error"})
  }
})  


///// 3
router.get("/movies",async function(req,res){
  try{ 
   const movies = await Movie.find()
   return res.send(movies)
  }
  catch(error){
    console.error(error.message);
    return res.status(500).json({errors:"internal server error"})
  }
})


///// 4
router.put('/updatereview/:id', fetchuser, async (req, res) => {
  const { review,rating } = req.body;
  try {
      const newItem = {};
      if (review) { newItem.review= review};
      if (rating) { newItem.rating = rating}; 
      let searchedReview = await UserReview.findById(req.params['id']);
      if (!searchedReview) { return res.status(404).send("Not Found") }

      if (searchedReview.user.toString() !== req.user.id) {
          return res.status(401).send("Not Allowed");
      }
      searchedReview = await UserReview.findByIdAndUpdate(req.params.id, { $set: newItem }, { new: true })
      res.json({ searchedReview });
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
  }
})

///// 5
router.delete('/deletereview/:id', fetchuser, async (req, res) => {
  try {
      // Find the note to be delete and delete it
      let deleteReview = await UserReview.findById(req.params['id']);
      if (!deleteReview) { return res.status(404).send("Not Found....") }

      // Allow deletion only if user owns this Note
      if (deleteReview.user.toString() !== req.user.id) {
          return res.status(401).send("Not Allowed");
      }

      deleteReview = await UserReview.findByIdAndDelete(req.params.id)
      res.json({ "Success": "review has been deleted", deleteReview: deleteReview });
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
  }
})
////6

router.get('/:movie/getuserreview',fetchuser,async(req,res)=>{
  const reqMovie=req.params.movie;
  const reqId = req.user.id;
  try{
    const movie= await Movie.findOne({title:reqMovie});
   if(!movie){
    return res.status(404).json({errors:"not found......"})
   }
   const reqReview = await  UserReview.findOne({user:reqId,title:reqMovie})
   if(!reqReview){
    return res.status(404).json({errors:"not found......"})
   }
          return res.json(reqReview)
  }
  catch(error){
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})


///   7
router.get("/:movie/serverreview",async function(req,res){
  const reqMovie=req.params.movie;
  try{
   const movie= await Movie.findOne({title:reqMovie});
   if(!movie){
    return res.status(404).json({errors:"not found......"})
   }
   return res.json(movie)
   }
  catch(error){
    console.error(error.message);
    return res.status(500).json({errors:"internal server error"})
  }
})  
module.exports=router;