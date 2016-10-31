
/* app set up */
var express = require('express');
var exphbs = require('express-handlebars');

require('dotenv').config();

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
