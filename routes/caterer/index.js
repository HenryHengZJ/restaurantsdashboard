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

router.get('/getcaterer', passport.authenticate('jwt', {session: false}), (req, res) => {

    const { user } = req;
    var userID = user.catererID

    var matchquery;
    matchquery = {_id: new ObjectId(userID)}

    Caterer.find(matchquery, (err,doc) => {
        if (err) return res.status(500).send({ error: err });
        return res.status(200).json(doc);
    });
}); 


router.put('/updatecaterer', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { user } = req;
    var userID = user.catererID

    var matchquery;
    matchquery = {_id: new ObjectId(userID)}
    
    var updateData = req.body

    Caterer.findOneAndUpdate(matchquery, {$set: updateData}, {upsert:true, new: true, runValidators: true, setDefaultsOnInsert: true}, (err, doc) => {
        if (err) return res.status(500).send({ error: err });
        return res.status(201).json(doc);
    });
});


router.put('/updatecatererpassword', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { user } = req;
    var userID = user.catererID

    var matchquery;
    matchquery = {_id: new ObjectId(userID), status: 'verified'}
    
    var updateData = req.body
    var originalpassword = updateData.originalpassword
    var newpassword = updateData.newpassword

    Caterer.findOne(matchquery, function(err, caterer) {
        // if there are any errors, return the error
        if (err) return res.status(500).send({ error: err });
        // if no caterer is found, return the message
        if (!caterer) return res.status(404).send({ error: err });
        // check caterer's password
        if (caterer.validPassword(originalpassword))
        {
            caterer.update({
                catererPassword: caterer.generateHash(newpassword)
            }).then(() => res.status(201).json(caterer));
        } 
    });
});

router.put('/updatecaterernameaddress', passport.authenticate('jwt', {session: false}), upload.any(), (req, res) => {
    const { user } = req;
    var userID = user.catererID

    var matchquery;
    matchquery = {_id: new ObjectId(userID)}
    
    var updateData = req.body
    var files = req.files;
    console.log(files)

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
    
    console.log(updateData)

    Caterer.findOneAndUpdate(matchquery, {$set: updateData}, {upsert:true, new: true, runValidators: true, setDefaultsOnInsert: true}, (err, doc) => {
        if (err) return res.status(500).send({ error: err });
        return res.status(201).json(doc);
    });
});

module.exports = router;
