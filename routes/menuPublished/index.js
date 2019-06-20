var express = require('express');
var router = express.Router();
var Menu = require('../../models/menuPublished');
var ObjectId = require('mongodb').ObjectID;
var passport = require('passport');

router.get('/getmenuPublished/', passport.authenticate('jwt', {session: false}), (req, res) => {
    
    const { user } = req;
    var userID = user.catererID

    var matchquery;
    matchquery = {catererID: new ObjectId(userID)}

    var menuquery;
    menuquery =  Menu.find(matchquery).sort({createdAt: -1})

    menuquery.exec((err,doc) => {
        if (err) return res.status(500).send({ error: err });
        return res.status(200).json(doc);
    });
});

router.put('/update_menu_published', (req, res) => {

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
     Menu.findOneAndUpdate({_id: new ObjectId(_id)}, {$set:body}, { upsert: true }, (err, doc) => {
         if (err) {
             reject(err)
         }
         else {
             resolve(doc)
         }
     });
 
   });
 }

module.exports = router;