var Article = require('./models/article');

exports.getIndex = function(req,res) {
    Article.find({}).sort({data: -1}).exec(function(err, articles) {
    res.render('index.ejs', {
      user: req.user,
      action: req.param('a'),
      articles: articles,
      isLoggedIn: req.isAuthenticated()
    });
  });
}

exports.getCategory = function(req,res) {
  if (req.param('c') != "politica" &&
    req.param('c') != "esports" &&
    req.param('c') != "ciencia" &&
    req.param('c') != "tecnologia" &&
    req.param('c') != "altres"
    ) res.render('error/wrongCategory.ejs');
      else {
        Article.find({category: req.param('c')}, function(err, articles) {
          res.render('category.ejs', {
            user: req.user,
            articles: articles,
            isLoggedIn: req.isAuthenticated()
        });
      });
    }
}

exports.getTendencies = function(req, res) {

  /*Article.esSearch({
    from : 0,
    size : 25,
    sort : { "views" : {"order" : "asc"}},
    query : { match_all : {} }
    }, function(err, articles){
      return articles;
  });*/
  Article.find({}).sort({views: -1}).exec(function(err, articles) {
    res.render('tendencies.ejs', {
      user: req.user,
      tendencies: articles,
      isLoggedIn: req.isAuthenticated()
    });
  });
}

exports.newArticle = function(req, res) {
  var formidable = require('formidable');
  var fs = require('fs');
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    var Article = require('./models/article');
    var newArticle = new Article();
    newArticle._id = require("randomstring").generate(7);
    newArticle.title = fields.title;
    newArticle.subtitle = fields.subtitle;
    newArticle.content = fields.content;
    newArticle.author = req.user.username;
    newArticle.data = new Date();
    newArticle.category = fields.category;
    newArticle.views = 0;

    if (files.filetoupload.size != 0) {
        var oldpath = files.filetoupload.path;
        var extension = "";
        if (files.filetoupload.type == 'image/png') extension = ".png";
        else if (files.filetoupload.type == 'image/jpeg') extension = ".jpg";
        else {
            res.render('error/wrongFileExt.ejs');
            return;
        }
        var newpath = './public/multimedia/articles/' + newArticle._id + extension;
        fs.rename(oldpath, newpath, function(err) {
            if (err) res.render('error/500.ejs');
        });
        newArticle.fotourl = '/multimedia/articles/' + newArticle._id + extension;
    }
    else newArticle.fotourl = "/multimedia/articles/default.jpg";

    //use schema.create to insert data into the db
    Article.create(newArticle, function(err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  });
}

exports.deleteArticle = function(req, res) {
  var articleID = req.param('a');

  Article.findByIdAndRemove(articleID, function(err, articles) {
      articles.save(function(err) {
         if (err) res.render('error/500.ejs');
         else res.redirect('/');
     });
  });
}

exports.editArticle = function(req, res) {
  var articleID = req.param('e');
  var formidable = require('formidable');
  var fs = require('fs');
  var form = new formidable.IncomingForm();
  var Article = require('./models/article');

  Article.findById(articleID, function(err, article) {
    if (err) res.render('error/500.ejs');
    else if (!article) res.render('error/wrongArticle.ejs');
    if (article) {
      if (article.author != req.user.username) res.render('error/forbidden.ejs');
      else {
        form.parse(req, function(err, fields, files) {
          article.category = fields.category;
          article.title = fields.title;
          article.subtitle = fields.subtitle;
          article.content = fields.content;

          if(fields.nocambiar != "nocambiar") {
            if (files.filetoupload.size != 0) {
                var oldpath = files.filetoupload.path;
                var extension = "";
                if (files.filetoupload.type == 'image/png') extension = ".png";
                else if (files.filetoupload.type == 'image/jpeg') extension = ".jpg";
                else {
                    res.render('error/wrongFileExt.ejs');
                    return;
                }
                var newpath = './public/multimedia/articles/' + article._id + extension;
                fs.rename(oldpath, newpath, function(err) {
                    if (err) res.render('error/500.ejs');
                });
                article.fotourl = '/multimedia/articles/' + article._id + extension;
            }
            else {
              article.fotourl = "/multimedia/articles/default.jpg";
            }
          }
          article.views = article.views - 1; //No és legal que et conti una més per editar haha

          article.save(function(err, updatedArticle) {
            if (err) res.render('error/500.ejs');
            else res.redirect('/read?a='+article._id);
          });
        });
      }
    }
  });
}

exports.editProfile = function(req, res) {

  var formidable = require('formidable');
  var fs = require('fs');
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    var User = require('./models/user');

    //COMPROVACIÓ DE CONFLICTE I VALIDESA DE MAILS:
    var mail = fields.mail.substring(0, 35);
    User.findOne({'email': mail}, function(err, found) {
     if (found && (found.username != req.user.username)) {
      return res.redirect('/profile');
  }
  else {
      if (mail.indexOf('@') < 1) {
        return res.redirect('/profile');
    }
    User.findOne({'username': req.user.username}, function(err, user) {
                      //COMPROVAR NAME VALID
                      var name = fields.fullname1.substring(0, 10);
                      var surname = fields.fullname2.substring(0, 24);
                      if (name.length > 1) user.firstName = name;
                      else return res.redirect('/profile');
                      if (surname.length > 1) user.lastName = surname;
                      else return res.redirect('/profile');
                      user.email = mail;

                      //COMPROVAR DATA VALID
                      var data = fields.birth.substring(0, 10);
                      var comp = data.split('/');
                      var d = parseInt(comp[0], 10);
                      var m = parseInt(comp[1], 10);
                      var y = parseInt(comp[2], 10);
                      var date = new Date(y, m - 1, d);
                      if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) {
                        user.birthdate = data;
                    } else user.birthdate = "";

                      //COMPROVAR ABOUT
                      var about = fields.aboutme.substring(0, 300);
                      user.aboutme = about;

                      //COMPROVAR FOTO
                      if (fields.calborrar == "1") {
                     user.fotourl = "/multimedia/profilepics/default.png";
                 }
                 else if (files.filetoupload.size != 0) {
                    var oldpath = files.filetoupload.path;
                    var extension = "";
                    if (files.filetoupload.type == 'image/png') extension = ".png";
                    else if (files.filetoupload.type == 'image/jpeg') extension = ".jpg";
                    else {
                     res.render('error/wrongFileExt.ejs');
                     return;
                 }
                 var newpath = './public/multimedia/profilepics/' + fields.username + extension;
                 fs.rename(oldpath, newpath, function(err) {
                     if (err) res.render('error/500.ejs');
                 });
                 user.fotourl = '/multimedia/profilepics/' + fields.username + extension;
             }
             user.save(function(err) {
                if (err) res.render('error/500.ejs');
                else res.redirect('/profile');
            });
         });
}
});
});
}

exports.likeArticle = function(req, res) {
    var articleID = req.param('a');
    var userID = req.param('u');
    var like = req.param('l');
    if (articleID == null || userID == null || like == null) res.send(false);
    else {
        Article.findById(articleID, function(err, article){
            if (err) res.send(false);
            else if (!article) res.send(false);
            else {
                var index = article.likes.findIndex(function(element) {
                    return (element._id == userID);
                });
                //var index = article.likes.find(o => o._id === userID);
                //var index = article.likes.indexOf({ _id: userID, like:false});
                if ( like != 0 ){ //like or dislike
                    if (index < 0) { //New like
                        article.likes.push( {_id : userID, like : (like==1)} );
                    }
                    else { //existing like
                        article.likes[index].like = (like == 1);
                    }
                }
                else { //unlike
                    if (index > -1) article.likes.splice(index, 1);
                }
                article.save(function(err) {
                    if (err) res.send(false);
                    else res.send(true);
                });
            }
        });
    }
}

exports.comentar = function(req, res) {
  var user = req.user.username;
  var comentari = req.body.comentario.substring(0, 280);
  var usercoment = user + "&com=" + comentari;
  var articleID = req.param('a');
  Article.findById(articleID, function(err, article) {
      if(article) {
        article.comments.push(usercoment);
        article.save(function(err) {
            if (err) res.render('error/500.ejs');
            else res.redirect('/read?a='+articleID);
        });
      }
      else res.render('error/wrongArticle.ejs');
  });
}
