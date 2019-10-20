var express = require('express');
var router = express.Router();
var LunchOrder = require('../../models/lunchOrder');
var Menu = require('../../models/menu');
var ObjectId = require('mongodb').ObjectID;
var passport = require('passport');
var moment = require('moment');
var mail = require('../../nodeMailerWithTemp');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_KEY);

router.get('/getnewlunchorder', (req, res) => {
	var matchquery = {};

    if (typeof req.query.lteDate !== 'undefined' && typeof req.query.gteDate !== 'undefined') {
		var gteDate = moment(req.query.gteDate, 'DD MMM, YYYY').toDate()
		var lteDate = moment(req.query.lteDate, 'DD MMM, YYYY').add(1, 'days').toDate()
        matchquery = {"orderDate":{$gte: gteDate.toISOString(),$lte: lteDate.toISOString()}}
    }
	
	LunchOrder.aggregate([ 
       {$match: matchquery},
	   {$lookup: {
            from: "company", 
            localField: "customerCompanyID", 
            foreignField: "_id", 
            as: "customerCompanyDetails" }
        },
        {$lookup: {
            from: "caterer", 
            localField: "catererID", 
            foreignField: "_id", 
            as: "catererDetails" }
        }
     ], (err,doc) => {
		if (err) {
			return res.status(500).send({ error: err });
		}
		else{

            var totalresult = doc.reduce(function(v, b) {
                v[b.catererID] = v[b.catererID] || [];
                v[b.catererID].push(b);
                return v;
            }, Object.create(null));

            var finaldataAry = [];

            for (var parentkey in totalresult) {
              
                var result = totalresult[parentkey].reduce(function(r, a) {
                    r[a.customerCompanyID] = r[a.customerCompanyID] || [];
                    r[a.customerCompanyID].push(a);
                    return r;
                }, Object.create(null));

                var dataAry = [];

                for (var key in result) {
                    
                    var itemAry = [];
                
                    var itemresult = result[key].reduce(function(x, y) {
                        x[y.orderItemID] = x[y.orderItemID] || [];
                        x[y.orderItemID].push(y);
                        return x;
                    }, Object.create(null));

                    for (var itemkey in itemresult) {
                        var updateItemData = {
                            orderItemID: itemresult[itemkey][0].orderItemID,
                            orderItemTitle: itemresult[itemkey][0].orderItem[0].title,
                            orderItemQuantity: itemresult[itemkey].length
                        };
                        itemAry.push(updateItemData);
                    }
                
                    var updateData = {
                        customerCompanyDetails: result[key][0].customerCompanyDetails[0],
                        orderItermDetails: itemAry
                    };
                
                    dataAry.push(updateData);
                }

                var finalUpdateData = {
                    catererID: parentkey,
                    catererDetails: totalresult[parentkey].catererDetails,
					orderDetails: dataAry
				};
				
				finaldataAry.push(finalUpdateData);
			}
			
            if (finaldataAry.length > 0) {
                for (var i = 0; i <finaldataAry.length; i ++) {  
                    var orderdetails = finaldataAry[i].orderDetails
                    var catererEmail = finaldataAry[i].catererDetails[0].catererEmail
                    mail.sendCatererLunchOrderEmail('/templates/caterer_lunchorder/email.html', orderdetails, catererEmail);
                }
                return res.status(201).json(finaldataAry);
            }
            else {
                return res.status(500).send({ error: "doc not found" });
            } 
		}
	 });
});

router.put('/acceptlunchorder', passport.authenticate('jwt', {session: false}), (req, res) => {
    var matchquery = {};
    var updateData = {
        orderStatus: "accepted",
	    paymentStatus: "succeeded"
    }

    if (typeof req.body.orderID !== 'undefined') {
        matchquery._id = new ObjectId(req.body.orderID)
    }

    LunchOrder.findOneAndUpdate(matchquery, {$set: updateData}, {returnOriginal: false, runValidators: true}, (err, doc) => {
        if (err) {
            return res.status(500).send({ error: err });
         }
         else {
            var paymentIntentID = doc.paymentIntentID
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


router.put('/rejectlunchorder', (req, res) => {
    var matchquery = {};
    var updateData = {
        orderStatus: "rejected",
	    paymentStatus: "incomplete"
    }

    if (typeof req.body.orderID !== 'undefined') {
        matchquery._id = new ObjectId(req.body.orderID)
    }

    LunchOrder.findOneAndUpdate(matchquery, {$set: updateData}, {returnOriginal: false, runValidators: true}, (err, doc) => {
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

	LunchOrder.aggregate([ 
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
        {$lookup: {
            from: "company", 
            localField: "customerCompanyID", 
            foreignField: "_id", 
            as: "customerCompanyDetails" }
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
