var express = require('express');
var router = express.Router();
var Order = require('../../models/order');
var Menu = require('../../models/menu');
var ObjectId = require('mongodb').ObjectID;
var passport = require('passport');
var moment = require('moment');
var mail = require('../../nodeMailerWithTemp');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_KEY);

router.get('/countorder', passport.authenticate('jwt', {session: false}), (req, res) => {

    const { user } = req;
    var userID = user.catererID
    var matchquery = {}
	matchquery.catererID = new ObjectId(userID);

    if (typeof req.query.lteDate !== 'undefined' && typeof req.query.gteDate !== 'undefined') {
		var gteDate = moment(req.query.gteDate, 'DD MMM, YYYY').toDate()
		var lteDate = moment(req.query.lteDate, 'DD MMM, YYYY').add(1, 'days').toDate()
        matchquery.createdAt = {$gte: new Date(gteDate.toISOString()),$lte: new Date(lteDate.toISOString())}
    }

    if (typeof req.query.paymentStatus !== 'undefined') {
        matchquery.paymentStatus = req.query.paymentStatus;
    }
	
    Order.countDocuments(matchquery, function(err, c) {
        if (err) {
            return res.status(500).send({ error: err });
        }
        else {
            console.log(c)
            return res.status(200).json({totalcount: c});
        }
    });
	
});

router.get('/getorder', passport.authenticate('jwt', {session: false}), (req, res) => {

    const { user } = req;
    var userID = user.catererID
    var matchquery = {}
	matchquery.catererID = new ObjectId(userID);

    if (typeof req.query.lteDate !== 'undefined' && typeof req.query.gteDate !== 'undefined') {
		var gteDate = moment(req.query.gteDate, 'DD MMM, YYYY').toDate()
		var lteDate = moment(req.query.lteDate, 'DD MMM, YYYY').add(1, 'days').toDate()
        matchquery.createdAt = {$gte: new Date(gteDate.toISOString()),$lte: new Date(lteDate.toISOString())}
    }

    if (typeof req.query.paymentStatus !== 'undefined') {
        matchquery.paymentStatus = req.query.paymentStatus;
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
    var matchquery = {}
	matchquery.catererID = new ObjectId(userID);

    if (typeof req.query.lteDate !== 'undefined' && typeof req.query.gteDate !== 'undefined') {
		var gteDate = moment(req.query.gteDate, 'DD MMM, YYYY').toDate()
		var lteDate = moment(req.query.lteDate, 'DD MMM, YYYY').add(1, 'days').toDate()
        matchquery.createdAt = {$gte: new Date(gteDate.toISOString()),$lte: new Date(lteDate.toISOString())}
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
            orderID : { $last: '$_id' },
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

router.put('/acceptorder', passport.authenticate('jwt', {session: false}), (req, res) => {
    var matchquery = {};
    var updateData = {
        orderStatus: "accepted",
	    paymentStatus: "succeeded"
    }

    if (typeof req.body.orderID !== 'undefined') {
        matchquery._id = new ObjectId(req.body.orderID)
    }

    Order.findOneAndUpdate(matchquery, {$set: updateData}, {returnOriginal: false, runValidators: true}, (err, doc) => {
        if (err) {
            return res.status(500).send({ error: err });
         }
         else {
            var paymentIntentID = doc.paymentIntentID
            console.log('paymentIntentID = ', paymentIntentID)
            stripe.paymentIntents.confirm(paymentIntentID, function(err, intent) {
                if (err) {
                    return res.status(500).send({ error: err });
                 }
                 else {
                    var arrayOfMenuID = []
                    var orderitems = doc.orderItem
                    for(var i = 0; i < orderitems.length; i++){
                        arrayOfMenuID.push(orderitems[i].menuID)
                    }

                    //var arrayOfMenuID = [new ObjectId("5cc81203cdded1249f96d277"), new ObjectId("5cc81269cdded1249f96d27c")]
	
                    var menumatchquery = {_id: { $in: arrayOfMenuID}}
                
                    var bulkMenu = Menu.collection.initializeOrderedBulkOp();
                    bulkMenu.find(menumatchquery).update({$inc: {soldamount:1}});
                    bulkMenu.execute((err, menudoc) => {
                        if (err) {
                            return res.status(500).send({ error: err });
                         }
                         else {
                            getOrder(req.body.orderID, function(err, orderdoc) {
                                if (err) {
                                    return res.status(500).send({ error: err });
                                }
                                else {
                                    if (orderdoc.length > 0) {
                                        var orderdetails = orderdoc[0]
                                        var customerEmail = orderdoc[0].customerDetails[0].customerEmail
                                        var catererEmail = orderdoc[0].catererDetails[0].catererEmail
                                        var catererName = orderdoc[0].catererDetails[0].catererName
                                        mail.sendCustomerOrderEmail('/templates/customer_order/email.html', orderdetails, catererName, customerEmail);
                                        mail.sendCatererOrderEmail('/templates/caterer_order/email.html', orderdetails, catererEmail);
                                        return res.status(201).json(orderdoc);
                                    }
                                    else {
                                        return res.status(500).send({ error: "doc not found" });
                                    } 
                                }
                            })
                         }
                    });
                 }
            });
         }
    });
});


router.put('/rejectorder', (req, res) => {
    var matchquery = {};
    var updateData = {
        orderStatus: "rejected",
	    paymentStatus: "incomplete"
    }

    if (typeof req.body.orderID !== 'undefined') {
        matchquery._id = new ObjectId(req.body.orderID)
    }

    Order.findOneAndUpdate(matchquery, {$set: updateData}, {returnOriginal: false, runValidators: true}, (err, doc) => {
        if (err) {
            return res.status(500).send({ error: err });
         }
         else {
            getOrder(req.body.orderID, function(err, orderdoc) {
                if (err) {
                    return res.status(500).send({ error: err });
                }
                else {
                    if (orderdoc.length > 0) {
                        var orderdetails = orderdoc[0]
                        var customerEmail = orderdoc[0].customerDetails[0].customerEmail
                        var catererEmail = orderdoc[0].catererDetails[0].catererEmail
                        var catererName = orderdoc[0].catererDetails[0].catererName
                        
                        mail.sendCustomerOrderEmail('/templates/customer_order/email.html', orderdetails, catererName, customerEmail);
                        mail.sendCatererOrderEmail('/templates/caterer_order/email.html', orderdetails, catererEmail);
                        return res.status(201).json(orderdoc);
                    }
                    else {
                        return res.status(500).send({ error: "doc not found" });
                    } 
                }
            })
         }
    });
});

var getOrder = function(orderID, callback) {
    var matchquery = {};

    if (typeof orderID !== 'undefined') {
        matchquery._id = new ObjectId(orderID)
    }

	Order.aggregate([ 
        {$match: matchquery},
        {$lookup: {
            from: "customer", 
            localField: "customerID", 
            foreignField: "_id", 
            as: "customerDetails" }
        },
        {$lookup: {
            from: "caterer", 
            localField: "catererID", 
            foreignField: "_id", 
            as: "catererDetails" }
        },
        { $sort : { createdAt : -1 } }
      ], (err,doc) => {
         if (err) {
            callback (err)
         }
         else {
            callback (null, doc)
         }
      });
};

module.exports = router;
