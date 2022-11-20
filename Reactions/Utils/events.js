/* eslint-disable camelcase */
const amqplib = require('amqplib')
const { randomUUID } = require('crypto')

/* -----------------Message broker----------------------------- */

// create channel

const createChannel = async () => {
    const connection = await amqplib.connect(process.env.MESSAGE_BROKER_URL)
    const channel = await connection.createChannel()
    await channel.assertExchange(process.env.EXCHANGE_NAME, 'direct', { durable: true })
    return channel
}

// Helper function

const requestData = async (binding_key, message) => {
    const channel = await createChannel()

    const q = await channel.assertQueue('', { exclusive: true })
    const uuid = randomUUID()

    channel.sendToQueue(
        binding_key,
        Buffer.from(message),
        {
            replyTo: q.queue,
            correlationId: uuid
        }
    )

    return new Promise((resolve, reject) => {
        // timeout incase the service is unable to fulfill the request.
        const timeout = setTimeout(() => {
            channel.close()
            resolve('API could not fullfil the request, please try again later.')
        }, 8000)

        channel.consume(
            q.queue,
            (data) => {
                if (data.properties.correlationId === uuid) {
                    resolve(JSON.parse(data.content.toString()))
                    clearTimeout(timeout)
                } else {
                    resolve('data Not found!')
                }
            },
            {
                noAck: true
            }
        )
    })
}

// publish requests

const RPCrequest = async (binding_key, message) => {
    return await requestData(binding_key, message)
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
    RPCrequest,
    RPCobserver
}
