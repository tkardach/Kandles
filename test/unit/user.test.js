const { User } = require('../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const request = require('supertest');

describe('user.generateAuthToken', () => {
  it('should return a vlid JWT', () => {
    const paylod = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    };
    const user = new User(paylod);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    expect(decoded).toMatchObject(paylod)
  });
});

let server;

describe('/api/users', () => {
  let name;
  let email;
  let password;
  let isAdmin;

  beforeEach(() => {
    server = require('../../index');

    name = "Test User";
    email = "test@user.com";
    password = "P@ssword!";
    isAdmin = false;
  });

  afterEach(async () => {
    await User.deleteMany({});
    await server.close();
  });

  const exec = () => {
    return request(server)
      .post('/api/users')
      .send({ name, email, password, isAdmin });
  }

  // should not return anything if there are no users
  // 
  describe('GET /', () => {
    it('should return all users', async () => {
      await User.collection.insertMany([
        { name: name, email: email, password: password, isAdmin: isAdmin },
        { name: 'test2', email: 'test2@user.com', password: 'P@ssword2!', isAdmin: false }
      ]);

      const res = await request(server).get('/api/users');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(u => u.name === name)).toBeTruthy(); // Correct users returned
      expect(res.body.some(u => u.name === 'test2')).toBeTruthy();
    });
  });

});