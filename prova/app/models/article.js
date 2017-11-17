var mongoose = require('mongoose');

// define the schema for our user model
var articleSchema = mongoose.Schema({
    category    : String,
    title		: String,
    subtitle	: String,
    text		: String,
    author	: String
});

// create the model for articles and expose it to our app
module.exports = mongoose.model('Article', articleSchema);