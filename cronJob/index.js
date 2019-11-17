var express = require('express');
var LunchOrder = require('../models/lunchOrder');
var ObjectId = require('mongodb').ObjectID;
var moment = require('moment');
var mail = require('../nodeMailerWithTemp');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_KEY);
var cron = require('node-cron');

exports.executeCronJob = function () {

    //Send Caterer daily order 15 10 * * Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday
    cron.schedule('20 12 * * Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday', () => {

        var matchquery = {}

    /*  var gteDate = moment().toDate()
        var lteDate = moment().add(1, 'days').toDate()
        matchquery.createdAt = {$gte: new Date(gteDate.toISOString()),$lte:  new Date(lteDate.toISOString())}
        matchquery.orderStatus = "pending"

        console.log('matchquery = ', JSON.stringify(matchquery))
    */

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
            }
        ], (err,doc) => {
            if (err) {
                console.log('err = ', err)
            }
            else{
                if (doc.length > 0) {

                    var totalresult = doc.reduce(function(v, b) {
                        v[b.catererID] = v[b.catererID] || [];
                        v[b.catererID].push(b);
                        return v;
                    }, Object.create(null));
    
                    var finaldataAry = [];
    
                    for (var key in totalresult) {
                        var finalUpdateData = {
                            catererDetails: totalresult[key][0].catererDetails[0],
                            orderDetails: totalresult[key]
                        };
                        
                        finaldataAry.push(finalUpdateData);
                    }
                    console.log(finaldataAry)
                    for (var i = 0; i < finaldataAry.length; i ++) {  
                        var catererEmail = finaldataAry[i].catererDetails.catererEmail
                        var orderdetails = finaldataAry[i].orderDetails
                        mail.sendCatererLunchOrderEmail('/templates/caterer_lunchorder/email.html', orderdetails, catererEmail);
                    }
                }
            }
        });
    });   


}

 