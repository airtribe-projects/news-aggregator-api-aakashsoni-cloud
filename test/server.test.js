const tap = require('tap');
const supertest = require('supertest');
const app = require('../app');
const server = supertest(app);

const mockUser = {
    name: 'Clark Kent',
    email: 'clark@superman.com',
    password: 'Krypt()n8',
    preferences:['movies', 'comics']
};

let token = '';

// Auth tests

tap.test('POST /users/signup', async (t) => { 
    const response = await server.post('/api/v1/users/signup').send(mockUser);
    console.log('response:', response.status);
    t.equal(response.status, 201);
    t.end();
});

tap.test('POST /users/signup with missing email', async (t) => {
    const response = await server.post('/api/v1/users/signup').send({
        name: mockUser.name,
        password: mockUser.password
    });
    t.equal(response.status, 400);
    t.end();
});

tap.test('POST /api/v1/users/login', async (t) => { 
    const response = await server.post('/api/v1/users/login').send({
        email: mockUser.email,
        password: mockUser.password
    });
    t.equal(response.status, 200);
    t.hasOwnProp(response.body, 'token');
    token = response.body.token;
    t.end();
});

tap.test('POST /api/v1/users/login with wrong password', async (t) => {
    const response = await server.post('/api/v1/users/login').send({
        email: mockUser.email,
        password: 'wrongpassword'
    });
    t.equal(response.status, 401);
    t.end();
});

// Preferences tests

tap.test('GET /api/v1/users/preferences', async (t) => {
    const response = await server.get('/api/v1/users/preferences').set('Authorization', `Bearer ${token}`);
    t.equal(response.status, 200);
    t.hasOwnProp(response.body, 'preferences');
    t.same(response.body.preferences, mockUser.preferences);
    t.end();
});

tap.test('GET /api/v1/users/preferences without token', async (t) => {
    const response = await server.get('/api/v1/users/preferences');
    t.equal(response.status, 401);
    t.end();
});

tap.test('PUT /api/v1/users/preferences', async (t) => {
    const response = await server.put('/api/v1/users/preferences').set('Authorization', `Bearer ${token}`).send({
        preferences: ['movies', 'comics', 'games']
    });
    t.equal(response.status, 200);
});

tap.test('Check PUT /api/v1/users/preferences', async (t) => {
    const response = await server.get('/api/v1/users/preferences').set('Authorization', `Bearer ${token}`);
    t.equal(response.status, 200);
    t.same(response.body.preferences, ['movies', 'comics', 'games']);
    t.end();
});

// News tests

tap.test('GET /api/v1/news', async (t) => {
    const response = await server.get('/api/v1/news').set('Authorization', `Bearer ${token}`);
    t.equal(response.status, 200);
    t.hasOwnProp(response.body, 'news');
    t.end();
});

tap.test('GET /api/v1/news without token', async (t) => {
    const response = await server.get('/api/v1/news');
    t.equal(response.status, 401);
    t.end();
});



tap.teardown(() => {
    process.exit(0);
});