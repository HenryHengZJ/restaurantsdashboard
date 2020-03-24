var express = require('express');
var router = express.Router();
var Review = require('../../models/review');
var ObjectId = require('mongodb').ObjectID;
var passport = require('passport');
var moment = require('moment');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.get('/getreview', authenticate(), (req, res) => {

    const { user } = req;
    var userID = user.catererID

	var matchquery = {};

    if (typeof req.query.lteDate !== 'undefined' && typeof req.query.gteDate !== 'undefined') {
		var gteDate = moment(req.query.gteDate, 'ddd, DD MMM YYYY').toDate()
		var lteDate = moment(req.query.lteDate, 'ddd, DD MMM YYYY').add(1, 'days').toDate()
        matchquery = {"createdAt":{$gte: new Date(gteDate.toISOString()),$lte: new Date(lteDate.toISOString())}}
    }

    var limitnum = 0
    if (typeof req.query.limit !== 'undefined') {
        limitnum = parseInt(req.query.limit)
    }

    matchquery.catererID = new ObjectId(userID)

    var aggregationquery = [
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
    ]

    if (limitnum > 0) {
        aggregationquery.push({ $limit: limitnum })
    }


    Review.aggregate(aggregationquery, (err,doc) => {
         if (err) {
             console.log(err)
             return res.status(500).send({ error: err });
         }
         return res.status(200).json(doc);
      });
});


function authenticate() {
    return (req, res, next) => {
      passport.authenticate('jwt', {session: false}, (err, user, info) => {
        if (err) {
            console.log( 'err = ', err)
            next(err);
        } 
        else if (info) {
            if (info.name === 'TokenExpiredError') {

               if (req && req.cookies['jwt'] && req.cookies['refreshToken']) {

                    const refresh_token = req.cookies['refreshToken']
                    const jwttoken = req.cookies['jwt']
                    var decoded = jwt.decode(jwttoken, {complete: true});
                    var decodedPayload = decoded.payload

                    if (decodedPayload.refreshToken === refresh_token) {
                        const payload = {
                            catererID: decodedPayload.catererID,
                            catererName: decodedPayload.catererName,
                            catererEmail: decodedPayload.catererEmail,
                            refreshToken: decodedPayload.refreshToken,
                        };
                        const token = jwt.sign(payload, process.env.jwtSecretKey, {expiresIn: '7d'} );
                        req.user = payload;
                        req.jwttoken = token
                        next();
                    }
                    else {
                        res.status(401).send('Unauthorized');
                    }
                }
                else {
                    res.status(401).send('Unauthorized');
                }
            }
            else {
                res.status(401).send('Unauthorized');
            }
        } 
        else {
            console.log(user)
            req.user = user;
            next();
        }
      })(req, res, next);
    };
  }

module.exports = router;
