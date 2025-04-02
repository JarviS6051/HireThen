// tests/budget.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Budget = require('../models/Budget');

let token;
let userId;

// Connect to test database before running tests
beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/finance-tracker-test', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    // Create a test user and get token
    const testUser = {
        name: 'Test User',
        email: 'budget-test@example.com',
        password: 'password123'
    };

    const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

    token = res.body.token;
    userId = res.body.user.id;
});

// Clear budgets before each test
beforeEach(async () => {
    await Budget.deleteMany({});
});

// Close database connection after tests
afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
});

describe('Budget Endpoints', () => {
    const testBudget = {
        category: 'Groceries',
        amount: 500,
        period: 'monthly',
        alertThreshold: 0.8
    };

    test('Should create a new budget', async () => {
        const res = await request(app)
            .post('/api/budgets')
            .set('Authorization', `Bearer ${token}`)
            .send(testBudget);

        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toEqual(true);
        expect(res.body.data).toHaveProperty('_id');
        expect(res.body.data.category).toEqual(testBudget.category);
        expect(res.body.data.amount).toEqual(testBudget.amount);
        expect(res.body.data.user.toString()).toEqual(userId);
    });

    test('Should get all budgets for a user', async () => {
        // Create two budgets
        await Budget.create({
            ...testBudget,
            user: userId
        });

        await Budget.create({
            category: 'Entertainment',
            amount: 200,
            period: 'monthly',
            user: userId
        });

        const res = await request(app)
            .get('/api/budgets')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toEqual(true);
        expect(res.body.count).toEqual(2);
        expect(Array.isArray(res.body.data)).toBeTruthy();
    });

    test('Should get a single budget', async () => {
        // Create a budget
        const budget = await Budget.create({
            ...testBudget,
            user: userId
        });

        const res = await request(app)
            .get(`/api/budgets/${budget._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toEqual(true);
        expect(res.body.data._id.toString()).toEqual(budget._id.toString());
    });

    test('Should update a budget', async () => {
        // Create a budget
        const budget = await Budget.create({
            ...testBudget,
            user: userId
        });

        const updatedData = {
            amount: 600,
            alertThreshold: 0.7
        };

        const res = await request(app)
            .put(`/api/budgets/${budget._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedData);

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toEqual(true);
        expect(res.body.data.amount).toEqual(updatedData.amount);
        expect(res.body.data.alertThreshold).toEqual(updatedData.alertThreshold);
        // Original fields should remain unchanged
        expect(res.body.data.category).toEqual(testBudget.category);
    });

    test('Should delete a budget', async () => {
        // Create a budget
        const budget = await Budget.create({
            ...testBudget,
            user: userId
        });

        const res = await request(app)
            .delete(`/api/budgets/${budget._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toEqual(true);

        // Verify budget is deleted
        const deletedBudget = await Budget.findById(budget._id);
        expect(deletedBudget).toBeNull();
    });
});