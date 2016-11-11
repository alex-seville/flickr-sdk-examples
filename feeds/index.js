var Flickr, flickrFeeds, template;
var app = module.exports = require('../app')();

/* flickr sdk set up */
Flickr = require('flickr-sdk');
flickrFeeds = new Flickr.Feeds();

/* example route */
app.get('/', function (req, res) {
	/* example sdk usage */
	flickrFeeds.publicPhotos()
	.then(function (response) {

		/* render template */
		res.render('grid', {
			photos: response.body.items.map(function (item) {
				return { url: item.media.m };
			}),
			title: 'Feed Example'
		});
	}, function (err) {
		res.status(500).send(err);
	});
});

if (!module.parent) app.listen(3000);
