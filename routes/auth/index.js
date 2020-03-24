var express = require('express');
var router = express.Router();
var randtoken = require('rand-token') 
const jwt = require('jsonwebtoken');
var passport = require('passport');
var Caterer = require('../../models/caterer');
const crypto = require('crypto');
var mail = require('../../nodeMailerWithTemp');
var ObjectId = require('mongodb').ObjectID;
var bcrypt   = require('bcrypt-nodejs');
require('dotenv').config();

router.post('/generatepw', (req, res) => {
    var newpw = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);
    return res.status(200).json({
        'newpw': newpw
    });
});

router.post('/caterersignup', (req, res) => {
	
    var email = req.body.catererEmail.toLowerCase();

	Caterer.findOne({ 'catererEmail' :  email }, function(err, caterer) {
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

router.post('/resetpassword', (req, res) => {
	
    var email = req.body.catererEmail.toLowerCase();

	Caterer.findOne({ 'catererEmail' :  email }, function(err, caterer) {
		// if there are any errors, return the error
		if (err) {
			return res.status(404).json({
				'message': err
			});
		}
		// check to see if theres already a caterer with that email
		else if (!caterer) {
			return res.status(404).json({
				'message': 'user not exist'
			});
		} 
		else {
			// create the caterer
			var newCaterer = new Caterer();
            const token = crypto.randomBytes(20).toString('hex');
            caterer.update({
                resetPasswordToken: token,
                resetPasswordExpires: Date.now() + 360000,
            }).then(() => 
                {
                    var urlhost = "";
                    if (process.env.NODE_ENV === 'development') {
                        urlhost = "http://localhost:3000/#"
                    }
                    else  if (process.env.NODE_ENV === 'production') {
                        urlhost = "https://foodiebeecaterer.herokuapp.com/#"
                    }
                    mail.sendResetPasswordEmail('/templates/resetpassword/email.html', email, `${urlhost}/resetpassword/${token}`);
                    res.status(200).json({
                        'catererID': caterer._id,
                    });
                }
            );
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
            console.log('error = ', error)
          res.status(400).json({ 'error': error });
        }
        else {
            /** This is what ends up in our JWT */
            var refreshToken = randtoken.uid(256) 
            const payload = {
                catererID: user._id,
                catererName: user.catererName,
                catererEmail: user.catererEmail,
                refreshToken: refreshToken,
            };

            /** assigns payload to req.user */
            req.login(payload, {session: false}, (error) => {
                if (error) {
                    console.log('6')
                    res.status(400).send({ error });
                }
                else {
                    /** generate a signed json web token and return it in the response */
                    const token = jwt.sign(payload, process.env.jwtSecretKey, {expiresIn: '7d'});
                    payload.token = token
                    /** assign our jwt to the cookie */
                    res.cookie('jwt', token, { httpOnly: true});
                    res.cookie('refreshToken', refreshToken);
                    res.status(200).json(payload);
                }
            });
        }
      },
    )(req, res);
});

router.put('/updatepassword', (req, res) => {

	var matchquery;
    matchquery = {_id: new ObjectId(req.query._id)}

    var userpassword = req.body.catererPassword
    var updateData = {
        catererPassword: bcrypt.hashSync(userpassword, bcrypt.genSaltSync(8), null)
    }

    Caterer.findOneAndUpdate(matchquery, {$set: updateData}, {runValidators: true}, (err, doc) => {
        if (err) return res.status(500).send({ error: err });
        return res.status(201).json(doc);
    });
});

router.get('/getresetpassword', (req, res) => {
    Caterer.findOne({
        resetPasswordToken: req.query.resetPasswordToken,
      }).then((caterer) => {
        if (caterer === null) {
          console.error('password reset link is invalid');
          res.status(403).send('password reset link is invalid');
        } 
        else if (new Date() > new Date(caterer.resetPasswordExpires)) {
            console.error('password reset link has expired');
            res.status(403).send('password reset link has expired');
        }
        else {
          res.status(200).send({
            'catererID': caterer._id,
          });
        }
      });
});

router.get('/logout', (req, res) => {
    req.logout();
    res.clearCookie('refreshToken')
    res.status(200).clearCookie('jwt', {path: '/'}).json({message: "successfully logout"});
});

module.exports = router;