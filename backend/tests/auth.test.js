// tests/auth.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

// Connect to test database before running tests
beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/finance-tracker-test', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

// Clear database before each test
beforeEach(async () => {
    await User.deleteMany({});
});

// Close database connection after tests
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Authentication Endpoints', () => {
    const testUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
    };

    test('Should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('id');
        expect(res.body.user.name).toEqual(testUser.name);
        expect(res.body.user.email).toEqual(testUser.email);
    });

    test('Should not register a user with existing email', async () => {
        // Create a user first
        await User.create(testUser);

        // Try to register with the same email
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toEqual(false);
    });

    test('Should login an existing user', async () => {
        // Create a user first
        await request(app)
            .post('/api/auth/register')
            .send(testUser);

        // Login with created user
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('id');
        expect(res.body.user.name).toEqual(testUser.name);
    });

    test('Should not login with invalid credentials', async () => {
        // Create a user first
        await request(app)
            .post('/api/auth/register')
            .send(testUser);

        // Try to login with wrong password
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: 'wrongpassword'
            });

        expect(res.statusCode).toEqual(401);
        expect(res.body.success).toEqual(false);
    });
});