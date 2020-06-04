const mongoose = require('mongoose');

let ApplicationSchema = new mongoose.Schema({
    appId: {
        type: String,
        required: true
    },
    
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 5
    },

    dob: {
      type: Date,
      min: '01-01-1800',
      max: '01-01-2500'
    },
    profession: {
        type: String
    },    
    riskScore: {
        type: Number
    }
  });
  
let Application = mongoose.model('Application', ApplicationSchema)

module.exports = {Application}