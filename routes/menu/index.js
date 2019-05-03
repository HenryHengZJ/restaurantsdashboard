var express = require('express');
var router = express.Router();
var Menu = require('../../models/menu');
var ObjectId = require('mongodb').ObjectID;
var passport = require('passport');

router.get('/getmenu', passport.authenticate('jwt', {session: false}), (req, res) => {

    const { user } = req;
    var userID = user.catererID

    var matchquery;
    matchquery = {catererID: new ObjectId(userID)}

    Menu.find(matchquery, (err,doc) => {
        if (err) return res.status(500).send({ error: err });
        return res.status(200).json(doc);
    });
});

router.post('/addmenu', passport.authenticate('jwt', {session: false}), (req, res) => {
	
    const { user } = req;
    var userID = user.catererID
   
    var newData = req.body
	newData.catererID = new ObjectId(userID)
	
	console.log(JSON.stringify(newData))
	// create the new menu
	var newMenu 	= new Menu(newData);
	newMenu.save().then(() => res.json(newMenu));

});

router.put('/updatemenu', passport.authenticate('jwt', {session: false}), (req, res) => {
	
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
	
    Menu.findOneAndUpdate(matchquery, {$set: updateData}, {runValidators: true}, (err, doc) => {
        if (err) return res.status(500).send({ error: err });
		if (doc === null) return res.status(404).send({ error: 'document not found' });
        return res.status(201).json(doc);
    });
});

module.exports = router;
