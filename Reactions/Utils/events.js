const axios = require('axios')

const publishMemoryEvent = async (payload) => {
    const response = await axios.post('http://localhost:8000/api/v1/memories/app-events', { payload })
    return response
}

module.exports = {
    publishMemoryEvent
}
