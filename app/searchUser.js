
exports.searchUser = function (req,res,username) {

	var User = require('./models/user');
	console.log(username);
	User.findOne({ 'username' :  username }, function(err, user) {
		if (err) {
			res.render('error/500.ejs');
		}
        // if no user is found, return the message
        if (!user){
        	res.render('error/wrongUser.ejs');
        }
        if (user){
        	res.render('user.ejs', {
	            user : user, // get the user out of session and pass to template
	            isLoggedIn: req.isAuthenticated()
        	});
        }
	});
	return;
}