require("dotenv").config()
// Load the Express application instance from src/app.js
const app = require("./src/app.js")
const connectToDB = require("./src/config/database.js")
connectToDB()
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})
