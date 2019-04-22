// load the things we need
var mongoose = require('mongoose');
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
var newObjectId = require('mongodb').ObjectID;

// define the schema for our orderSchema model
var selectionItemSchema = mongoose.Schema({
	selectionitemtitle: String,
	selectionitemprice: Number,
});

var selectionSchema = mongoose.Schema({
	selectioncategory: String,
	selectionmaxnum: Number,
	selectionitem: [selectionItemSchema],
});

var orderSchema = mongoose.Schema({
	menuID: ObjectId,
	customerID: ObjectId,
	quantity: Number,
	instruction: String,
	selection: [selectionSchema],
	totalPrice: Number,
	orderType: String,
	orderStatus: String,
	paymentType: String,
}, {
    timestamps: true
});

//Connect to specific database
const db = mongoose.connection.useDb('foodiebee');

// create the model
module.exports = db.model('order', orderSchema, 'order');