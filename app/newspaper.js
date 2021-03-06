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
    ) res.render('error.ejs', {
        error: "404 Category Not Found"
    });
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
            res.render('error.ejs', {
              error: "Wrong File Extension"
            });
            return;
        }
        var newpath = './public/multimedia/articles/' + newArticle._id + extension;
        fs.rename(oldpath, newpath, function(err) {
            if (err) {
              res.render('error.ejs', {
                error: "500 Internal Server Error"
              });
            }
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
         if (err) {
           res.render('error.ejs', {
             error: "500 Internal Server Error"
           });
         }
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
    if (err) {
        res.render('error.ejs', {
          error: "500 Internal Server Error"
        });
    }
    else if (!article) {
      res.render('error.ejs', {
        error: "404 Article Not Found"
      });
    }
    if (article) {
      if (article.author != req.user.username) {
        res.render('error.ejs', {
          error: "Forbidden: Access Denied"
        });
      }
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
                    res.render('error.ejs', {
                      error: "Wrong File Extension"
                    });
                    return;
                }
                var newpath = './public/multimedia/articles/' + article._id + extension;
                fs.rename(oldpath, newpath, function(err) {
                    if (err) {
                      res.render('error.ejs', {
                        error: "500 Internal Server Error"
                      });
                    }
                });
                article.fotourl = '/multimedia/articles/' + article._id + extension;
            }
            else {
              article.fotourl = "/multimedia/articles/default.jpg";
            }
          }
          article.views = article.views - 1; //No és legal que et conti una més per editar haha

          article.save(function(err, updatedArticle) {
            if (err) {
              res.render('error.ejs', {
                error: "500 Internal Server Error"
              });
            }
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
      return res.redirect('/profile?err=mail');
  }
  else {
      if (mail.indexOf('@') < 1) {
        return res.redirect('/profile?err=maili');
    }
    User.findOne({'username': req.user.username}, function(err, user) {
                      //COMPROVAR NAME VALID
                      var name = fields.fullname1.substring(0, 10);
                      var surname = fields.fullname2.substring(0, 24);
                      if (name.length > 1) user.firstName = name;
                      else return res.redirect('/profile?err=name');
                      if (surname.length > 1) user.lastName = surname;
                      else return res.redirect('/profile?err=surname');
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
                    } else return res.redirect('/profile?err=date');

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
                     return res.redirect('/profile?err=ext');
                   }
                   var newpath = './public/multimedia/profilepics/' + fields.username + extension;
                   fs.rename(oldpath, newpath, function(err) {
                       if (err) {
                         res.render('error.ejs', {
                           error: "500 Internal Server Error"
                         });
                       }
                   });
                   user.fotourl = '/multimedia/profilepics/' + fields.username + extension;
                 }
             user.save(function(err) {
                if (err) {
                  res.render('error.ejs', {
                    error: "500 Internal Server Error"
                  });
                }
                else res.redirect('/profile');
            });
         });
}
});
});
}

exports.likeArticle = function(req, res) {
    if(!req.isAuthenticated()) res.redirect('/login');
    else {
        var articleID = req.param('a');
        var username = req.user.username;
        var likeaction = req.param('like');
        Article.findById(articleID, function(err, article) {
            if(article) {
              var User = require('./models/user');
              User.findOne({'username': article.author}, function(err, autor) {
                  if(likeaction == "1") { //None-Like
                    article.likes.push(username);
                    article.views--; //Això és per a que no conti una visita més al recarregar, no es just
                    autor.rating++;
                  }
                  else if(likeaction == "2") { //Like-None
                    var index = article.likes.indexOf(username);
                    if(index > -1) article.likes.splice(index, 1);
                    article.views--;
                    autor.rating--;
                  }
                  else if(likeaction == "3") { //None-Dislike
                    article.dislikes.push(username);
                    article.views--;
                    autor.rating--;
                  }
                  else if(likeaction == "4") { //Dislike-None
                    var index = article.dislikes.indexOf(username);
                    if(index > -1) article.dislikes.splice(index, 1);
                    article.views--;
                    autor.rating++;
                  }
                  else if(likeaction == "5") { //Like-Dislike
                    var index = article.likes.indexOf(username);
                    if(index > -1) {
                        article.likes.splice(index, 1);
                        article.dislikes.push(username);
                        article.views--;
                        autor.rating -= 2;
                    }
                  }
                  else if(likeaction == "6") { //Dislike-Like
                    var index = article.dislikes.indexOf(username);
                    if(index > -1) {
                        article.dislikes.splice(index, 1);
                        article.likes.push(username);
                        article.views--;
                        autor.rating += 2;
                    }
                  }
                  article.save(function(err) {
                      if (err) {
                        res.render('error.ejs', {
                          error: "500 Internal Server Error"
                        });
                      }
                      else {
                        autor.save(function(err) {
                            if (err) {
                              res.render('error.ejs', {
                                error: "500 Internal Server Error"
                              });
                            }
                            else res.redirect('/read?a='+articleID);
                        });
                      }
                  });
              });
            }
            else {
              res.render('error.ejs', {
  							error: "404 Article Not Found"
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
            if (err) {
              res.render('error.ejs', {
                error: "500 Internal Server Error"
              });
            }
            else res.redirect('/read?a='+articleID);
        });
      }
      else {
        res.render('error.ejs', {
          error: "404 Article Not Found"
        });
      }
  });
}
