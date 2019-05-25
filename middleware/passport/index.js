// load all the things we need
const passport = require('passport');
const LocalStrategy    = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;

const Customer = require('../../models/customer');

const Caterer = require('../../models/caterer');

var myLocalConfig = (passport) => {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================


    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('caterer-login', new LocalStrategy({
	  usernameField: 'email',
	  passwordField: 'password',
	  passReqToCallback : true
	},
	function(req, email, password, done) {
		if (email)
			email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

		// asynchronous
		process.nextTick(function() {
			Caterer.findOne({ 'catererEmail' :  email, 'status': 'verified' }, function(err, caterer) {
				// if there are any errors, return the error
				if (err)
				{
					return done(err);
				}
				
				// if no caterer is found, return the message
				if (!caterer)
				{
					console.log('no user')
					return done(null, false);
				}
					
				// check caterer's password
				if (!caterer.validPassword(password))
				{
					console.log('no pw')
					return done(null, false);
				}
					
				// all is well, return caterer
				else
				{
					return done(null, caterer);
				}	
					
			});
		});

	}));
	
	
	passport.use(new JWTStrategy({
		jwtFromRequest: req => req.cookies.jwt,
		secretOrKey: "FoodieBeeSecretKey",
	  },
	  (jwtPayload, done) => {
		if (new Date() > new Date(jwtPayload.expires)) {
		  return done('jwt expired');
		}
		return done(null, jwtPayload);
	  }
	));
	

    
};

module.exports = myLocalConfig;