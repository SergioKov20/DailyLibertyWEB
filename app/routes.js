module.exports = function(app) {

    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    app.get('/login', function(req, res) {
        res.render('login.ejs');
    });

    app.get('/signup', function(req, res) {
        res.render('signup.ejs');
    });
}
