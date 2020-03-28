var express = require('express');
var router = express.Router();
var LunchMenu = require('../../models/lunchMenu');
var ObjectId = require('mongodb').ObjectID;
var passport = require('passport');
var moment = require('moment');
var multer = require('multer');
var multerS3 = require('multer-s3')
var aws = require('aws-sdk')
var s3 = require('../../config/s3');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'foodiebeemenuitem',
        acl: 'public-read',
        metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
        cb(null, Date.now().toString()+'_'+file.originalname)
        }
    })
})

router.get('/getLunchMenu', authenticate(), (req, res) => {

    const { user, jwttoken } = req;
    var userID = user.catererID
    var token = jwttoken

    var matchquery;
    matchquery = {catererID: new ObjectId(userID)}
    console.log(matchquery)

    var menuquery;

    if (typeof req.query.dashboard !== 'undefined' && req.query.dashboard === 'true') {
        menuquery =  LunchMenu.find(matchquery).sort({soldamount: -1}).limit(6)
    }
    else {
        //menuquery =  LunchMenu.find(matchquery).sort({createdAt: -1})
        menuquery =  LunchMenu.find(matchquery)
    }

    menuquery.exec((err,doc) => {
        if (err) {
             return res.status(500).send({ error: err })
        }
        else{
            if (typeof token !== 'undefined') {
                res.cookie('jwt', token, { httpOnly: true,});
            }
            return res.status(200).json(doc);
        }  
    });
});

router.post('/addLunchMenu', authenticate(), upload.any(), (req, res) => {
	
    const { user, jwttoken } = req;
    var userID = user.catererID
    var token = jwttoken
   
    var newData = req.body
    if (typeof newData.markitem !== 'undefined') {
        newData.markitem = JSON.parse(newData.markitem)
    }
	newData.catererID = new ObjectId(userID)

	var files = req.files;
	console.log(files)
	if (files.length > 0) {
		newData.src  = 'https://s3-eu-west-1.amazonaws.com/foodiebeemenuitem/' + req.files[0].key
	}
	
	console.log(newData)
	// create the new menu
	var newMenu 	= new LunchMenu(newData);
	newMenu.save().then(() => res.json(newMenu));

});

router.put('/updateLunchMenu', authenticate(), upload.any(), (req, res) => {
	
    const { user, jwttoken } = req;
    var userID = user.catererID
    var token = jwttoken

    var matchquery;
    if (typeof req.query._id === 'undefined') {
        matchquery= {_id: new ObjectId(), catererID: new ObjectId(userID)}
    }
    else {
        matchquery = {_id: new ObjectId(req.query._id), catererID: new ObjectId(userID)}
    }
   
    var updateData = req.body
    if (typeof updateData.markitem !== 'undefined') {
        updateData.markitem = JSON.parse(updateData.markitem)
    }

	var files = req.files;

	if (files.length > 0) {
		updateData.src  = 'https://s3-eu-west-1.amazonaws.com/foodiebeemenuitem/' + req.files[0].key
	}
	
    LunchMenu.findOneAndUpdate(matchquery, {$set: updateData}, {runValidators: true}, (err, doc) => {
        if (err) return res.status(500).send({ error: err });
		if (doc === null) return res.status(404).send({ error: 'document not found' });
        if (typeof token !== 'undefined') {
            res.cookie('jwt', token, { httpOnly: true,});
        }
        return res.status(201).json(doc);
    });
});
 
router.put('/makeDefault_LunchMenu', authenticate(), (req, res) => {
	
    const { user, jwttoken } = req;
    var userID = user.catererID
    var token = jwttoken

    var arrayOfLunchMenuID = []
    var matchquery = {catererID: new ObjectId(userID)};

    console.log(req.body)

    var updateData = req.body
    if (typeof updateData.defaultID !== 'undefined') {
        matchquery._id = updateData.defaultID
    }
    if (typeof updateData.arrayofID !== 'undefined') {
        var arrayofIDString = JSON.parse(updateData.arrayofID)
        for(var i = 0; i < arrayofIDString.length; i++){
            arrayOfLunchMenuID.push(new ObjectId(arrayofIDString[i]))
        }
    }
   
    LunchMenu.findOneAndUpdate(matchquery, {$set: {selected: true}}, {runValidators: true}, (err, doc) => {
        if (err) {
            return res.status(500).send({ error: err });
        }
        else {
            var bulk_matchquery = {_id: { $in: arrayOfLunchMenuID}}
            var bulkLunchMenu = LunchMenu.collection.initializeOrderedBulkOp();
            bulkLunchMenu.find(bulk_matchquery).update({$set: {selected: false}});
            bulkLunchMenu.execute((err, doc) => {
                if (err) return res.status(500).send({ error: err });
                if (doc === null) return res.status(404).send({ error: 'document not found' });
                if (typeof token !== 'undefined') {
                    res.cookie('jwt', token, { httpOnly: true,});
                }
                return res.status(201).json(doc);
            });
        }
    });
});

router.delete('/deleteLunchMenu', authenticate(), (req, res) => {
	
    const { user, jwttoken } = req;
    var userID = user.catererID
    var token = jwttoken

    var matchquery = {};
    if (typeof req.query._id !== 'undefined') {
        matchquery= {_id: new ObjectId(req.query._id), catererID: new ObjectId(userID)}
    }

    LunchMenu.remove(matchquery, (err, doc) => {
        if (err) {
            return res.status(500).send({ error: err })
        }
        else {
            if (typeof token !== 'undefined') {
                res.cookie('jwt', token, { httpOnly: true,});
            }
            return res.status(200).json(doc);
        }
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
            //No JWT Token (jwt in cookies is gone)
            else {
                if (req && req.cookies['refreshToken']) {
                    const refresh_token = req.cookies['refreshToken']
                    var decoded = jwt.decode(refresh_token, {complete: true});
                    var decodedPayload = decoded.payload
                    const payload = {
                        catererID: decodedPayload.catererID,
                        catererName: decodedPayload.catererName,
                        catererEmail: decodedPayload.catererEmail,
                        refreshToken: refresh_token,
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