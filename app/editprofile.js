var User = require('./models/user');

exports.editarPerfil = function(req,res) {

  var formidable = require('formidable');
  var fs = require('fs');
  var form = new formidable.IncomingForm();
  //var util = require('util');
  form.parse(req, function (err, fields, files) {
  //res.end(util.inspect({fields: fields, files: files})); (*AIXÒ ERA PER FER DEBUG DEL QUE CONTÉ LA FOTO)
  //res.end();

      if(files.filetoupload.size != 0) { //HAY CAMBIO DE FOTO
        var User = require('./models/user');
        User.findOne({ 'username' :  fields.username }, function(err, user) {
          user.firstName = fields.fullname1;
          user.lastName = fields.fullname2;
          user.email = fields.mail;
          user.birthdate = fields.birth;
          user.aboutme = fields.aboutme;
          var oldpath = files.filetoupload.path;
          if(files.filetoupload.type == 'image/png') {
            var newpath = './public/img/profilepics/' + fields.username + ".png";
            fs.rename(oldpath, newpath, function (err) {
              if (err) throw err;
              user.fotourl = '/img/profilepics/' + fields.username + ".png";
              user.save(function(err) {
                if (err)
                    throw err;
                else res.redirect('/profile');
              });
            });
          }
          else {
            var newpath = './public/img/profilepics/' + fields.username + ".jpg";
            fs.rename(oldpath, newpath, function (err) {
              if (err) throw err;
              user.fotourl = '/img/profilepics/' + fields.username + ".jpg";
              user.save(function(err) {
                if (err)
                    throw err;
                else res.redirect('/profile');
              });
            });
          }
        });
      }
      else { //NOPE FOTO O BORRAR FOTO
        if(fields.calborrar == "1") { //SI CAL BORRAR LA FOTO ACTUAL
          var User = require('./models/user');
          User.findOne({ 'username' :  fields.username }, function(err, user) {
            user.firstName = fields.fullname1;
            user.lastName = fields.fullname2;
            user.email = fields.mail;
            user.birthdate = fields.birth;
            user.aboutme = fields.aboutme;
            var oldpath = './public/img/profilepics/default.png';
            var newpath = './public/img/profilepics/' + fields.username + ".png";
            fs.rename(oldpath, newpath, function (err) {
              fs.createReadStream(newpath).pipe(fs.createWriteStream(oldpath)); //PER NO PERDRE LA DEFAULT FOTO
              if (err) throw err;
              user.fotourl = '/img/profilepics/' + fields.username + ".png";
              user.save(function(err) {
                if (err)
                    throw err;
                else res.redirect('/profile');
              });
            });
          });
        }
        else { //NI ES VOL CANVIAR NI ES VOL ESBORRAR FOTO
          var User = require('./models/user');
          User.findOne({ 'username' :  fields.username }, function(err, user) {
            user.firstName = fields.fullname1;
            user.lastName = fields.fullname2;
            user.email = fields.mail;
            user.birthdate = fields.birth;
            user.aboutme = fields.aboutme;
            user.save(function(err) {
              if (err)
                  throw err;
              else res.redirect('/profile');
            });
          });
        }
      }
    });
  }
