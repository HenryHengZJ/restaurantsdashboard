var express = require('express');
var router = express.Router();
var Review = require('../../models/review');
var ObjectId = require('mongodb').ObjectID;
var passport = require('passport');

router.get('/getreview', passport.authenticate('jwt', {session: false}), (req, res) => {

    const { user } = req;
    var userID = user.catererID

    var matchquery;
    matchquery = {catererID: new ObjectId(userID)}

    Review.find(matchquery, (err,doc) => {
        if (err) return res.status(500).send({ error: err });
        return res.status(200).json(doc);
    });
});

module.exports = router;
