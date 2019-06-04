var aws = require('aws-sdk')
require('dotenv').config();

var s3 = 
	new aws.S3({ 
	  accessKeyId: process.env.s3accessKeyId,
	  secretAccessKey: process.env.s3secretAccessKey,
	  sslEnabled:true
	});


module.exports = s3;