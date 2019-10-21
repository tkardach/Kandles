const { User } = require('../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const request = require('supertest');

let server;
let admin;
let token;

// test scent api
describe('/api/scents', () => {
  beforeEach(async () => {
    admin = new User({
      name: 'testAdmin',
      email: 'test@admin.com',
      password: 'T3stAdmin!',
      isAdmin: true
    });

    token = admin.generateAuthToken();
    await admin.save();
    
    server = require('../../index');
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Scent.deleteMany({});
    await server.close();
  });

  // should return 401 with no token
  // should return 403 if user is not admin
  // should return 200 if successful
  // should return scents on success
  // should return nothing if no scents available
  describe('GET /', async () => {
    const exec = () => {
      return request(server)
        .get('/api/scents')
        .set('x-auth-token', token);
    }

    it('should return 401 if no token is provided', async () => {

    });

    it('should return 403 if user is not an admin', async () => {

    });

    it('should return 200 if request is successful', async () => {

    });

    it('should return scents on success', async () => {

    });

    it('should return nothing if no scents in database', async () => {

    });
  });

  // should return 401 with no token
  // should return 403 if user is not admin
  // should return 404 if the id is invalid
  // should return 400 if scent id does not match
  // should return 200 on success
  // should return proper scent on success
  describe('GET /:id', async () => {
    it('should return 401 if no token is provided', async () => {

    });

    it('should return 403 if user is not an admin', async () => {

    });

    it('should return 404 if the id is invalid', async () => {

    });

    it('should return 400 if the scent id does not exist', async () => {

    });

    it('should return 200 if request is successful', async () => {

    });

    it('should return 403 if user is not an admin', async () => {

    });

    it('should return the correct scent on success', async () => {

    });
  });

  
  // should return 401 with no token
  // should return 403 if user is not admin
  // should return 400 if it is missing a name
  // should return 400 if name is less than 2 characters
  // should return 400 if name is more than 50 characters
  // should return 400 if a bool flag is missing
  // should return 200 on success
  // should post scent to database on success
  // should return posted scent on success
  describe('POST /', async () => {
    it('should return 401 if no token is provided', async () => {

    });

    it('should return 403 if user is not an admin', async () => {

    });

    it('should return 400 if the name is missing', async () => {

    });

    it('should return 400 if the name is less than 2 characters', async () => {

    });

    it('should return 400 if the name is more than 50 characters', async () => {

    });

    it('should return 400 if a flag is missing', async () => {

    });

    it('should return 200 if request is successful', async () => {

    });

    it('should post scent to database on success', async () => {

    });

    it('should return posted scent on success', async () => {

    });
  });

});