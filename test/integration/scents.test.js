const { User } = require('../../models/user');
const { Scent } = require('../../models/scent');
const request = require('supertest');
const mongoose = require('mongoose');

let server;

// test scent api
describe('/api/scents', () => {
  beforeEach(async () => {
    server = require('../../index');
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Scent.deleteMany({});
    await server.close();
  });

  /**********************************************
   *  GET all dyes from database
   **********************************************/
  describe('GET /', () => {
    let admin;
    let token;
    let scent;

    beforeEach(async () => {
      admin = new User({
        name: 'testAdmin',
        email: 'test@admin.com',
        password: 'P@ssword2!',
        isAdmin: true
      });

      token = admin.generateAuthToken();
      await admin.save();

      scent = new Scent({
        name: "testScent",
        soapSafe: true,
        candleSafe: true,
        lotionSafe: true,
        phthalateFree: true,
        prop65: true,
        vegan: true,
        ecoFriendly: true
      });

      await scent.save();
    });

    const exec = () => {
      return request(server)
        .get('/api/scents')
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

    it('should return scents on success', async () => {
      const res = await exec();

      expect(res.body.length).toBe(1);
    });

    it('should return nothing if no scents in database', async () => {
      await Scent.deleteMany({});

      const res = await exec();

      expect(res.body.length).toBe(0);
    });
  });

  /**********************************************
   *  GET scent with given Id
   **********************************************/
  describe('GET /:id', () => {
    let admin;
    let scent;
    let adminToken;
    let scentId;

    beforeEach(async () => {
      admin = new User({
        name: 'testAdmin',
        email: 'test@admin.com',
        password: 'P@ssword2!',
        isAdmin: true
      });

      adminToken = admin.generateAuthToken();
      await admin.save();

      scent = new Scent({
        name: "testScent",
        soapSafe: true,
        candleSafe: true,
        lotionSafe: true,
        phthalateFree: true,
        prop65: true,
        vegan: true,
        ecoFriendly: true
      });

      scentId = scent._id;
      await scent.save();
    });

    const exec = () => {
      return request(server)
        .get('/api/scents/' + scentId)
        .set('x-auth-token', adminToken);
    }

    it('should return 401 if no token is provided', async () => {
      adminToken = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return 403 if user is not an admin', async () => {
      adminToken = new User().generateAuthToken();

      const res = await exec();
      expect(res.status).toBe(403);
    });

    it('should return 400 if the id is invalid', async () => {
      scentId = 123;

      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 404 if the scent id does not exist', async () => {
      scentId = new mongoose.Types.ObjectId().toHexString();;

      const res = await exec();
      expect(res.status).toBe(404);
    });

    it('should return 200 if request is successful', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('should return the correct scent on success', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('name');
    });
  });


  /**********************************************
   *  POST scent to database
   **********************************************/
  describe('POST /', () => {
    let admin;
    let adminToken;
    let scentName;
    let scentPayload;

    beforeEach(async () => {
      admin = new User({
        name: 'testAdmin',
        email: 'test@admin.com',
        password: 'P@ssword2!',
        isAdmin: true
      });

      adminToken = admin.generateAuthToken();
      await admin.save();

      scentPayload = {
        name: 'testScent',
        soapSafe: true,
        candleSafe: true,
        lotionSafe: true,
        phthalateFree: true,
        prop65: true,
        vegan: true,
        ecoFriendly: true
      };
    });

    const exec = () => {
      return request(server)
        .post('/api/scents')
        .set('x-auth-token', adminToken)
        .send(scentPayload);
    }

    it('should return 401 if no token is provided', async () => {
      adminToken = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 403 if user is not an admin', async () => {
      adminToken = new User().generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 400 if the name is missing', async () => {
      scentPayload = {
        soapSafe: true,
        candleSafe: true,
        lotionSafe: true,
        phthalateFree: true,
        prop65: true,
        vegan: true,
        ecoFriendly: true
      };

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if the name is less than 2 characters', async () => {
      scentPayload.name = 't';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if the name is more than 50 characters', async () => {
      scentPayload.name = 't' * 51;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if name is invalid', async () => {
      scentPayload = {
        name: 1234,
        soapSafe: true,
        candleSafe: true,
        lotionSafe: true,
        phthalateFree: true,
        prop65: true,
        vegan: true
      };

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if name is missing', async () => {
      scentPayload = {
        soapSafe: true,
        candleSafe: true,
        lotionSafe: true,
        phthalateFree: true,
        prop65: true,
        vegan: true
      };

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if a boolean flag is invalid', async () => {
      scentPayload = {
        name: 'testScent',
        soapSafe: 'true',
        candleSafe: true,
        lotionSafe: true,
        phthalateFree: true,
        prop65: true,
        vegan: true
      };

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if a flag is missing', async () => {
      scentPayload = {
        name: 'testScent',
        soapSafe: true,
        candleSafe: true,
        lotionSafe: true,
        phthalateFree: true,
        prop65: true,
        vegan: true
      };

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if an identical scent exists', async () => {
      const scent = new Scent(scentPayload);
      await scent.save();

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 200 if request is successful', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('should post scent to database on success', async () => {
      await exec();

      const dbScent = await Scent.find({ name: scentPayload.name });

      expect(dbScent.length).toBe(1);
      expect(dbScent[0].name).toBe('testScent');
    });

    it('should return posted scent on success', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('name');
    });
  });

  /**********************************************
   *  PUT/update dye with id in the database
   **********************************************/
  describe('PUT /:id', () => {
    let admin;
    let adminToken;
    let scent;
    let scentId;
    let scentPayload;

    beforeEach(async () => {
      admin = new User({
        name: 'testAdmin',
        email: 'test@admin.com',
        password: 'P@ssword2!',
        isAdmin: true
      });

      adminToken = admin.generateAuthToken();
      await admin.save();

      scentPayload = {
        name: 'testScent'
      };

      scent = new Scent(scentPayload);

      scentId = scent._id;
      await scent.save();
    });

    const exec = () => {
      return request(server)
        .put('/api/scents/' + scentId)
        .set('x-auth-token', adminToken)
        .send(scentPayload);
    }

    it('should return 401 if no token is provided', async () => {
      adminToken = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 403 if the user is not an admin', async () => {
      adminToken = new User().generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 400 if the object id is invalid', async () => {
      scentId = '123';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if scent id does not match any in database', async () => {
      scentId = new mongoose.Types.ObjectId().toHexString();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 400 if name is less than 2 characters', async () => {
      scentPayload.name = 't';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if name is more than 50 characters', async () => {
      scentPayload.name = 't' * 51;

      const res = await exec();

      expect(res.status).toBe(400);
    });


    it('should return 400 if name is invalid', async () => {
      scentPayload = {
        name: 1234,
        soapSafe: true,
        candleSafe: true,
        lotionSafe: true,
        phthalateFree: true,
        prop65: true,
        vegan: true
      };

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if name is missing', async () => {
      scentPayload = {
        soapSafe: true,
        candleSafe: true,
        lotionSafe: true,
        phthalateFree: true,
        prop65: true,
        vegan: true
      };

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if property is invalid', async () => {
      scentPayload = {
        name: scentPayload.name,
        prop65: 't'
      };

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 200 on success', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('should allow updating parameters other than name', async () => {
      scentPayload = {
        name: scentPayload.name,
        prop65: true
      };

      const res = await exec();

      expect(res.body).toHaveProperty('prop65', true);
    });

    it('should return updated scent on success', async () => {
      scentPayload.name = 'newTestName';

      const res = await exec();

      expect(res.body).toHaveProperty('name', 'newTestName');
    });

    it('should update scent in database on success', async () => {
      scentPayload.name = 'newTestName';

      await exec();

      const dbScent = await Scent.findById(scentId);

      expect(dbScent.name).toBe('newTestName');
    });
  });

  /**********************************************
   *  DELETE dye with id from database
   **********************************************/
  describe('DELETE /:id', () => {
    let admin;
    let adminToken;
    let scent;
    let scentId;

    beforeEach(async () => {
      admin = new User({
        name: 'testAdmin',
        email: 'test@admin.com',
        password: 'P@ssword2!',
        isAdmin: true
      });

      adminToken = admin.generateAuthToken();
      await admin.save();

      scent = new Scent({
        name: 'testScent',
        soapSafe: true,
        candleSafe: true,
        lotionSafe: true,
        phthalateFree: true,
        prop65: true,
        vegan: true,
        ecoFriendly: true
      });

      scentId = scent._id;
      await scent.save();
    });

    const exec = () => {
      return request(server)
        .delete('/api/scents/' + scentId)
        .set('x-auth-token', adminToken);
    }

    it('should return 401 if no token is provided', async () => {
      adminToken = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 403 if the user is not an admin', async () => {
      adminToken = new User().generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 400 if the object id is invalid', async () => {
      scentId = '123';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if scent id does not match any in database', async () => {
      scentId = new mongoose.Types.ObjectId().toHexString();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 200 on success', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('should return deleted scent on success', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('prop65');
    });

    it('should remove scent from database when finished', async () => {
      const res = await exec();

      const dbScent = await Scent.findById(scentId);

      expect(dbScent).toBe(null);
    });
  });
});