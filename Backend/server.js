const chalk = require("chalk")
const {setServers} = require("dns/promises")
setServers(["8.8.8.8" , "8.8.4.4"])
const app = require("./app")
const connectDB = require("./config/connectDB")
connectDB()
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(chalk.bgGreen(`Server is running at: http://localhost:${port}`));
})
module.exports = app;