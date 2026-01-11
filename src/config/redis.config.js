import IORedis from "ioredis";

const redisConnectionInstance = new IORedis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,

  maxRetriesPerRequest: null,
});

redisConnectionInstance.on("connect", () => {
  console.log("Redis connected");
});

redisConnectionInstance.on("error", (err) => {
  console.error("Redis error", err);
});

// console.log("RedisConnectionInstance : ", redisConnectionInstance);

export { redisConnectionInstance };
