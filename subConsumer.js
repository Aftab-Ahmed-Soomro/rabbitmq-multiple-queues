const amqp = require("amqplib")

async function recvMail() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        await channel.assertQueue("subscribed_users_mail_queue", { durable: true });

        channel.consume("subscribed_users_mail_queue", (message) => {
            if (message != null) {
                console.log("Message Received of Sub User: ", JSON.parse(message.content))
                channel.ack(message)
            }
        })
    } catch (error) {
        console.log(error)
    }
}

recvMail()