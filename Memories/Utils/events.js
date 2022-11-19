const axios = require('axios')

const publishReactionEvent = async (payload) => {
    const response = await axios.post('http://localhost:8000/api/v1/reactions/app-events', { payload })
    return response
}

module.exports = {
    publishReactionEvent
}
