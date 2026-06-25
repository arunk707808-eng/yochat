import amqp from "amqplib";
import { createTransport } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export const startSendOtpConsumer = async () => {
    try {
        const connection = await amqp.connect({
            protocol: "amqp",
            hostname: process.env.RABBIT_HOSTNAME,
            port: 5672,
            username: process.env.RABBIT_USERNAME,
            password: process.env.RABBIT_PASSWORD,
        });
        const channel = await connection.createChannel();
        const queueName = "send-otp";
        await channel.assertQueue(queueName, { durable: true });
        console.log("cosumer started & listining for otp");
        channel.consume(queueName, async (msg) => {
            if (msg) {
                try {
                    const { to, subject, body } = JSON.parse(msg.content.toString());
                    const transport = createTransport({
                        host: "smtp.gmail.com",
                        port: 587,
                        secure: false,
                        auth: {
                            user: process.env.GMAIL,
                            pass: process.env.PASSWORD,
                        }
                    });
                    await transport.sendMail({
                        from: process.env.GMAIL,
                        to,
                        subject,
                        text: body
                    });
                    console.log(`otp sent to ${to}`);
                    channel.ack(msg);
                }
                catch (error) {
                    console.log("failed to send otp");
                }
            }
        });
    }
    catch (error) {
        console.log("failed to start rabbitMq consumer", error);
    }
};
//# sourceMappingURL=consume.js.map