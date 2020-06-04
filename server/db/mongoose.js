let mongoose = require('mongoose');
    
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URI);

module.exports = {mongoose};
