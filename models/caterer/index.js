// load the things we need
var mongoose = require('mongoose');

// define the schema for our Photographer model
var catererSchema = mongoose.Schema({
	catererName: String,
    catererDescrip: String,
    catererPhoneNumber: String,
    catererAddress: String,
    catererCity: String,
    catererCounty: String,
    catererCountry: String,
    catererCuisine: Array,
    catererOccasion: Array,
    catererPickup: Boolean,
    rating: Number,
    numofreview: Number,
    src: String,
    minimumspend: Number,
    deliveryfee: Number,
    verified: {
        type: Boolean,
        default: false
    }
});


//Connect to specific database
const db = mongoose.connection.useDb('foodiebee');

// create the model
module.exports = db.model('caterer', catererSchema, 'caterer');