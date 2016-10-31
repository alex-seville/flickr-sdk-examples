var app = require('./app');
var request = require('supertest');

describe('Hello World', function() {
  it('should say "Hello World"', function() {
    return request(app)
	.get('/')
	.expect(200)
	.expect('Hello World');
  });
});
