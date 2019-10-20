var express = require('express');
var router = express.Router();
var Menu = require('../../models/menuPublished');
var ObjectId = require('mongodb').ObjectID;
var passport = require('passport');

router.get('/get_menu_published/', passport.authenticate('jwt', {session: false}), (req, res) => {
    
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


router.put('/update_menu_published', passport.authenticate('jwt', {session: false}), (req, res) => {
	
	const { user } = req;
    var userID = user.catererID

    var matchquery = {catererID: new ObjectId(userID)}

    var updatebody = req.body.updateMenu
  
    var bulkMenu = Menu.collection.initializeOrderedBulkOp();

    Menu.find(matchquery).exec((err,founddoc) => {
        if (err) {
            return res.status(500).send({ error: err });
        }
        else {
            if (founddoc && founddoc.length > 0) {

                bulkMenu.find(matchquery).delete();

                bulkMenu.execute((err, doc) => {
                    if (err) {
                        return res.status(500).send({ error: err })
                    }
                    else if (doc === null) {
                        return res.status(404).send({ error: 'document not found' })
                    }
                    else {
                        var bulkMenuToUpdate = Menu.collection.initializeOrderedBulkOp();
            
                        var toBeUpdateBody = JSON.parse(updatebody)
            
                        for (var i = 0; i < toBeUpdateBody.length; i++) {
                            var newitem = new Menu(toBeUpdateBody[i])
                            bulkMenuToUpdate.insert(newitem);  
                        }
            
                        bulkMenuToUpdate.execute((err, updateddoc) => {
                            if (err) return res.status(500).send({ error: err });
                            if (doc === null) return res.status(404).send({ error: 'document not found' });
                            return res.status(201).json(updateddoc);
                        });
            
                    }
                });
            }
            else {
                var bulkMenuToUpdate = Menu.collection.initializeOrderedBulkOp();
            
                var toBeUpdateBody = JSON.parse(updatebody)

                for (var i = 0; i < toBeUpdateBody.length; i++) {
                    var newitem = new Menu(toBeUpdateBody[i])
                    bulkMenuToUpdate.insert(newitem);  
                }
    
                bulkMenuToUpdate.execute((err, updateddoc) => {
                    if (err) return res.status(500).send({ error: err });
                    if (updateddoc === null) return res.status(404).send({ error: 'document not found' });
                    return res.status(201).json(updateddoc);
                });
            }
        }
    });

});

/*
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

}); */

router.delete('/delete_menu_published', passport.authenticate('jwt', {session: false}), (req, res) => {
	
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