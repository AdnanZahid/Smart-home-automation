// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '', // your App ID
		'clientSecret' 	: '', // your App Secret
		'callbackURL' 	: 'http://127.0.0.1/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: '',
		'consumerSecret' 	: '',
		'callbackURL' 		: 'http://127.0.0.1/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: '',
		'clientSecret' 	: '',
		'callbackURL' 	: 'http://127.0.0.1/auth/google/callback'
	}

};