var express = require('express');
var router = express.Router();
var Caterer = require('../../models/caterer');
var ObjectId = require('mongodb').ObjectID;
var passport = require('passport');

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

module.exports = router;
