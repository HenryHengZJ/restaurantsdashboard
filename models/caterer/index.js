// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

// define the schema for our openingHoursSchema model
var openingHoursSchema = mongoose.Schema({
	day: String,
	starttime: Number,
	closetime: Number,
});

// define the schema for our catererSchema model
var catererSchema = mongoose.Schema({
	catererEmail: String,
	catererPassword: String,
	catererName: String,
    catererDescrip: String,
    catererPhoneNumber: String,
    catererAddress: String,
    catererCity: String,
    catererCounty: String,
    catererCountry: String,
    catererCuisine: [String],
    catererOccasion: [String],
    catererPickup: Boolean,
	catererDelivery: Boolean,
	location: { type: {type:String}, coordinates: [Number]},
	deliveryradius: Number,
    deliveryfee: Number,
	minimumspend: Number,
	openinghours: [openingHoursSchema],
	catererOrderLater: Boolean,
	inAdvanceMin: Number,
	inAdvanceDay: Number,
	phoneReceivable: {
        type: Boolean,
        default: true
    },
	emailReceivable: {
        type: Boolean,
        default: true
    },
    rating: Number,
    numofreview: Number,
    src: String,
    verified: {
        type: Boolean,
        default: false
    }
});

// generating a hash
catererSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
catererSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.catererPassword);
};

catererSchema.methods.generateJWT = function() {
  return jwt.sign({
    catererEmail: this.catererEmail,
    id: this._id,
  }, 'foodiebeecaterer', {expiresIn: '24h'} );
}

catererSchema.methods.toAuthJSON = function() {
  return {
    _id			 		: this._id,
	catererEmail		: this.catererEmail,
	catererPassword		: this.catererPassword,
	catererName			: this.catererName,
    catererDescrip		: this.catererDescrip,
    catererPhoneNumber	: this.catererPhoneNumber,
    catererAddress		: this.catererAddress,
    catererCity			: this.catererCity,
    catererCounty		: this.catererCounty,
    catererCountry		: this.catererCountry,
    catererCuisine		: this.catererCuisine,
    catererOccasion		: this.catererOccasion,
    catererPickup		: this.catererPickup,
	catererDelivery		: this.catererDelivery,
	deliveryradius		: this.deliveryradius,
    deliveryfee			: this.deliveryfee,
	minimumspend		: this.minimumspend,
	openinghours		: this.openinghours,
	catererOrderLater	: this.catererOrderLater,
	inAdvanceMin		: this.inAdvanceMin,
	inAdvanceDay		: this.inAdvanceDay,
    phoneReceivable     : this.phoneReceivable,
    emailReceivable     : this.emailReceivable,
    rating				: this.rating,
    numofreview			: this.numofreview,
    src					: this.src,
    verified			: this.verified,
	token		 		: this.generateJWT(),
  };
};


//Connect to specific database
const db = mongoose.connection.useDb('foodiebee');

// create the model
module.exports = db.model('caterer', catererSchema, 'caterer');