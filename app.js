
/* app set up */
var express = require('express');
var exphbs = require('express-handlebars');

var envFile = require('dotenv').config({
	path: __dirname + '/.env'
});

/* warn is .env file is missing or invalid */
if (envFile.error) {
	console.warn('You must add a valid .env file to run examples that require authentication.');
}

/* create a new express app each time so the routes are distinct in the tests */
function createApp () {
	var app = express();

	/* handlebars setup */
	app.engine('handlebars', exphbs({
		defaultLayout: 'main'
	}));
	app.set('view engine', 'handlebars');

	return app;
}

module.exports = createApp;
