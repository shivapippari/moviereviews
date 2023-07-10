const mongoose = require('mongoose');
const { Schema } = mongoose;

const userReviewSchema = new Schema({
        user:
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        },
        username:
        {
            type: String   
        },
        title:{
            type: String 
        },
        review:{
            type: String
            
        },
        rating:{
            type: Number
        },
        date:{
            type: Date,
            default: Date.now 
        }
    


})

module.exports = UserReview = mongoose.model('userReview', userReviewSchema);