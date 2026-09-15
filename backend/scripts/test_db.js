// Dev-only script: inspects users/reports in the connected DB. Not run in production.
require('dotenv').config();
const mongoose = require('mongoose');
const userModel = require('./src/models/user.model.js');
const interviewReportModel = require('./src/models/inteviewReport.model.js');

async function test() {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await userModel.find({});
    console.log("Users:", users.map(u => ({ id: u._id, username: u.username })));
    
    const reports = await interviewReportModel.find({});
    console.log("Reports:", reports.map(r => ({ id: r._id, title: r.title, user: r.user })));
    process.exit(0);
}
test();
