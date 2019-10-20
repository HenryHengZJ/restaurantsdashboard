var express = require('express');
var router = express.Router();
var LunchMenu = require('../../models/lunchMenu');
var ObjectId = require('mongodb').ObjectID;
var passport = require('passport');
var moment = require('moment');
var multer = require('multer');
var multerS3 = require('multer-s3')
var aws = require('aws-sdk')
var s3 = require('../../config/s3');

let upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'foodiebeemenuitem',
        acl: 'public-read',
        metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
        cb(null, Date.now().toString()+'_'+file.originalname)
        }
    })
})

router.get('/getLunchMenu', passport.authenticate('jwt', {session: false}), (req, res) => {

    const { user } = req;
    var userID = user.catererID

    var matchquery;
    matchquery = {catererID: new ObjectId(userID)}
    console.log(matchquery)

    var menuquery;

    if (typeof req.query.dashboard !== 'undefined' && req.query.dashboard === 'true') {
        menuquery =  LunchMenu.find(matchquery).sort({soldamount: -1}).limit(6)
    }
    else {
        //menuquery =  LunchMenu.find(matchquery).sort({createdAt: -1})
        menuquery =  LunchMenu.find(matchquery)
    }

    menuquery.exec((err,doc) => {
        if (err) return res.status(500).send({ error: err });
        console.log(doc)
        return res.status(200).json(doc);
    });
});

router.post('/addLunchMenu', passport.authenticate('jwt', {session: false}), upload.any(), (req, res) => {
	
    const { user } = req;
    var userID = user.catererID
   
    var newData = req.body
    if (typeof newData.markitem !== 'undefined') {
        newData.markitem = JSON.parse(newData.markitem)
    }
	newData.catererID = new ObjectId(userID)

	var files = req.files;
	console.log(files)
	if (files.length > 0) {
		newData.src  = 'https://s3-eu-west-1.amazonaws.com/foodiebeemenuitem/' + req.files[0].key
	}
	
	console.log(JSON.stringify(newData))
	// create the new menu
	var newMenu 	= new LunchMenu(newData);
	newMenu.save().then(() => res.json(newMenu));

});

router.put('/updateLunchMenu', passport.authenticate('jwt', {session: false}), upload.any(), (req, res) => {
	
	const { user } = req;
    var userID = user.catererID

    var matchquery;
    if (typeof req.query._id === 'undefined') {
        matchquery= {_id: new ObjectId(), catererID: new ObjectId(userID)}
    }
    else {
        matchquery = {_id: new ObjectId(req.query._id), catererID: new ObjectId(userID)}
    }
   
    var updateData = req.body
    if (typeof updateData.markitem !== 'undefined') {
        updateData.markitem = JSON.parse(updateData.markitem)
    }

	var files = req.files;

	if (files.length > 0) {
		updateData.src  = 'https://s3-eu-west-1.amazonaws.com/foodiebeemenuitem/' + req.files[0].key
	}
	
    LunchMenu.findOneAndUpdate(matchquery, {$set: updateData}, {runValidators: true}, (err, doc) => {
        if (err) return res.status(500).send({ error: err });
		if (doc === null) return res.status(404).send({ error: 'document not found' });
        return res.status(201).json(doc);
    });
});
 

router.delete('/deleteLunchMenu', passport.authenticate('jwt', {session: false}), (req, res) => {
	
	const { user } = req;
    var userID = user.catererID

    var matchquery = {};
    if (typeof req.query._id !== 'undefined') {
        matchquery= {_id: new ObjectId(req.query._id), catererID: new ObjectId(userID)}
    }

    LunchMenu.remove(matchquery, (err, doc) => {
        if (err) return res.status(500).send({ error: err });
        return res.status(200).json(doc);
    });
});

module.exports = router;