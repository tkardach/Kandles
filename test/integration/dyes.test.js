const { User } = require('../../models/user');
const { Dye } = require('../../models/dye');
const request = require('supertest');
const mongoose = require('mongoose');

let server;

// test dye api
describe('/api/dyes', () => {
  beforeEach(() => {
    server = require('../../index');
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Dye.deleteMany({});
    await server.close();
  });

  /**********************************************
   *  GET all dyes 
   **********************************************/
  describe('GET /', () => {
    let admin;
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

      const dye1 = new Dye({ name: 'dye1' });
      await dye1.save();

      const dye2 = new Dye({ name: 'dye2' });
      await dye2.save();
    });

    const exec = () => {
      return request(server)
        .get('/api/dyes')
        .set('x-auth-token', token);
    }

    it('should return 401 if no token is provided', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if the user token is invalid', async () => {
      token = '123';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 403 if user is not an admin', async () => {
      token = new User().generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 200 on success', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('should return list of dyes if successful', async () => {
      const res = await exec();

      expect(res.body.length).toBe(2);
      expect(res.body.some(d => d.name == 'dye1')).toBeTruthy();
      expect(res.body.some(d => d.name == 'dye2')).toBeTruthy();
    });

    it('should return empty array if no dyes in database', async () => {
      await Dye.deleteMany({});

      const res = await exec();

      expect(res.body.length).toBe(0);
    });
  });

  /**********************************************
   *  GET dye with given Id
   **********************************************/
  describe('GET /:id', () => {
    let admin;
    let token;
    let dyeId;

    beforeEach(async () => {
      admin = new User({
        name: 'testAdmin',
        email: 'test@admin.com',
        password: 'P@ssword2!',
        isAdmin: true
      });

      token = admin.generateAuthToken();
      await admin.save();

      dyePayload = { 
        name: 'dye1',
        soapSafe: true,
        candleSafe: true,
        lotionSafe: true,
        prop65: true
      };

      const dye1 = new Dye(dyePayload);

      dyePayload.name = 'dye2';

      const dye2 = new Dye(dyePayload);
      dyeId = dye2._id;

      await dye1.save();
      await dye2.save();
    });

    const exec = () => {
      return request(server)
        .get('/api/dyes/' + dyeId)
        .set('x-auth-token', token);
    }

    it('should return 401 if token is missing', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async () => {
      token = '123';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 403 if user is not an admin', async () => {
      token = new User().generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 400 if objectId is invalid', async () => {
      dyeId = '123';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if object with id is not found', async () => {
      dyeId = new mongoose.Types.ObjectId().toHexString();

      const res = await exec();

      expect(res.status).toBe(404);
    });
    
    it('should return 200 on success', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('should return  dye on success', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('name', dyePayload.name);
    });
  });

  /**********************************************
   *  PUT/Update dye with given id
   **********************************************/
  describe('PUT /:id', () => {
    let admin;
    let token;
    let dyeId;
    let dyePayload;

    beforeEach(async () => {
      admin = new User({
        name: 'testAdmin',
        email: 'test@admin.com',
        password: 'P@ssword2!',
        isAdmin: true
      });

      token = admin.generateAuthToken();
      await admin.save();

      dyePayload = { 
        name: 'dye1',
        soapSafe: true,
        candleSafe: true,
        lotionSafe: true,
        prop65: true
      };

      const dye = new Dye(dyePayload);
      dyeId = dye._id;

      dyePayload.name = 'newDyeName';

      await dye.save();
    });

    const exec = () => {
      return request(server)
        .put('/api/dyes/' + dyeId)
        .set('x-auth-token', token)
        .send(dyePayload);
    }

    it('should return 401 if token is missing', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async () => {
      token = '123';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 403 if user is not an admin', async () => {
      token = new User().generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 400 if objectId is invalid', async () => {
      dyeId = '123';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if object with id is not found', async () => {
      dyeId = new mongoose.Types.ObjectId().toHexString();

      const res = await exec();

      expect(res.status).toBe(404);
    });
    
    it('should return 400 if name is invalid', async () => {
      dyePayload.name = 123;

      const res = await exec();

      expect(res.status).toBe(400);
    });
    
    it('should return 400 if name is below 2 characters', async () => {
      dyePayload.name = '1';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if the name is above 50 characters', async () => {
      dyePayload.name = 'a' * 51;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if a bool value is invalid', async () => {
      dyePayload.prop65 = 'test';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 200 on success', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('should not change unspecified properties to their defaults', async () => {
      dyePayload = {
        name: 'newTestName'
      };

      const res = await exec();

      const dbDye = await Dye.findById(dyeId);

      expect(dbDye.prop65).toBe(true);
    });

    it('should change properties without specifying other properties', async () => {
      dyePayload = {
        name: 'newTestName'
      };

      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('should return updated dye on success', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('name', dyePayload.name);
    });
    
    it('should update the dye in the database on success', async () => {
      const res = await exec();

      const dbDye = await Dye.findById(dyeId);

      expect(dbDye.name).toBe(dyePayload.name);
    });
  });

  /**********************************************
   *  POST dye to database
   **********************************************/
  describe('POST /', () => {
    let admin;
    let token;
    let dyePayload;

    beforeEach(async () => {
      admin = new User({
        name: 'testAdmin',
        email: 'test@admin.com',
        password: 'P@ssword2!',
        isAdmin: true
      });

      token = admin.generateAuthToken();
      await admin.save();

      dyePayload = {
        name: 'dye1',
        soapSafe: true,
        candleSafe: false,
        lotionSafe: false,
        prop65: true
      };
    });

    const exec = () => {
      return request(server)
        .post('/api/dyes')
        .set('x-auth-token', token)
        .send(dyePayload);
    }

    it('should return 401 if the token is missing', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if the token is invalid', async () => {
      token = 1234;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 403 if the user is not an admin', async () => {
      token = new User().generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 400 if the name is less than 2 characters', async () => {
      dyePayload.name = '1';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if the name is greater than 50 characters', async () => {
      dyePayload.name = '1' * 51;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if the name is missing', async () => {
      dyePayload = {
        soapSafe: true,
        candleSafe: false,
        lotionSafe: false,
        prop65: true
      }

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if the name is invalid', async () => {
      dyePayload = {
        name: 1234,
        soapSafe: true,
        candleSafe: false,
        lotionSafe: false,
        prop65: true
      }

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if a bool property is missing', async () => {
      dyePayload = {
        name: 'dye1',
        candleSafe: false,
        lotionSafe: false,
        prop65: true
      }

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if a bool property is invalid', async () => {
      dyePayload = {
        name: 'dye1',
        soapSafe: 'notValid',
        candleSafe: false,
        lotionSafe: false,
        prop65: true
      }

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if an identical dye exists', async () => {
      const dye = new Dye(dyePayload);
      await dye.save();

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 200 on success', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('should return the dye on success', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('name', 'dye1');
    });

    it('should upload new dye to database on success', async () => {
      const res = await exec();

      const dbDye = await Dye.find({ name: dyePayload.name });

      expect(dbDye.length).toBe(1);
      expect(dbDye[0].name).toBe(dyePayload.name);
    });
  });

  /**********************************************
   *  DELETE dye with given id
   **********************************************/
  describe('DELETE /:id', () => {
    let admin;
    let token;
    let dyeId;
    let dyeName;

    beforeEach(async () => {
      admin = new User({
        name: 'testAdmin',
        email: 'test@admin.com',
        password: 'P@ssword2!',
        isAdmin: true
      });

      token = admin.generateAuthToken();
      await admin.save();

      dyeName = 'testDye';

      const dye = new Dye({
        name: dyeName,
        soapSafe: true,
        candleSafe: true,
        lotionSafe: true,
        prop65: true
      });
      dyeId = dye._id;

      await dye.save();
    });

    const exec = () => {
      return request(server)
        .delete('/api/dyes/' + dyeId)
        .set('x-auth-token', token);
    }

    it('should return 401 if token is missing', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async () => {
      token = '123';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 403 if user is not an admin', async () => {
      token = new User().generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 400 if objectId is invalid', async () => {
      dyeId = '123';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if object with id is not found', async () => {
      dyeId = new mongoose.Types.ObjectId().toHexString();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 200 on success', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('should return removed dye on success', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('name', dyeName);
    });
    
    it('should remove the dye from the database on success', async () => {
      const res = await exec();

      const dbDye = await Dye.findById(dyeId);

      expect(dbDye).toBe(null);
    });
  });
});