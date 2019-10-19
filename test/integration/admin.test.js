const request = require('supertest');
const { User } = require('../../models/user');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
let server;
let user;
let token;

describe('admin authentication', () => {
  beforeEach(async () => {
    server = require('../../index');

    // Create a test user
    user = new User({
      name: "Test User",
      email: "test@user.com",
      password: "P@ssword!",
      isAdmin: true
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    token = user.generateAuthToken();
  });

  afterEach(async () => {
    await User.deleteMany({});
    await server.close();
  });

  const exec = () => {
    return request(server)
      .get('/api/users/')
      .set('x-auth-token', token)
  };

  // It should return 403 if the user is not an admin
  it('should return 403 if the user is not an admin', async () => {
    user.isAdmin = false;
    token = user.generateAuthToken();

    const res = await exec();
    expect(res.status).toBe(403);
  });

  it('should return 200 (in test case) if admin is user', async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
});