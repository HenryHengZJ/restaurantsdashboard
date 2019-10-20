var express = require('express');
var router = express.Router();
var LunchMenu = require('../../models/lunchMenuPublished');
var ObjectId = require('mongodb').ObjectID;
var passport = require('passport');
var moment = require('moment');


router.get('/get_lunchmenu_published/', passport.authenticate('jwt', {session: false}), (req, res) => {
    
    const { user } = req;
    var userID = user.catererID

    var matchquery;
    matchquery = {catererID: new ObjectId(userID)}

    var menuquery;
    menuquery =  LunchMenu.find(matchquery).sort({createdAt: -1})

    menuquery.exec((err,doc) => {
        if (err) return res.status(500).send({ error: err });
        return res.status(200).json(doc);
    });
});

router.put('/update_lunchmenu_published', (req, res) => {

    var updateData = req.body
    var toBeUpdateID = JSON.parse(req.body.toBeUpdateID)
    var toBeUpdateBody = JSON.parse(req.body.toBeUpdateBody)
    let promiseArr = [];

    for (var i = 0; i < toBeUpdateID.length; i++) {
		var _id = toBeUpdateID[i]
		var body = toBeUpdateBody[i]
		promiseArr.push(runUpdate(_id, body))
	}
	
	Promise.all(promiseArr)
	.then((result) => {
		console.log('result = ', result)
		return res.status(201).json("updated");
	})
	.catch((err) => {
		console.log(err)
		return res.status(500).send({ error: err });
	})

}); 


function runUpdate(_id, body) {
    return new Promise((resolve, reject) => {
      //you update code here
     console.log("_id= ", _id)
     LunchMenu.findOneAndUpdate({_id: new ObjectId(_id)}, {$set:body}, { upsert: true }, (err, doc) => {
         if (err) {
             reject(err)
         }
         else {
             resolve(doc)
         }
     });
 
   });
 }

 router.delete('/delete_lunchmenu_published', passport.authenticate('jwt', {session: false}), (req, res) => {
	
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

/*router.put('/updateLunchMenuPublished', (req, res) => {

    var matchquery;
    if (typeof req.query._id === 'undefined') {
        matchquery= {_id: new ObjectId()}
    }
    else {
        matchquery = {_id: new ObjectId(req.query._id)}
    }
   
    var updateData = req.body

    LunchMenu.findOneAndUpdate(matchquery, {$set: updateData}, {upsert: true, new: true, runValidators: true}, (err, doc) => {
        if (err) return res.status(500).send({ error: err });
        return res.status(201).json(doc);
    });
});*/

 
module.exports = router;