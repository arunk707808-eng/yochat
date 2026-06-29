import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL as string,
});

export const connectCacheDb = async () => {
  try {
    await redisClient.connect();
    console.log("Redis Connected");

    redisClient.on("error", (err) => {
      console.error("Redis Error:", err);
    });
  } catch (error) {
    console.log("Redis connection error", error);
  }
};