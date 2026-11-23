const amqp = require("amqplib")

async function recvMail() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        await channel.assertQueue("users_mail_queue", { durable: true });

        channel.consume("users_mail_queue", (message) => {
            if (message != null) {
                console.log("Message Received of Norm User: ", JSON.parse(message.content))
                channel.ack(message)
            }
        })
    } catch (error) {
        console.log(error)
    }
}

recvMail()