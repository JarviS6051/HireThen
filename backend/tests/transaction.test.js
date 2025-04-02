// tests/transaction.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

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
        email: 'transaction-test@example.com',
        password: 'password123'
    };

    const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

    token = res.body.token;
    userId = res.body.user.id;
});

// Clear transactions before each test
beforeEach(async () => {
    await Transaction.deleteMany({});
});

// Close database connection after tests
afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
});

describe('Transaction Endpoints', () => {
    const testTransaction = {
        amount: 100.50,
        type: 'income',
        category: 'Salary',
        description: 'Monthly salary'
    };

    test('Should create a new transaction', async () => {
        const res = await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${token}`)
            .send(testTransaction);

        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toEqual(true);
        expect(res.body.data).toHaveProperty('_id');
        expect(res.body.data.amount).toEqual(testTransaction.amount);
        expect(res.body.data.type).toEqual(testTransaction.type);
        expect(res.body.data.user.toString()).toEqual(userId);
    });

    test('Should get all transactions for a user', async () => {
        // Create two transactions
        await Transaction.create({
            ...testTransaction,
            user: userId
        });

        await Transaction.create({
            amount: 50.25,
            type: 'expense',
            category: 'Groceries',
            description: 'Weekly groceries',
            user: userId
        });

        const res = await request(app)
            .get('/api/transactions')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toEqual(true);
        expect(res.body.count).toEqual(2);
        expect(Array.isArray(res.body.data)).toBeTruthy();
    });

    test('Should get a single transaction', async () => {
        // Create a transaction
        const transaction = await Transaction.create({
            ...testTransaction,
            user: userId
        });

        const res = await request(app)
            .get(`/api/transactions/${transaction._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toEqual(true);
        expect(res.body.data._id.toString()).toEqual(transaction._id.toString());
    });

    test('Should update a transaction', async () => {
        // Create a transaction
        const transaction = await Transaction.create({
            ...testTransaction,
            user: userId
        });

        const updatedData = {
            amount: 200,
            description: 'Updated description'
        };

        const res = await request(app)
            .put(`/api/transactions/${transaction._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedData);

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toEqual(true);
        expect(res.body.data.amount).toEqual(updatedData.amount);
        expect(res.body.data.description).toEqual(updatedData.description);
        // Original fields should remain unchanged
        expect(res.body.data.type).toEqual(testTransaction.type);
    });

    test('Should delete a transaction', async () => {
        // Create a transaction
        const transaction = await Transaction.create({
            ...testTransaction,
            user: userId
        });

        const res = await request(app)
            .delete(`/api/transactions/${transaction._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toEqual(true);

        // Verify transaction is deleted
        const deletedTransaction = await Transaction.findById(transaction._id);
        expect(deletedTransaction).toBeNull();
    });
});