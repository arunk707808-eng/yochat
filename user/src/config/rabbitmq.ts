import amqp from "amqplib"

let channel: amqp.Channel

export const connectRabbitMq = async()=>{
    try{
      const connection = await amqp.connect(
        {
          protocol: "amqp",
          hostname: process.env.RABBIT_HOSTNAME as string,
          port: 5672,
          username: process.env.RABBIT_USERNAME as string,
          password: process.env.RABBIT_PASSWORD as string,
        }
      );
      channel =await connection.createChannel()
      console.log("🐰 rabbitMQ connected")
    }catch(error){
      console.log("🐰 rabbitMQ error:" ,error)
    }
}

export const publishingToQueue = async (queueName:string, message:any)=>{
if(!channel){
  console.log("channel not initialize")
  return
}
await channel.assertQueue(queueName, {durable:true})
channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {persistent:true})
}