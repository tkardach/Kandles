const { User } = require('../../models/user');
const { Wax } = require('../../models/wax');
const request = require('supertest');

let server;

// test /api/waxes
describe('/api/waxes', () => {
  beforeEach(() => {
    server = require('../../index');
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Wax.deleteMany({});
    await server.close();
  });

  /**********************************************
   *  GET /api/waxes
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

  /**********************************************
   *  GET /api/waxes/:id
   **********************************************/
  describe('GET /:id', () => {
    let token;
    let waxId;

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
        applications: ['container', 'tealight'],
        waxType: 'soy'
      });

      waxId = wax._id;

      await wax.save();
    });

    const exec = () => {
      return request(server)
        .get('/api/waxes/' + waxId)
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

    it('should return 400 if the object id is not valid', async () => {
      waxId = 123;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if wax with matching id cannot be found', async () => {
      await Wax.deleteMany({});

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 200 on success', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('should return wax on success', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('prop65');
      expect(res.body).toHaveProperty('ecoFriendly');
      expect(res.body).toHaveProperty('applications');
      expect(res.body).toHaveProperty('waxType');
    });
  });

  /**********************************************
   *  POST /api/waxes
   **********************************************/
  describe('POST /', () => {
    let token;
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
        applications: ['container', 'tealight'],
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

    it('return 400 if wax with identical name exists', async () => {
      const wax = new Wax(payload);
      await wax.save();

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('return 400 if applications has duplicate value', async () => {
      payload.applications = ['container', 'container', 'pillar', 'tealight'];

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('return 400 if applications string is invalid', async () => {
      payload.applications = ['testType', 'pillar', 'tealight'];

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('return 400 if applications types are invalid', async () => {
      payload.applications = [1234, 'pillar', 'tealight'];

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('return 400 if applications is missing', async () => {
      payload = {
        name: '464',
        prop65: true,
        ecoFriendly: true,
        waxType: 'soy'
      };
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('return 400 if applications is empty', async () => {
      payload.applications = [];

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('return 400 if waxType string is invalid', async () => {
      payload.waxType = 'test';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('return 400 if waxType value is invalid', async () => {
      payload.waxType = 1234;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('return 400 if waxType is missing', async () => {
      payload = {
        name: '464',
        prop65: true,
        ecoFriendly: true,
        applications: ['container', 'pillar', 'tealight']
      };

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('return 400 if name is missing', async () => {
      payload = {
        prop65: true,
        ecoFriendly: true,
        applications: ['container', 'pillar', 'tealight'],
        waxType: 'soy'
      };

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('return 400 if name is invalid', async () => {
      payload.name = 1234;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('return 400 if name is less than 2 characters', async () => {
      payload.name = 'a';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('return 400 if name is greater than 50 characters', async () => {
      payload.name = 'a' * 50;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('return 400 if invalid bool property', async () => {
      payload.prop65 = 'test';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('return 400 if missing a bool property', async () => {
      payload = {
        name: '464',
        ecoFriendly: true,
        applications: ['container', 'pillar', 'tealight'],
        waxType: 'soy'
      };

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('return 200 on success', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('post wax to database on success', async () => {
      const res = await exec();

      const dbWax = await Wax.find({ name: payload.name });

      expect(dbWax.length).toBe(1);
      expect(dbWax[0]).toHaveProperty('name', payload.name);
      expect(dbWax[0]).toHaveProperty('prop65', payload.prop65);
      expect(dbWax[0]).toHaveProperty('applications');
      expect(dbWax[0]).toHaveProperty('ecoFriendly', payload.ecoFriendly);
      expect(dbWax[0]).toHaveProperty('waxType', payload.waxType);
    });

    it('return wax on success', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('name', payload.name);
      expect(res.body).toHaveProperty('prop65', payload.prop65);
      expect(res.body).toHaveProperty('applications');
      expect(res.body).toHaveProperty('ecoFriendly', payload.ecoFriendly);
      expect(res.body).toHaveProperty('waxType', payload.waxType);
    });
  });

  /**********************************************
   *  PUT /api/waxes/:id
   **********************************************/
  describe('PUT /:id', () => {
    let token;
    let payload;
    let waxId;

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
        applications: ['container', 'tealight'],
        waxType: 'soy'
      };

      const wax = new Wax(payload);

      waxId = wax._id;

      await wax.save();

      payload.applications = ['pillar'];
    });

    const exec = () => {
      return request(server)
        .put('/api/waxes/' + waxId)
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

    it('should return 400 if the object id is not valid', async () => {
      waxId = 123;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('return 404 if wax could not be found', async () => {
      await Wax.deleteMany({});

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('return 400 if applications is empty', async () => {
      payload = {
        name: '464',
        ecoFriendly: true,
        applications: [],
        waxType: 'soy'
      };

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('return 400 if application value is invalid', async () => {
      payload.applications = [1234];

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('return 400 if application string value is invalid', async () => {
      payload.applications = ['test', 'pillar'];

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('return 400 if waxType value is invalid', async () => {
      payload.waxType = 1234;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('return 400 if waxType string value is invalid', async () => {
      payload.waxType = 'test';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('return 400 if bool value is invalid', async () => {
      payload.prop65 = 1234;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('return 400 if name is invalid', async () => {
      payload.name = 1234;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if name is less than 2 characters', async () => {
      payload.name = 'a';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('return 400 if name is more than 50 characters', async () => {
      payload.name = 'a' * 50;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 200 on success', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('should return 200 with payload updating only 1 value', async () => {
      payload = { applications: ['pillar'] };

      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('should update wax in database on success', async () => {
      await exec();

      const dbWax = await Wax.findById(waxId);

      expect(dbWax['applications']).toContain('pillar');
    });

    it('should return updated wax on success', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('name', payload.name);
      expect(res.body.applications).toContain('pillar');
      expect(res.body).toHaveProperty('prop65');
      expect(res.body).toHaveProperty('ecoFriendly');
      expect(res.body).toHaveProperty('applications');
      expect(res.body).toHaveProperty('waxType');
    });
  });

  /**********************************************
   *  DELETE /api/waxes/:id
   **********************************************/
  describe('DELETE /:id', () => {
    let token;
    let waxId;

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
        applications: ['container', 'tealight'],
        waxType: 'soy'
      });

      waxId = wax._id;

      await wax.save();
    });

    const exec = () => {
      return request(server)
        .delete('/api/waxes/' + waxId)
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

    it('should return 400 if the object id is not valid', async () => {
      waxId = 123;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if wax with matching id cannot be found', async () => {
      await Wax.deleteMany({});

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 200 on success', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('should delete wax from database', async () => {
      await exec();

      const dbWax = await Wax.findById(waxId);
      expect(dbWax).toBe(null);
    });

    it('should return deleted wax on success', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('prop65');
      expect(res.body).toHaveProperty('ecoFriendly');
      expect(res.body).toHaveProperty('applications');
      expect(res.body).toHaveProperty('waxType');
    });
  });
});
