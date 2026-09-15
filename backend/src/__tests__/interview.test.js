jest.mock("pdf-parse", () => {
    return {
        PDFParse: class {
            constructor() {}
            getText() { return Promise.resolve({ text: "fake resume content" }) }
        }
    }
});

const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const userModel = require('../models/user.model');
const interviewReportModel = require('../models/inteviewReport.model');

jest.mock('../services/ai.services', () => ({
    generateInterviewReport: jest.fn().mockResolvedValue({
        matchScore: 80,
        title: "Software Engineer",
        candidateProfile: { name: "Test", currentRole: "SE", experienceLevel: "mid", summary: "summary" },
        strengths: [{ strength: "JS", evidence: "test" }],
        technicalQuestions: [],
        behavioralQuestions: [],
        skillGaps: [],
        preparationPlan: []
    }),
    generateResumePdf: jest.fn().mockResolvedValue(Buffer.from("fake pdf"))
}));

let mongoServer;
let user1Cookie;
let user2Cookie;
let user1Id;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    const res1 = await request(app).post('/api/auth/register').send({
        username: 'user1', email: 'user1@example.com', password: 'password123'
    });
    user1Cookie = res1.headers['set-cookie'];
    user1Id = res1.body.user.id;

    const res2 = await request(app).post('/api/auth/register').send({
        username: 'user2', email: 'user2@example.com', password: 'password123'
    });
    user2Cookie = res2.headers['set-cookie'];
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await interviewReportModel.deleteMany({});
});

describe('Interview Endpoints', () => {
    it('should generate a report and persist candidateProfile and strengths', async () => {
        const res = await request(app)
            .post('/api/interview/')
            .set('Cookie', user1Cookie)
            .field('jobDescription', 'Test JD')
            .field('selfDescription', 'Test SD')
            .attach('resume', Buffer.from('fake resume'), { filename: 'resume.pdf', contentType: 'application/pdf' });

        expect(res.status).toBe(201);
        expect(res.body.interviewReport.candidateProfile).toBeDefined();
        
        const reportInDb = await interviewReportModel.findById(res.body.interviewReport._id);
        expect(reportInDb.candidateProfile.name).toBe("Test");
        expect(reportInDb.strengths.length).toBe(1);
    });

    it('should delete a report and return 404 on second attempt', async () => {
        const report = await interviewReportModel.create({
            user: user1Id,
            jobDescription: "JD",
            title: "SE",
            candidateProfile: { name: "Test", currentRole: "SE", experienceLevel: "mid", summary: "sum" }
        });

        const deleteRes = await request(app)
            .delete(`/api/interview/report/${report._id}`)
            .set('Cookie', user1Cookie);
        expect(deleteRes.status).toBe(200);

        const deleteRes2 = await request(app)
            .delete(`/api/interview/report/${report._id}`)
            .set('Cookie', user1Cookie);
        expect(deleteRes2.status).toBe(404);
    });

    it('should not allow a user to delete another user\'s report', async () => {
        const report = await interviewReportModel.create({
            user: user1Id,
            jobDescription: "JD",
            title: "SE",
            candidateProfile: { name: "Test", currentRole: "SE", experienceLevel: "mid", summary: "sum" }
        });

        const deleteRes = await request(app)
            .delete(`/api/interview/report/${report._id}`)
            .set('Cookie', user2Cookie);
        expect(deleteRes.status).toBe(404);
    });

    it('should not allow a user to fetch another user\'s report', async () => {
        const report = await interviewReportModel.create({
            user: user1Id,
            jobDescription: "JD",
            title: "SE",
            candidateProfile: { name: "Test", currentRole: "SE", experienceLevel: "mid", summary: "sum" }
        });

        const getRes = await request(app)
            .get(`/api/interview/report/${report._id}`)
            .set('Cookie', user2Cookie);
        expect(getRes.status).toBe(404);
    });
});
