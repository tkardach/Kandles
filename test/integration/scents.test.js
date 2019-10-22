const { User } = require('../../models/user');
const { Scent } = require('../../models/scent');
const request = require('supertest');

let server;
let token;

// test scent api
describe('/api/scents', () => {
  beforeEach(async () => {
    server = require('../../index');
  });

  afterEach(async () => {
    await User.deleteMany({});
    await server.close();
  });

  // should return 401 with no token
  // should return 403 if user is not admin
  // should return 200 if successful
  // should return scents on success
  // should return nothing if no scents available
  describe('GET /', () => {
    let admin;

    beforeEach(async () => {
      admin = new User({
        name: 'testAdmin',
        email: 'test@admin.com',
        password: 'P@ssword2!',
        isAdmin: true
      });

      token = admin.generateAuthToken();
      await admin.save();
    });

    const exec = () => {
      return request(server)
        .get('/api/scents')
        .set('x-auth-token', token);
    }

    it('should return 401 if no token is provided', async () => {

      expect(1).toBe(200);
    });

    it('should return 403 if user is not an admin', async () => {

      expect(1).toBe(200);
    });

    it('should return 200 if request is successful', async () => {

      expect(1).toBe(200);
    });

    it('should return scents on success', async () => {

      expect(1).toBe(200);
    });

    it('should return nothing if no scents in database', async () => {

      expect(1).toBe(200);
    });
  });

  // should return 401 with no token
  // should return 403 if user is not admin
  // should return 404 if the id is invalid
  // should return 400 if scent id does not match
  // should return 200 on success
  // should return proper scent on success
  describe('GET /:id', () => {
    const exec = () => {
      return request(server)
        .get('/api/scents')
        .set('x-auth-token', token);
    }

    it('should return 401 if no token is provided', async () => {

      expect(1).toBe(200);
    });

    it('should return 403 if user is not an admin', async () => {

      expect(1).toBe(200);
    });

    it('should return 404 if the id is invalid', async () => {

      expect(1).toBe(200);
    });

    it('should return 400 if the scent id does not exist', async () => {

      expect(1).toBe(200);
    });

    it('should return 200 if request is successful', async () => {

      expect(1).toBe(200);
    });

    it('should return 403 if user is not an admin', async () => {

      expect(1).toBe(200);
    });

    it('should return the correct scent on success', async () => {

      expect(1).toBe(200);
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
  describe('POST /', () => {
    it('should return 401 if no token is provided', async () => {

      expect(1).toBe(200);
    });

    it('should return 403 if user is not an admin', async () => {

      expect(1).toBe(200);
    });

    it('should return 400 if the name is missing', async () => {

      expect(1).toBe(200);
    });

    it('should return 400 if the name is less than 2 characters', async () => {

      expect(1).toBe(200);
    });

    it('should return 400 if the name is more than 50 characters', async () => {

      expect(1).toBe(200);
    });

    it('should return 400 if a flag is missing', async () => {

      expect(1).toBe(200);
    });

    it('should return 200 if request is successful', async () => {

      expect(1).toBe(200);
    });

    it('should post scent to database on success', async () => {

      expect(1).toBe(200);
    });

    it('should return posted scent on success', async () => {

      expect(1).toBe(200);
    });
  });

  // should return 401 with no token
  // should return 403 if user is not admin
  // should return 404 if the id is invalid
  // should return 400 if scent id does not match
  // should return 400 if name is less than 2 characters
  // should return 400 if name is more than 50 characters
  // should return 400 if property is invalid
  // should return 200 on success
  // should return updated scent on success
  // should update scent in database on success
  describe('PUT /:id', () => {

    it('should return 401 if no token is provided', async () => {

      expect(1).toBe(200);
    });

    it('should return 403 if the user is not an admin', async () => {

      expect(1).toBe(200);
    });

    it('should return 404 if the object id is invalid', async () => {

      expect(1).toBe(200);
    });

    it('should return 400 if scent id does not match any in database', async () => {

      expect(1).toBe(200);
    });

    it('should return 400 if name is less than 2 characters', async () => {

      expect(1).toBe(200);
    });

    it('should return 400 if name is more than 50 characters', async () => {

      expect(1).toBe(200);
    });

    it('should return 400 if property is invalid', async () => {

      expect(1).toBe(200);
    });

    it('should return 200 on success', async () => {

      expect(1).toBe(200);
    });

    it('should return updated scent on success', async () => {

      expect(1).toBe(200);
    });

    it('should update scent in database on success', async () => {

      expect(1).toBe(200);
    });
  });


  // should return 401 with no token
  // should return 403 if user is not admin
  // should return 404 if the id is invalid
  // should return 400 if scent id does not match
  // should return 200 on success
  // should return deleted scent on success
  // should remove scent from database
  describe('DELETE /:id', () => {

    it('should return 401 if no token is provided', async () => {

      expect(1).toBe(200);
    });

    it('should return 403 if the user is not an admin', async () => {

      expect(1).toBe(200);
    });

    it('should return 404 if the object id is invalid', async () => {

      expect(1).toBe(200);
    });

    it('should return 400 if scent id does not match any in database', async () => {

      expect(1).toBe(200);
    });

    it('should return 200 on success', async () => {

      expect(1).toBe(200);
    });

    it('should return deleted scent on success', async () => {

      expect(1).toBe(200);
    });

    it('should remove scent from database when finished', async () => {

      expect(1).toBe(200);
    });
  });
});