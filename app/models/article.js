var mongoose = require('mongoose');

// define the schema for our user model
var articleSchema = mongoose.Schema({
	_id			: String,
    category    : String,
    title		: String,
    subtitle	: String,
    content		: String,
    author	: String,
    views : Number
});

// create the model for articles and expose it to our app
module.exports = mongoose.model('Article', articleSchema);
