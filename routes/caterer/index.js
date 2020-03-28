var express = require('express');
var router = express.Router();
var Caterer = require('../../models/caterer');
var ObjectId = require('mongodb').ObjectID;
var passport = require('passport');
var multer = require('multer');
var multerS3 = require('multer-s3')
var aws = require('aws-sdk')
var s3 = require('../../config/s3');
var bcrypt   = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'foodiebeecaterer',
        acl: 'public-read',
        metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
        cb(null, Date.now().toString()+'_'+file.originalname)
        }
    })
})

router.get('/getcaterer', authenticate(), (req, res) => {

    const { user, jwttoken } = req;
    var userID = user.catererID
    var token = jwttoken

    var matchquery;
    matchquery = {_id: new ObjectId(userID)}

    Caterer.find(matchquery, (err,doc) => {
        if (err) {
            return res.status(500).send({ error: err });
        }
        else {
            if (typeof token !== 'undefined') {
                res.cookie('jwt', token, { httpOnly: true,});
            }
            return res.status(200).json(doc);
        }
    });
}); 


router.put('/updatecaterer', authenticate(), (req, res) => {

    const { user, jwttoken } = req;
    var userID = user.catererID
    var token = jwttoken

    var matchquery;
    matchquery = {_id: new ObjectId(userID)}
    
    var updateData = req.body

    Caterer.findOneAndUpdate(matchquery, {$set: updateData}, {upsert:true, new: true, runValidators: true, setDefaultsOnInsert: true}, (err, doc) => {
        if (err) {
            return res.status(500).send({ error: err });
        }
        else {
            if (typeof token !== 'undefined') {
                res.cookie('jwt', token, { httpOnly: true,});
            }
            return res.status(201).json(doc);
        }
    });
});


router.put('/updatecatererpassword', authenticate(), (req, res) => {

    const { user, jwttoken } = req;
    var userID = user.catererID
    var token = jwttoken

    var matchquery;
    matchquery = {_id: new ObjectId(userID)}

    var newCaterer = new Caterer();

    var updateData = {
        catererPassword : newCaterer.generateHash(req.body.newpassword),
        status : 'verified'
    }

    Caterer.findOneAndUpdate(matchquery, {$set: updateData}, {upsert:true, runValidators: true, setDefaultsOnInsert: true}, (err, doc) => {
        if (err){
            return res.status(500).send({ error: err });
        }
        else {
            if (typeof token !== 'undefined') {
                res.cookie('jwt', token, { httpOnly: true,});
            }
            return res.status(201).json(doc);
        }
    });

});

router.put('/updatecaterernameaddress', authenticate(), upload.any(), (req, res) => {

    const { user, jwttoken } = req;
    var userID = user.catererID
    var token = jwttoken

    var matchquery;
    matchquery = {_id: new ObjectId(userID)}
    
    var updateData = req.body
    var files = req.files;

	if (files.length > 0) {
       for (let i = 0; i < files.length; i++) {
        if (req.files[i].fieldname == "logofiles") {
            updateData.profilesrc  = 'https://s3-eu-west-1.amazonaws.com/foodiebeecaterer/' + req.files[i].key
        }
        else if (req.files[i].fieldname == "coverimgfiles") {
            updateData.coversrc  = 'https://s3-eu-west-1.amazonaws.com/foodiebeecaterer/' + req.files[i].key
        }
       }
    }
  
    Caterer.findOneAndUpdate(matchquery, {$set: updateData}, {upsert:true, new: true, runValidators: true, setDefaultsOnInsert: true}, (err, doc) => {
        if (err) {
            return res.status(500).send({ error: err });
        }
        else {
            if (typeof token !== 'undefined') {
                res.cookie('jwt', token, { httpOnly: true,});
            }
            return res.status(201).json(doc);
        }
    });
});


function authenticate() {
    return (req, res, next) => {
      passport.authenticate('jwt', {session: false}, (err, user, info) => {
        if (err) {
            console.log( 'err = ', err)
            next(err);
        } 
        else if (info) {

            if (info.name === 'TokenExpiredError') {

               if (req && req.cookies['jwt'] && req.cookies['refreshToken']) {

                    const refresh_token = req.cookies['refreshToken']
                    const jwttoken = req.cookies['jwt']
                    var decoded = jwt.decode(jwttoken, {complete: true});
                    var decodedPayload = decoded.payload
  
                    if (decodedPayload.refreshToken === refresh_token) {
                        const payload = {
                            catererID: decodedPayload.catererID,
                            catererName: decodedPayload.catererName,
                            catererEmail: decodedPayload.catererEmail,
                            refreshToken: decodedPayload.refreshToken,
                        };
                        const token = jwt.sign(payload, process.env.jwtSecretKey, {expiresIn: '7d'} );
                        req.user = payload;
                        req.jwttoken = token
                        next();
                    }
                    else {
                        res.status(401).send('Unauthorized');
                    }
                }
                else {
                    res.status(401).send('Unauthorized');
                }
            }
            //No JWT Token (jwt in cookies is gone)
            else {
                if (req && req.cookies['refreshToken']) {
                    const refresh_token = req.cookies['refreshToken']
                    var decoded = jwt.decode(refresh_token, {complete: true});
                    var decodedPayload = decoded.payload
                    const payload = {
                        catererID: decodedPayload.catererID,
                        catererName: decodedPayload.catererName,
                        catererEmail: decodedPayload.catererEmail,
                        refreshToken: refresh_token,
                    };
                    const token = jwt.sign(payload, process.env.jwtSecretKey, {expiresIn: '7d'} );
                    req.user = payload;
                    req.jwttoken = token
                    next(); 
                }
                else {
                    res.status(401).send('Unauthorized');
                }
            }
        } 
        else {
            console.log(user)
            req.user = user;
            next();
        }
      })(req, res, next);
    };
  }


module.exports = router;
