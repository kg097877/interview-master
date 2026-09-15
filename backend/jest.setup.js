process.env.JWT_SECRET = "testsecret";
jest.setTimeout(30000);
jest.mock('./src/services/ai.services', () => ({
    generateInterviewReport: jest.fn(),
    generateResumePdf: jest.fn()
}), { virtual: true });
