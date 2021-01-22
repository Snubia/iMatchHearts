const mongoose = require('mongoose');
const Schema = mongoose.Schema; // from the mongoose npm page

const messageSchema = new Schema({
    fullname: {
        type: String
    },
    email: {
        type: String
    },
    message: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }, 
    // solution from the web
}, {
    toObject: {
        virtuals: true,
      },
      toJSON: {
        virtuals: true,
} 
    
  });
  module.exports = mongoose.model('Message', messageSchema );