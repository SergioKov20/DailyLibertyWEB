var Article = require('./models/article');

exports.getArticles = function () {

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