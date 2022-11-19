require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const proxy = require('express-http-proxy')

app.use(cors())

app.use('/api/v1/auth', proxy('http://localhost:8001'))
app.use('/api/v1/users', proxy('http://localhost:8002'))
app.use('/api/v1/memories', proxy('http://localhost:8003'))
app.use('/api/v1/reactions', proxy('http://localhost:8004'))


const port = process.env.PORT

app.listen(port, ()=> console.log(`Gateway is listening on port: ${port}`))






