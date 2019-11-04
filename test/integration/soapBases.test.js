const { User } = require('../../models/user');
const { SoapBase } = require('../../models/soapBase');
const request = require('supertest');

let server;

// test /api/soapBase
describe('/api/soapBase', () => {
  beforeEach(() => {
    server = require('../../index');
  });

  afterEach(async () => {
    await User.deleteMany({});
    await SoapBase.deleteMany({});
    await server.close();
  });

  /**********************************************
   *  GET /api/soapBase
   **********************************************/
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

      const soapBase = new SoapBase({
        name: 'Test Base',
        vegan: true,
        ecoFriendly: true,
        type: 'melt_and_pour'
      });

      await soapBase.save();
    });

    const exec = () => {
      return request(server)
        .get('/api/soapBases')
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

    it('should return soapBases on success', async () => {
      const res = await exec();

      expect(res.body.length).toBe(1);
    });

    it('should return nothing if no soapBase in database', async () => {
      await SoapBase.deleteMany({});

      const res = await exec();

      expect(res.body.length).toBe(0);
    });
  });
});