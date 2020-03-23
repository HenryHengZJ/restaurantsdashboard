// load all the things we need
const passport = require('passport');
const LocalStrategy    = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
var ObjectId = require('mongodb').ObjectID;
const JWTStrategy = passportJWT.Strategy;
require('dotenv').config();

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
			Caterer.findOne({ 'catererEmail' :  email }, function(err, caterer) {
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
				else {
					//check if caterer is first time enter with default password
					var catererStatus = caterer.status
					if (catererStatus === 'new') {
						//first time enter
						if (password === "12345678") {

							console.log('default PWWW')
							
							var matchquery;
							matchquery = {_id: new ObjectId(caterer._id)}

							var updateData = {status: 'verified'}

							Caterer.findOneAndUpdate(matchquery, {$set: updateData}, {runValidators: true}, (err, doc) => {
								if (err) return done(null, false);
								return done(null, doc);
							});
						}
						else {
							console.log('wrong default pw')
							return done(null, false);
						}
					}
					else if (catererStatus === 'verified') {
						// check caterer's password
						if (!caterer.validPassword(password))
						{
							console.log('wrong pw')
							return done(null, false);
						}
							
						// all is well, return caterer
						else
						{
							return done(null, caterer);
						}	
					}
				}	
			});
		});

	}));
	
	
	passport.use(new JWTStrategy({
		jwtFromRequest: req => req.cookies.jwt,
		secretOrKey: process.env.jwtSecretKey,
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