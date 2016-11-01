var app = require('.');
var request = require('supertest');
var sinon = require('sinon');

describe('oauth', function() {

	it('should do oauth flow', function() {

		var flickrSDK = require('flickr-sdk'),
			OldSDK = flickrSDK.OAuth,
			oauthVerifyStub = sinon.stub(flickrSDK, 'OAuth', function (consumerKey, consumerSecret) {
				return {
					verify: function (a, b, c) {
						return Promise.resolve({ body: {
							oauth_token: a,
							oauth_token_secret: c
						} });
					},
					request: function (url) {
						return new OldSDK(consumerKey, consumerSecret).request(url);
					}
				};
			});

		/* get request token */
		return request(app)
			.get('/login')
			.expect(302)
			.expect(function (res) {
				if (res.header.location.indexOf('https://www.flickr.com/services/oauth/authorize') !== 0) {
					throw new Error('Flickr auth failed');
				}
		})
		/* return request tokens */
		.then(function () {
			return request(app)
			.get('/callback?oauth_token=123&oauth_verifier=456')
			.expect(302)
			.expect(function (res) {
				if (res.header.location !== '/') {
					throw new Error('Verify redirect failed.');
				}
				sinon.assert.calledTwice(oauthVerifyStub);
				oauthVerifyStub.restore();
			})
		})
		/* make call using auth */
		.then(function () {
			return request(app)
				.get('/')
				.expect(500)
				.expect(function (res) {
					/* since our tokens are bogus here, we expect it to fail */
					if (res.text !== 'Invalid auth token') {
						throw new Error('User fetching failed unexpectedly.');
					}
			});
		});
	});
});
