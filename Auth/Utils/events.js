/* eslint-disable camelcase */
const amqplib = require('amqplib')

/* -----------------Message broker----------------------------- */

// create channel

const createChannel = async () => {
    const connection = await amqplib.connect(process.env.MESSAGE_BROKER_URL)
    const channel = await connection.createChannel()
    await channel.assertExchange(process.env.EXCHANGE_NAME, 'direct', { durable: true })
    return channel
}

// subscribe requests
const RPCobserver = async (service) => {
    const channel = await createChannel()
    const appQueue = await channel.assertQueue(process.env.QUEUE_NAME)

    channel.bindQueue(appQueue.queue, process.env.EXCHANGE_NAME, process.env.QUEUE_NAME) // QUEUE_NAME has same value as the binding key that's why its just used here
    channel.prefetch(1)

    channel.consume(appQueue.queue, async (data) => {
        const response = await service.SubscribeEvents(data.content.toString())
        channel.sendToQueue(data.properties.replyTo, Buffer.from(JSON.stringify(response)), { correlationId: data.properties.correlationId })
        channel.ack(data)
    })
}

module.exports = {
    createChannel,
    RPCobserver
}
