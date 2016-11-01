/* app set up */
var app = module.exports = require('../app')();
var Flickr, flickr;

/* flickr sdk set up */
require('dotenv').config();
Flickr = require('flickr-sdk');
flickr = new Flickr({ api_key: process.env.APIKEY });

/* example route */
app.get('/', function (req, res) {
	/* example sdk usage */
	flickr.test.echo({ text: 'Hello World' })
	.then(function (response) {
		res.send(response.body.text._content);
	}, function (err) {
		res.status(500).send(err);
	});
});

if (!module.parent) app.listen(3000);
