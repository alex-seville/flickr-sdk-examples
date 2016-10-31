var app = require('./app');
var request = require('supertest');

describe('search', function() {
  it('should return search results', function() {
    return request(app)
	.get('/')
	.expect(200)
	.expect(function (res) {
		if (res.text.indexOf('<img') === -1) {
			throw new Error('Search results are missing and/or incomplete.');
		}

		if (res.text.indexOf('Search Example') === -1) {
			throw new Error('View rendered incorrectly.');
		}
	});
  });
});
