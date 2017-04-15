var app = module.exports = require('../app')();
var Flickr = require('flickr-sdk');
var oauth = require('flickr-sdk/plugins/oauth');

if (!process.env.APIKEY || !process.env.APISECRET) {
	throw new Error('You need to provide a valid Flickr API key and API secret for this example');
}

// Create a session store for the current user. This is just for
// demonstration and will NOT scale beyond a single process! You
// should DEFINITELY use a database for this!
var session = { verified: false };

// Settings
var consumerKey = process.env.APIKEY;
var consumerSecret = process.env.APISECRET;

// A route to clear the session information
app.get('/logout', function (req, res) {
	session.verified = false;
	session.oauth_token = false;
	session.oauth_token_secret = false;
	res.redirect('/');
});

// If we have a "session" with a verified OAuth token, use it
// to do something interesting on behalf of the current user.
// Otherwise, redirect to /login to start the OAuth flow.
app.get('/', function (req, res) {
	if (session.verified) {
		// Create a new Flickr instance. We have all the required
		// fields for the oauth plugin now
		var flickr = new Flickr(oauth(consumerKey, consumerSecret, session.oauth_token, session.oauth_token_secret));

		// Return the user's recent photo activity as JSON
		flickr.people.getInfo({
			user_id: session.user_id
		})
		.then(function (response) {
			res.send('The private mail SHA is: ' + response.body.person.mbox_sha1sum._content);
		}, function (err) {
			res.status(500).send(err.message);
		});
	} else {
		res.redirect('/login');
	}
});

app.get('/login', function (req, res, next) {
	// Create a new OAuth instance
	var oauth = new Flickr.OAuth(consumerKey, consumerSecret);

	// Request a new token, providing our callback url
	// TODO perms=?
	oauth.request('http://localhost:3000/callback').then(function (response) {

		// Store the token and secret in our session. This is just
		// for demonstration and will NOT scale beyond a single
		// process! You should DEFINITELY use a database for this!
		session.oauth_token = response.body.oauth_token;
		session.oauth_token_secret = response.body.oauth_token_secret;

		// Redirect the user to Flickr to authorize the token
		res.redirect('https://www.flickr.com/services/oauth/authorize?oauth_token=' + session.oauth_token);

	}, function (err) {
		next(err);
	});

});

app.get('/callback', function (req, res, next) {
	// Create a new OAuth instance
	var oauth = new Flickr.OAuth(consumerKey, consumerSecret);

	// Grab our token and verifier from the query string
	var token = req.query.oauth_token;
	var verifier = req.query.oauth_verifier;

	// Retrieve the token secret for this token from our "database"
	var tokenSecret = session.oauth_token_secret;

	// Verify the token with Flickr
	oauth.verify(token, verifier, tokenSecret).then(function (response) {

		// Mark our session's OAuth token as verified. This is just
		// for demonstration and will NOT scale beyond a single
		// process! You should DEFINITELY use a database for this!
		session.verified = true;
		session.oauth_token = response.body.oauth_token;
		session.oauth_token_secret = response.body.oauth_token_secret;
		session.user_id = response.body.user_nsid;

		// Now that we have a verified OAuth token, redirect the
		// user back to the home route.
		res.redirect('/');

	}, function (err) {
		next(err);
	});

});

if (!module.parent) {
	app.listen(3000, function () {
		console.log('visit http://localhost:3000 to start the OAuth flow');
	});
}
