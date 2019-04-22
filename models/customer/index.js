// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

// define the schema for our customerSchema model
var customerSchema = mongoose.Schema({
    customerName: String,
    customerEmail: String,
	customerPassword: String,
    customerPhoneNumber: String,
    customerAddress: String,
    customerCity: String,
    customerCounty: String,
    customerCountry: String,
    customerOrderID: [String],
});

// generating a hash
customerSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
customerSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

customerSchema.methods.generateJWT = function() {
  return jwt.sign({
    customerEmail: this.customerEmail,
    id: this._id,
  }, 'foodiebeecaterer', {expiresIn: '24h'} );
}

customerSchema.methods.toAuthJSON = function() {
  return {
    _id			 		: this._id,
    customerName        : this.customerName,
    customerEmail       : this.customerEmail,
	customerPassword    : this.customerPassword,
    customerPhoneNumber : this.customerPhoneNumber,
    customerAddress     : this.customerAddress,
    customerCity        : this.customerCity,
    customerCounty      : this.customerCounty,
    customerCountry     : this.customerCountry,
    customerOrderID     : this.customerOrderID,
	token		 		: this.generateJWT(),
  };
};


//Connect to specific database
const db = mongoose.connection.useDb('foodiebee');

// create the model
module.exports = db.model('customer', customerSchema, 'customer');