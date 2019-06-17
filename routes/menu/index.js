var express = require('express');
var router = express.Router();
var Menu = require('../../models/menu');
var ObjectId = require('mongodb').ObjectID;
var passport = require('passport');
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

router.get('/getmenu', passport.authenticate('jwt', {session: false}), (req, res) => {

    const { user } = req;
    var userID = user.catererID

    var matchquery;
    matchquery = {catererID: new ObjectId(userID)}

    var menuquery;

    if (typeof req.query.dashboard !== 'undefined' && req.query.dashboard === 'true') {
        menuquery =  Menu.find(matchquery).sort({soldamount: -1}).limit(6)
    }
    else {
        menuquery =  Menu.find(matchquery).sort({createdAt: -1})
    }

    menuquery.exec((err,doc) => {
        if (err) return res.status(500).send({ error: err });
        return res.status(200).json(doc);
    });
});

router.post('/addmenu', passport.authenticate('jwt', {session: false}), upload.any(), (req, res) => {
	
    const { user } = req;
    var userID = user.catererID
   
    var newData = req.body
    if (typeof newData.markitem !== 'undefined') {
        newData.markitem = JSON.parse(newData.markitem)
    }
    if (typeof newData.selection !== 'undefined') {
        newData.selection = JSON.parse(newData.selection)
    }
	newData.catererID = new ObjectId(userID)
	
	var files = req.files;
	console.log(files)
	if (files.length > 0) {
		newData.src  = 'https://s3-eu-west-1.amazonaws.com/foodiebeemenuitem/' + req.files[0].key
	}
	
	console.log(JSON.stringify(newData))
	// create the new menu
	var newMenu 	= new Menu(newData);
	newMenu.save().then(() => res.json(newMenu));

});

router.put('/updatemenu', passport.authenticate('jwt', {session: false}), upload.any(), (req, res) => {
	
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
    if (typeof updateData.selection !== 'undefined') {
        updateData.selection = JSON.parse(updateData.selection)
    }

	var files = req.files;
	console.log(files)
	if (files.length > 0) {
		updateData.src  = 'https://s3-eu-west-1.amazonaws.com/foodiebeemenuitem/' + req.files[0].key
	}
	
    Menu.findOneAndUpdate(matchquery, {$set: updateData}, {runValidators: true}, (err, doc) => {
        if (err) return res.status(500).send({ error: err });
		if (doc === null) return res.status(404).send({ error: 'document not found' });
        return res.status(200).json(doc);
    });
});


router.delete('/deletemenu', passport.authenticate('jwt', {session: false}), (req, res) => {
	
	const { user } = req;
    var userID = user.catererID

    var matchquery = {};
    if (typeof req.query._id !== 'undefined') {
        matchquery= {_id: new ObjectId(req.query._id), catererID: new ObjectId(userID)}
    }

    Menu.remove(matchquery, (err, doc) => {
        if (err) return res.status(500).send({ error: err });
        return res.status(200).json(doc);
    });
});


///////////////////BULK OPERATION///////////////////////////////////////////

/*router.put('/bulkupdatemenu', passport.authenticate('jwt', {session: false}), (req, res) => {
	
	const { user } = req;
    var userID = user.catererID

    var matchquery = {catererID: new ObjectId(userID)}
    if (typeof req.query.categoryname !== 'undefined') {
        matchquery.categoryname = req.query.categoryname
    }
   
	var updateData = req.body

    var bulkMenu = Menu.collection.initializeOrderedBulkOp();
    bulkMenu.find(matchquery).update({$set: updateData});
    bulkMenu.execute((err, doc) => {
        if (err) return res.status(500).send({ error: err });
		if (doc === null) return res.status(404).send({ error: 'document not found' });
        return res.status(200).json(doc);
    });
});*/

router.put('/bulkupdatemenu', (req, res) => {

    var arrayOfMenuID = [new ObjectId("5cc81203cdded1249f96d277"), new ObjectId("5cc81269cdded1249f96d27c")]
	
    var matchquery = {_id: { $in: arrayOfMenuID}}
   
    var bulkMenu = Menu.collection.initializeOrderedBulkOp();
    bulkMenu.find(matchquery).update({$inc: {soldamount:1}});
    bulkMenu.execute((err, doc) => {
        if (err) return res.status(500).send({ error: err });
		if (doc === null) return res.status(404).send({ error: 'document not found' });
        return res.status(200).json(doc);
    });
});

router.delete('/bulkdeletemenu', passport.authenticate('jwt', {session: false}), (req, res) => {
	
	const { user } = req;
    var userID = user.catererID

    var matchquery = {catererID: new ObjectId(userID)}
    if (typeof req.query.categoryname !== 'undefined') {
        matchquery.categoryname = req.query.categoryname
    }
  
    var bulkMenu = Menu.collection.initializeOrderedBulkOp();
    bulkMenu.find(matchquery).delete();
    bulkMenu.execute((err, doc) => {
        if (err) return res.status(500).send({ error: err });
		if (doc === null) return res.status(404).send({ error: 'document not found' });
        return res.status(200).json(doc);
    });
});

module.exports = router;
