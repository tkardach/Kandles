const { User } = require('../../models/user');
const { Wax } = require('../../models/wax');
const request = require('supertest');

let server;

// test waxes api
describe('/api/waxes', () => {
  beforeEach(() => {
    server = require('../../index');
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Wax.deleteMany({});
    await server.close();
  });

  // should not return anything if there are no users
  // 
  describe('GET /', () => {
    let adminToken;

    beforeEach(async () => {
      admin = new User({
        name: 'testAdmin',
        email: 'test@admin.com',
        password: 'P@ssword2!',
        isAdmin: true
      });

      token = admin.generateAuthToken();
      await admin.save();

      const wax = new Wax({
        name: '464',
        prop65: true,
        ecoFriendly: true,
        applications: ['container', 'pillar', 'tealight'],
        waxType: 'soy'
      });

      await wax.save();
    });

    const exec = () => {
      return request(server)
        .get('/api/waxes')
        .set('x-auth-token', token);
    }

    it('should return 400 if token is invalid', async () => {
      token = '123';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 401 if no token is provided', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 403 if user is not an admin', async () => {
      token = new User().generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 200 if request is successful', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('should return waxes on success', async () => {
      const res = await exec();

      expect(res.body.length).toBe(1);
    });

    it('should return nothing if no waxes in database', async () => {
      await Wax.deleteMany({});

      const res = await exec();

      expect(res.body.length).toBe(0);
    });
  });

  // return 400 if wax with identical name exists
  // return 400 if duplicate applications
  // return 400 if invalid applications
  // return 400 if invalid waxType
  // return 400 if missing properties
  // return 400 if name is < 2 characters
  // return 400 if name is > 50 characters
  // 
  describe('POST /', () => {
    let adminToken;
    let payload;

    beforeEach(async () => {
      admin = new User({
        name: 'testAdmin',
        email: 'test@admin.com',
        password: 'P@ssword2!',
        isAdmin: true
      });

      token = admin.generateAuthToken();
      await admin.save();

      payload = {
        name: '464',
        prop65: true,
        ecoFriendly: true,
        applications: ['container', 'pillar', 'tealight'],
        waxType: 'soy'
      };
    });

    const exec = () => {
      return request(server)
        .post('/api/waxes')
        .set('x-auth-token', token)
        .send(payload);
    }

    it('should return 400 if token is invalid', async () => {
      token = '123';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 401 if no token is provided', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 403 if user is not an admin', async () => {
      token = new User().generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });
  });
});
