var express = require('express');
var router = express.Router();
var Review = require('../../models/review');
var ObjectId = require('mongodb').ObjectID;
var passport = require('passport');
var moment = require('moment');

router.get('/getreview', passport.authenticate('jwt', {session: false}), (req, res) => {

    const { user } = req;
    var userID = user.catererID

	var matchquery = {};

    if (typeof req.query.lteDate !== 'undefined' && typeof req.query.gteDate !== 'undefined') {
		var gteDate = moment(req.query.gteDate, 'ddd, DD MMM YYYY').toDate()
		var lteDate = moment(req.query.lteDate, 'ddd, DD MMM YYYY').add(1, 'days').toDate()
        matchquery = {"createdAt":{$gte: new Date(gteDate.toISOString()),$lte: new Date(lteDate.toISOString())}}
    }

    matchquery.catererID = new ObjectId(userID)

    Review.aggregate([ 
        {$match: matchquery},
        {$lookup: {
            from: "caterer", 
            localField: "catererID", 
            foreignField: "_id", 
            as: "catererDetails" }
        },
        {$lookup: {
            from: "customer", 
            localField: "customerID", 
            foreignField: "_id", 
            as: "customerDetails" }
        },
        { $sort : { createdAt : -1 } }
      ], (err,doc) => {
         if (err) return res.status(500).send({ error: err });
         return res.status(200).json(doc);
      });
});

module.exports = router;
