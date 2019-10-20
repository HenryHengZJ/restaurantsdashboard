var express = require('express');
var LunchOrder = require('../models/lunchOrder');
var ObjectId = require('mongodb').ObjectID;
var moment = require('moment');
var mail = require('../nodeMailerWithTemp');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_KEY);
var cron = require('node-cron');
//30 11 * * Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday

exports.executeCronJob = function () {

    //Send Caterer daily order
    cron.schedule('15 11 * * Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday', () => {

        var matchquery = {}

      /*  var gteDate = moment().toDate()
        var lteDate = moment().add(1, 'days').toDate()
        matchquery.orderDate = {$gte: gteDate.toISOString(),$lte: lteDate.toISOString()}
        matchquery.orderStatus = "pending"

        console.log('matchquery = ', JSON.stringify(matchquery))*/

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
                console.log('err = ', err)
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
                            orderItemDetails: itemAry
                        };
                    
                        dataAry.push(updateData);
                    }

                    var finalUpdateData = {
                        catererDetails: totalresult[parentkey][0].catererDetails[0],
                        orderDetails: dataAry
                    };
                    
                    finaldataAry.push(finalUpdateData);
                }
                
                if (finaldataAry.length > 0) {
                    for (var i = 0; i <finaldataAry.length; i ++) {  
                        var orderdetails = finaldataAry[i].orderDetails
                        var catererEmail = finaldataAry[i].catererDetails.catererEmail
                        mail.sendCatererLunchOrderEmail('/templates/caterer_lunchorder/email.html', orderdetails, catererEmail);
                    }
                }
            }
        });
    });   

    //Reject caterer daily pending order after 1131am
    cron.schedule('35 11 * * Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday', () => {

        var matchquery = {}

        //matchquery.orderStatus = "pending"

        var updateData = {orderStatus: "rejected"}
                
        var bulkLunchOrder = LunchOrder.collection.initializeOrderedBulkOp();
        bulkLunchOrder.find(matchquery).update({$set: updateData});
        bulkLunchOrder.execute((err, doc) => {
            if (err) {
                console.log('err = ', err)
             }
             else {
                console.log('doc = ', doc)
             }
        })
    });  
}

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