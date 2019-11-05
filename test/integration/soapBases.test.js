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
    let token;

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

  /**********************************************
   *  GET /api/soapBase/:id
   **********************************************/
  describe('GET /:id', () => {
    let token;
    let payload;
    let sbId;

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
        name: 'Test Base',
        vegan: true,
        ecoFriendly: true,
        type: 'melt_and_pour'
      };
      const soap = new SoapBase(payload);
      sbId = soap._id;

      await soap.save();
    });

    const exec = () => {
      return request(server)
        .get('/api/soapBases/' + sbId)
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

    it('should return 400 if object id is invalid', async () => {
      sbId = 1234;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if SoapBase could not be found', async () => {
      await SoapBase.deleteMany({});

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 200 on success', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('should return correct soap on success', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('name', payload.name);
      expect(res.body).toHaveProperty('vegan', payload.vegan);
      expect(res.body).toHaveProperty('ecoFriendly', payload.ecoFriendly);
      expect(res.body).toHaveProperty('type', payload.type);
    });
  });

  /**********************************************
   *  POST /api/soapBase
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
        name: 'Test Base',
        vegan: true,
        ecoFriendly: true,
        type: 'melt_and_pour'
      };
    });

    const exec = () => {
      return request(server)
        .post('/api/soapBases')
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

    it('should return 400 if name is missing', async () => {
      payload = {
        vegan: true,
        ecoFriendly: true,
        type: 'melt_and_pour'
      };

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if name is less than 2 characters', async () => {
      payload.name = 'a';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if name is greater than 50 characters', async () => {
      payload.name = 'a' * 51;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if name is invalid', async () => {
      payload.name = 1234;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if boolean property is missing', async () => {
      payload = {
        name: 'Test Base',
        ecoFriendly: true,
        type: 'melt_and_pour'
      };

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if boolean property is invalid', async () => {
      payload.vegan = 1234;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if type is missing', async () => {
      payload = {
        name: 'Test Base',
        vegan: true,
        ecoFriendly: true
      };

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if type has invalid type', async () => {
      payload.type = 1234;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if type has invalid value', async () => {
      payload.type = 'test';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if SoapBase with same name already exists', async () => {
      await new SoapBase(payload).save();

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 200 on success', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('should return new SoapBase on success', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('name', payload.name);
      expect(res.body).toHaveProperty('vegan', payload.vegan);
      expect(res.body).toHaveProperty('ecoFriendly', payload.ecoFriendly);
      expect(res.body).toHaveProperty('type', payload.type);
    });
  });

  /**********************************************
   *  PUT /api/soapBase/:id
   **********************************************/
  describe('PUT /:id', () => {
    let token;
    let payload;
    let sbId;

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
        name: 'Test Base',
        vegan: true,
        ecoFriendly: true,
        type: 'melt_and_pour'
      };

      const soap = new SoapBase(payload);
      sbId = soap._id;

      await soap.save();

      payload.vegan = false;
      payload.name = 'New Test Base';
      payload.type = 'cold_process';
    });

    const exec = () => {
      return request(server)
        .put('/api/soapBases/' + sbId)
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

    it('should return 400 if object id is invalid', async () => {
      sbId = 1234;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if object with id is not found', async () => {
      await SoapBase.deleteMany({});

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 400 if name is less than 2 characters', async () => {
      payload.name = 'a';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if name is greater than 50 characters', async () => {
      payload.name = 'a' * 51;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if name is invalid', async () => {
      payload.name = 1234;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if boolean property is invalid', async () => {
      payload.vegan = 1234;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if type has invalid type', async () => {
      payload.type = 1234;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if type has invalid value', async () => {
      payload.type = 'test';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 200 on success', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('should return updated SoapBase on success', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('name', payload.name);
      expect(res.body).toHaveProperty('vegan', payload.vegan);
      expect(res.body).toHaveProperty('ecoFriendly', payload.ecoFriendly);
      expect(res.body).toHaveProperty('type', payload.type);
    });
  });

  /**********************************************
   *  DELETE /api/soapBase/:id
   **********************************************/
  describe('DELETE /:id', () => {
    let token;
    let payload;
    let sbId;

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
        name: 'Test Base',
        vegan: true,
        ecoFriendly: true,
        type: 'melt_and_pour'
      };
      const soap = new SoapBase(payload);
      sbId = soap._id;

      await soap.save();
    });

    const exec = () => {
      return request(server)
        .delete('/api/soapBases/' + sbId)
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

    it('should return 400 if object id is invalid', async () => {
      sbId = 1234;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if SoapBase could not be found', async () => {
      await SoapBase.deleteMany({});

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 200 on success', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('should delete SoapBase from database', async () => {
      await exec();

      const dbSoapBase = await SoapBase.findById(sbId);
      expect(dbSoapBase).toBe(null);
    });

    it('should return deleted soap on success', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('name', payload.name);
      expect(res.body).toHaveProperty('vegan', payload.vegan);
      expect(res.body).toHaveProperty('ecoFriendly', payload.ecoFriendly);
      expect(res.body).toHaveProperty('type', payload.type);
    });
  });
});