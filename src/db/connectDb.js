import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URL}/${process.env.DB_NAME}`
    );
    console.log(
      `MongoDb Connected Successfully !! DB_Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDb Connection Failed !!", error);
    process.exit(1);
  }
};

export { connectDb };
