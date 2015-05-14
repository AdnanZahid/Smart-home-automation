// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '805241509511410', // your App ID
		'clientSecret' 	: '2e15efb281a31366bcd02bbbb49a0f7c', // your App Secret
		'callbackURL' 	: 'http://127.0.0.1/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: 'eXKtePAmiKU6BE3l1cSKXHoUJ',
		'consumerSecret' 	: 'S5rQKZMIdb1qaPYLhMftQwCddHYaiuGXY4859lPNkEBPxUEQZ3',
		'callbackURL' 		: 'http://127.0.0.1/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: '441263314458-vattjc966pfg1gfl33t812at9lmd31v6.apps.googleusercontent.com',
		'clientSecret' 	: 'Mzr4GZWy8yziiAKtwzN1f2Ks',
		'callbackURL' 	: 'http://127.0.0.1/auth/google/callback'
	}

};