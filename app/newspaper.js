var Article = require('./models/article');

exports.getArticles = function () {

	var ret = [];
	Article.find({}, function(err, articles) {
		return articles;
	    /*articles.forEach(function(article) {
	    	/* articles.push({
		        id: article.id,
		        title: article.title,
		        subtitle: article.subtitle,
		        author: article.author,
		        category: article.category
			});
	    });*/
	});
	//return articles;
	//var t1 = "El Girona Futbol Club fa història davant del tot poderós Reial Madrid";
	//var s1 = "El Reial Madrid perd tres punts i comença a dir adéu a la lliga";
	//var t2 = "Puigdemont i part del seu govern són a Brussel·les";
	//var s2 = "El president de la Generalitat hi hauria anat per entrevistar-se amb dirigents flamencs";
    //var articles = [{portada: "/img/ciencia.jpg", category: "ESPORTS", title: t1, subtitle: s1, author: "Edgar Lorenzo"},
	//				{portada: "/img/puigdemont.jpg", category: "POLITICA", title: t2, subtitle: s2, author: "Edgar Lorenzo"},
	//				{portada: "/img/ciencia.jpg", category: "ESPORTS", title: t1, subtitle: s1, author: "Edgar Lorenzo"},
	//				{portada: "/img/puigdemont.jpg", category: "POLITICA", title: t2, subtitle: s2, author: "Edgar Lorenzo"},
	//				{portada: "/img/ciencia.jpg", category: "ESPORTS", title: t1, subtitle: s1, author: "Edgar Lorenzo"},
	//				{portada: "/img/puigdemont.jpg", category: "POLITICA", title: t2, subtitle: s2, author: "Edgar Lorenzo"},
	//				{portada: "/img/ciencia.jpg", category: "ESPORTS", title: t1, subtitle: s1, author: "Edgar Lorenzo"},
	//				{portada: "/img/puigdemont.jpg", category: "POLITICA", title: t2, subtitle: s2, author: "Edgar Lorenzo"}];
	//return articles;
	///multimedia/imatges/laksdjlkaoi2189casd.jpg
}

exports.getTendencies = function () {

	var t1 = "El Girona Futbol Club fa història davant del tot poderós Reial Madrid";
	var s1 = "El Reial Madrid perd tres punts i comença a dir adéu a la lliga";
	var t2 = "Puigdemont i part del seu govern són a Brussel·les";
	var s2 = "El president de la Generalitat hi hauria anat per entrevistar-se amb dirigents flamencs";
    var articles = [{portada: "/img/ciencia.jpg", category: "ESPORTS", title: t1, subtitle: s1, author: "Edgar Lorenzo"},
					{portada: "/img/puigdemont.jpg", category: "POLITICA", title: t2, subtitle: s2, author: "Edgar Lorenzo"},
					{portada: "/img/ciencia.jpg", category: "ESPORTS", title: t1, subtitle: s1, author: "Edgar Lorenzo"},
					{portada: "/img/puigdemont.jpg", category: "POLITICA", title: t2, subtitle: s2, author: "Edgar Lorenzo"},
					{portada: "/img/ciencia.jpg", category: "ESPORTS", title: t1, subtitle: s1, author: "Edgar Lorenzo"},
					{portada: "/img/puigdemont.jpg", category: "POLITICA", title: t2, subtitle: s2, author: "Edgar Lorenzo"},
					{portada: "/img/ciencia.jpg", category: "ESPORTS", title: t1, subtitle: s1, author: "Edgar Lorenzo"},
					{portada: "/img/puigdemont.jpg", category: "POLITICA", title: t2, subtitle: s2, author: "Edgar Lorenzo"}];
	return articles;
}

exports.newArticle = function(req,res) {

	var newArticle = new Article();
	newArticle._id 		= require("randomstring").generate(7);
	newArticle.category = req.body.category;
	newArticle.title    = req.body.title;
	newArticle.subtitle = req.body.subtitle;
	newArticle.content	= req.body.content;
	newArticle.author 	= req.user.username;

	//use schema.create to insert data into the db
	Article.create(newArticle, function (err) {
		if (err) { return next(err); } 
		else { return res.redirect('/')  }
	});
}

exports.editArticle = function(req,res) {
	var articleID = req.param('e');
	Article.findById(articleID, function(err,article) {
		if (err) res.render('error/500.ejs');
		else if (!article) res.render('error/wrongArticle.ejs');
		if (article) {
			if (article.author != req.user.username) res.render('error/forbidden.ejs');
			else {
				article.category = req.body.category;
				article.title    = req.body.title;
				article.subtitle = req.body.subtitle;
				article.content	= req.body.content;
				article.author 	= req.user.username;

				article.save(function (err, updatedArticle) {
			    	if (err) res.render('error/500.ejs');
			    	else res.redirect('/profile');
		  		});
		}
		}
		
	});
}

exports.editProfile = function(req,res) {

	var formidable = require('formidable');
	var fs = require('fs');
	var form = new formidable.IncomingForm();

	form.parse(req, function (err, fields, files) {
		var User = require('./models/user');
        User.findOne({ 'username' :  req.user.username }, function(err, user) {
        	user.firstName = fields.fullname1;
        	user.lastName = fields.fullname2;
        	//user.email = fields.mail; // DE MOMENT NO: COMPROVAR QUE SIGUI UNIC
          	//user.birthdate = fields.birth; //COMPROVAR DATA VALID
          	//user.aboutme = fields.aboutme; COMPROVAR LENGTH
          	if (fields.calborrar == "1"){
          		user.fotourl = "/multimedia/profilepics/default.png";
          	}
          	else if (files.filetoupload.size != 0){
          		var oldpath = files.filetoupload.path;
          		var extension = ".jpg";
          		if (files.filetoupload.type == 'image/png') extension = ".png";
          		var newpath = './public/multimedia/profilepics/' + fields.username + extension;
          		fs.rename(oldpath, newpath, function (err) {
	            	if (err) res.render('error/500.ejs');
            	});
            	user.fotourl = '/multimedia/profilepics/' + fields.username + extension;
          	}
          	user.save(function(err) {
				if (err) res.render('error/500.ejs');
		        else res.redirect('/profile');
	        });
        });
    });
}
