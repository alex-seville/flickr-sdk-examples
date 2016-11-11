var app = require('.');
var request = require('supertest');

describe('feeds', function() {
  it('should return feed result', function() {
    return request(app)
		.get('/')
		.expect(200)
		.expect(function (res) {
			/* This endpoint should always return 20 public photos */
			if ( (res.text.match(/img/g) || []).length !== 20) {
				throw new Error('Public image fetching failed unexpectedly.');
			}
	});
  });
});
