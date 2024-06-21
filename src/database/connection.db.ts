import logger from "@/utils/logger";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/music}`
    );

    logger.info(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    logger.error("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export default connectDB;
