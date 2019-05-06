var aws = require('aws-sdk')
require('dotenv').config();

var s3 = 
	new aws.S3({ 
	  accessKeyId: "AKIAICRTNHOAPWZP2X7Q",
	  secretAccessKey: "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",
	  sslEnabled:true
	});


module.exports = s3;