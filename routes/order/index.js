var express = require('express');
var router = express.Router();
var Order = require('../../models/order');
var ObjectId = require('mongodb').ObjectID;

router.get('/getorder', (req, res) => {
    Order.find( (err,doc) => {
        if (err) return res.status(500).send({ error: err });
        return res.status(200).json(doc);
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
