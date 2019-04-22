var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
var passport = require('passport');
var Caterer = require('../../models/caterer');

router.post('/caterersignup', (req, res) => {
	
    var email = req.body.catererEmail.toLowerCase();

	Caterer.findOne({ 'email' :  email }, function(err, caterer) {
		// if there are any errors, return the error
		if (err) {
			return res.status(404).json({
				'message': err
			});
		}
		// check to see if theres already a caterer with that email
		if (caterer) {
			return res.status(404).json({
				'message': 'email existed'
			});
		} 
		else {
			// create the caterer
			var newCaterer = new Caterer();
			newCaterer.catererEmail    	     = email;
			newCaterer.catererPassword 	     = newCaterer.generateHash(req.body.catererPassword);
			newCaterer.catererName	 	     = req.body.catererName;
            newCaterer.catererPhoneNumber    = req.body.catererPhoneNumber;
            newCaterer.catererAddress        = req.body.catererAddress;
			newCaterer.save().then(() => res.json(newCaterer));
		}
	});
});

router.post('/catererlogin', (req, res) => {

   passport.authenticate(
      'caterer-login',
      { session: false },
      (error, user) => {
  
        if (error || !user) {
            console.log('5')
            console.log('user = ', user)
          res.status(400).json({ 'error': error });
        }
  
        /** This is what ends up in our JWT */
        var myDate = new Date();
        myDate.setHours(myDate.getHours() + 24);
        console.log(myDate)
        const payload = {
            catererID: user._id,
            catererEmail: user.catererEmail,
            expires: myDate,
        };
  
        /** assigns payload to req.user */
        req.login(payload, {session: false}, (error) => {
          if (error) {
            console.log('6')
            res.status(400).send({ error });
          }
  
          /** generate a signed json web token and return it in the response */
          const token = jwt.sign(payload, "FoodieBeeSecretKey", {expiresIn: '24h'} );
  
          /** assign our jwt to the cookie */
          res.cookie('jwt', token, { httpOnly: true});
          res.status(200).json({ 'userID': user._id });
        });
      },
    )(req, res);
});

router.get('/testget', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { user } = req;
    console.log('req = ', user)
    res.status(200).send({ user });
});

router.get('/logout', (req, res) => {
    req.logout();
    res.status(200).clearCookie('jwt', {path: '/'}).json({message: "successfully logout"});
});

module.exports = router;