var Flickr, flickr, template;
var app = module.exports = require('../app')();
var justifiedLayout = require('justified-layout');

/* flickr sdk set up */
Flickr = require('flickr-sdk');
flickr = new Flickr({ api_key: process.env.APIKEY });

/* example route */
app.get('/', function (req, res) {
	/* example sdk usage */
	flickr.photos.search({
		text: 'dogs',
		license: '4,5,6,7',
		safe_search: 1,
		content_type: 1,
		extras: 'url_m'
	})
	.then(function (response) {

		/* calculate justified layout geometry */
		var geometry = justifiedLayout(response.body.photos.photo.map(function (photo) {
			var aspect = parseInt(photo['width_m'], 10) / parseInt(photo['height_m'], 10);
			if (isNaN(aspect)) {
				aspect = 1;
			}
			return aspect;
		}),
		{
			targetRowHeight: 100,
			containerWidth: 600
		});
		/* update photo data with display calulation */
		response.body.photos.photo.forEach(function (photo, index) {
			photo.layout = geometry.boxes[index];
			photo.layout.top += 100;

			photo.url = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
		});
		/* render template */
		res.render('justified', {
			photos: response.body.photos.photo,
			title: 'Search Example'
		});
	}, function (err) {
		res.status(500).send(err);
	});
});

if (!module.parent) app.listen(3000);
