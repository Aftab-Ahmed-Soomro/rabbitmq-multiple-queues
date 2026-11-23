const amqp = require("amqplib")

async function sendMail() {
    try {
        const connection = await amqp.connect("amqp://localhost")
        const channel = await connection.createChannel()
        const exchange = "mail_exchange"
        const usersRoutingKey = "send_mail_to_users"
        const subscribedUsersRoutingKey = "send_mail_to_subscribed_users"

        const message = {
            to: "Sub2@gmail.com",
            from: "test2@gmail.com",
            subject: "Thank You!",
            body: "Hello Test User",
            isSubscribed: false
        }

        const checkKey = message.isSubscribed ? subscribedUsersRoutingKey : usersRoutingKey

        await channel.assertExchange(exchange, "direct", {durable: true})
        await channel.assertQueue("subscribed_users_mail_queue", {durable: true})
        await channel.assertQueue("users_mail_queue", {durable: true})

        await channel.bindQueue("subscribed_users_mail_queue", exchange, subscribedUsersRoutingKey)
        await channel.bindQueue("users_mail_queue", exchange, usersRoutingKey)

        channel.publish(exchange, checkKey, Buffer.from(JSON.stringify(message)), {
            persistent: true
        })

        console.log("Mail data was sent: ", message);

        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.log(error)
    }
}

sendMail()