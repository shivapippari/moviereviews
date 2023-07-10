const mongoose = require('mongoose');
const { Schema } = mongoose;

const movieSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true, 
    },
    review:{
        type: String,
        default: "not yet released"
    },
    rating:{
        type: Number,
        default: 0
    },
   
    
  });

  module.exports = mongoose.model('movie', movieSchema);