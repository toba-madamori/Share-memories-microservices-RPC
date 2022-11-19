require('dotenv').config()
const connectDb = require('./Config/db')
const app = require('./Utils/express-app')
const logger = require('./Utils/logger')
// port
const port = process.env.PORT

// server
const start = async () => {
    try {
        await connectDb(process.env.MONGO_URI)
        app.listen(port, () => logger.info(`authentication service is running on port ${port}`))
    } catch (error) {
        logger.error(error.message)
    }
}

start()
