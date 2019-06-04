var express = require('express');
var router = express.Router();
var Order = require('../../models/order');
var ObjectId = require('mongodb').ObjectID;
var passport = require('passport');
var moment = require('moment');

router.get('/getorder', passport.authenticate('jwt', {session: false}), (req, res) => {

    const { user } = req;
    var userID = user.catererID

	var matchquery = {catererID: new ObjectId(userID)};

    if (typeof req.query.lteDate !== 'undefined' && typeof req.query.gteDate !== 'undefined') {
		var gteDate = moment(req.query.gteDate, 'DD MMM, YYYY').toDate()
		var lteDate = moment(req.query.lteDate, 'DD MMM, YYYY').add(1, 'days').toDate()
        matchquery = {"createdAt":{$gte: new Date(gteDate.toISOString()),$lte: new Date(lteDate.toISOString())}}
    }
	
    /*Order.find(matchquery).sort({createdAt: -1}).exec((err,doc) => {
        if (err) return res.status(500).send({ error: err });
        return res.status(200).json(doc);
    });*/

	Order.aggregate([ 
        {$match: matchquery},
        {$lookup: {
            from: "customer", 
            localField: "customerID", 
            foreignField: "_id", 
            as: "customerDetails" }
        },
        { $sort : { createdAt : -1 } }
      ], (err,doc) => {
        if (err) {
            return res.status(500).send({ error: err });
        }
        else {
            console.log(doc)
            return res.status(200).json(doc);
        }
      });
});

router.get('/getorder_customer', passport.authenticate('jwt', {session: false}), (req, res) => {

    const { user } = req;
    var userID = user.catererID

	var matchquery = {catererID: new ObjectId(userID)};

    if (typeof req.query.lteDate !== 'undefined' && typeof req.query.gteDate !== 'undefined') {
		var gteDate = moment(req.query.gteDate, 'DD MMM, YYYY').toDate()
		var lteDate = moment(req.query.lteDate, 'DD MMM, YYYY').add(1, 'days').toDate()
        matchquery = {"createdAt":{$gte: new Date(gteDate.toISOString()),$lte: new Date(lteDate.toISOString())}}
    }

    Order.aggregate([
        {$match: matchquery},
        {$lookup: {
            from: "customer", 
            localField: "customerID", 
            foreignField: "_id", 
            as: "customerDetails" }
        },
        {$group: {
            _id: '$customerID',
            orderItem : { $last: '$orderItem' },
            catererID : { $last: '$catererID' },
            totalOrderPrice : { $last: '$totalOrderPrice' },
            orderType : { $last: '$orderType' },
            orderStatus : { $last: '$orderStatus' },
            paymentType : { $last: '$paymentType' },
            customerDetails : { $last: '$customerDetails' },
            createdAt : { $last: '$createdAt' },
            updatedAt : { $last: '$updatedAt' },
            count: { $sum: 1 }
        }},
        { $sort : { createdAt : -1 } },
    ], (err,doc) => {
        if (err) {
            return res.status(500).send({ error: err });
        }
        else {
            console.log(doc)
            return res.status(200).json(doc);
        }
     });
      
});

router.put('/updateorder', (req, res) => {
    var matchquery;
    if (typeof req.query._id === 'undefined') {
        matchquery= {_id: new ObjectId()}
    }
    else {
        matchquery = {_id: new ObjectId(req.query._id)}
    }
   
    var updateData = req.body

    Order.findOneAndUpdate(matchquery, {$set: updateData}, {upsert:true, new: true, runValidators: true, setDefaultsOnInsert: true}, (err, doc) => {
        if (err) return res.status(500).send({ error: err });
        return res.status(201).json(doc);
    });
});

module.exports = router;
