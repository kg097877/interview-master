jest.mock("../services/ai.services", () => ({}));
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const userModel = require('../models/user.model');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await userModel.deleteMany({});
});

describe('Auth Endpoints', () => {
    it('should register a new user successfully', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });
        expect(res.status).toBe(201);
        expect(res.body.user.username).toBe('testuser');
        expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should fail registration on duplicate email', async () => {
        await userModel.create({
            username: 'user1',
            email: 'test@example.com',
            password: 'hashedpassword'
        });
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser2',
                email: 'test@example.com',
                password: 'password123'
            });
        expect(res.status).toBe(400);
    });

    it('should fail registration on short password', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'short'
            });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Validation failed");
    });

    it('should login with correct credentials', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });
        
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
        expect(res.status).toBe(200);
        expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should fail login with wrong password', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });
        
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword'
            });
        expect(res.status).toBe(400);
    });

    it('should logout and blacklist token', async () => {
        const loginRes = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });
        const cookie = loginRes.headers['set-cookie'];

        const logoutRes = await request(app)
            .post('/api/auth/logout')
            .set('Cookie', cookie);
        expect(logoutRes.status).toBe(200);

        const getMeRes = await request(app)
            .get('/api/auth/get-me')
            .set('Cookie', cookie);
        expect(getMeRes.status).toBe(401);
    });
});
