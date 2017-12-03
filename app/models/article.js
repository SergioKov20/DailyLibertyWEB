var mongoose = require('mongoose');
var mongoosastic=require("mongoosastic");

// define the schema for our user model
var articleSchema = mongoose.Schema({
	_id			: String,
    category    : { type:String, es_indexed:true },
    title		: { type:String, es_indexed:true },
    subtitle	: { type:String, es_indexed:true },
    content		: { type:String, es_indexed:true },
    author		: { type:String, es_indexed:true },
    views 		: String,
	data 		: Date,
	comments : [String],
	fotourl : String,
	likes 		: [{
					_id : String,
					like : Boolean
				  }]
});

articleSchema.plugin(mongoosastic);

var Article = mongoose.model('Article', articleSchema), stream = Article.synchronize(), count = 0;

stream.on('data', function(err, doc){
  count++;
});
stream.on('close', function(){
  console.log('indexed ' + count + ' documents!');
});
stream.on('error', function(err){
  console.log(err);

});

// create the model for articles and expose it to our app
module.exports = Article;
